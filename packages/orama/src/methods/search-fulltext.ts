import { prioritizeTokenScores } from '../components/algorithms.js'
import { getFacets } from '../components/facets.js'
import { intersectFilteredIDs } from '../components/filters.js'
import { getGroups } from '../components/groups.js'
import { runAfterSearch, runBeforeSearch } from '../components/hooks.js'
import type { InternalDocumentID } from '../components/internal-document-id-store.js'
import { getInternalDocumentId } from '../components/internal-document-id-store.js'
import { createError } from '../errors.js'
import type {
  AnyOrama,
  CustomSorterFunctionItem,
  ElapsedTime,
  Results,
  SearchParamsFullText,
  TokenScore,
  TypedDocument
} from '../types.js'
import { getNanosecondsTime, removeVectorsFromHits, safeArrayPush, sortTokenScorePredicate } from '../utils.js'
import { createSearchContext, defaultBM25Params, fetchDocuments, fetchDocumentsWithDistinct } from './search.js'

export function fullTextSearch<T extends AnyOrama, ResultDocument = TypedDocument<T>>(
  orama: T,
  params: SearchParamsFullText<T, ResultDocument>,
  language?: string
): Results<ResultDocument> | Promise<Results<ResultDocument>> {
  const timeStart = getNanosecondsTime()

  const asyncNeeded = orama.beforeSearch || orama.afterSearch

  function performSearchLogic(): Results<ResultDocument> {
    params.relevance = Object.assign(defaultBM25Params, params.relevance ?? {})

    const vectorProperties = Object.keys(orama.data.index.vectorIndexes)
    const shouldCalculateFacets = params.facets && Object.keys(params.facets).length > 0
    const { limit = 10, offset = 0, term, properties, threshold = 0, distinctOn, includeVectors = false } = params
    const isPreflight = params.preflight === true

    const { index, docs } = orama.data
    const tokens = orama.tokenizer.tokenize(term ?? '', language)

    let propertiesToSearch = orama.caches['propertiesToSearch'] as string[]
    if (!propertiesToSearch) {
      const propertiesToSearchWithTypes = orama.index.getSearchablePropertiesWithTypes(index)
      propertiesToSearch = orama.index.getSearchableProperties(index)
      propertiesToSearch = propertiesToSearch.filter((prop: string) =>
        propertiesToSearchWithTypes[prop].startsWith('string')
      )
      orama.caches['propertiesToSearch'] = propertiesToSearch
    }

    if (properties && properties !== '*') {
      for (const prop of properties) {
        if (!propertiesToSearch.includes(prop as string)) {
          throw createError('UNKNOWN_INDEX', prop as string, propertiesToSearch.join(', '))
        }
      }
      propertiesToSearch = propertiesToSearch.filter((prop: string) => (properties as string[]).includes(prop))
    }

    const context = createSearchContext(
      orama.tokenizer,
      orama.index,
      orama.documentsStore,
      language,
      params,
      propertiesToSearch,
      tokens,
      orama.documentsStore.count(docs),
      timeStart
    )

    const hasFilters = Object.keys(params.where ?? {}).length > 0
    let whereFiltersIDs: InternalDocumentID[] = []

    if (hasFilters) {
      whereFiltersIDs = orama.index.searchByWhereClause(context, index, params.where!)
    }

    const tokensLength = tokens.length
    if (tokensLength || properties?.length) {
      const indexesLength = propertiesToSearch.length
      for (let i = 0; i < indexesLength; i++) {
        const prop = propertiesToSearch[i]
        const docIds = context.indexMap[prop]

        if (tokensLength !== 0) {
          for (let j = 0; j < tokensLength; j++) {
            const term = tokens[j]
            const scoreList = orama.index.search(context, index, prop, term)
            safeArrayPush(docIds[term], scoreList)
          }
        } else {
          docIds[''] = []
          const scoreList = orama.index.search(context, index, prop, '')
          safeArrayPush(docIds[''], scoreList)
        }

        const vals = Object.values(docIds)
        context.docsIntersection[prop] = prioritizeTokenScores(vals, params?.boost?.[prop] ?? 1, threshold, tokensLength)
        const uniqueDocs = context.docsIntersection[prop]

        const uniqueDocsLength = uniqueDocs.length
        for (let i = 0; i < uniqueDocsLength; i++) {
          const [id, score] = uniqueDocs[i]
          const prevScore = context.uniqueDocsIDs[id]
          if (prevScore) {
            context.uniqueDocsIDs[id] = prevScore + score + 0.5
          } else {
            context.uniqueDocsIDs[id] = score
          }
        }
      }
    } else if (tokens.length === 0 && term) {
      context.uniqueDocsIDs = {}
    } else {
      context.uniqueDocsIDs = Object.fromEntries(
        Object.keys(orama.documentsStore.getAll(orama.data.docs)).map((k) => [k, 0])
      )
    }

    let uniqueDocsArray = Object.entries(context.uniqueDocsIDs).map(([id, score]) => [+id, score] as TokenScore)

    if (hasFilters) {
      uniqueDocsArray = intersectFilteredIDs(whereFiltersIDs, uniqueDocsArray)
    }

    if (params.sortBy) {
      if (typeof params.sortBy === 'function') {
        const ids = uniqueDocsArray.map(([id]) => id)
        const docs = orama.documentsStore.getMultiple(orama.data.docs, ids)
        const docsWithIdAndScore: CustomSorterFunctionItem<ResultDocument>[] = docs.map((d, i) => [
          uniqueDocsArray[i][0],
          uniqueDocsArray[i][1],
          d!
        ])
        docsWithIdAndScore.sort(params.sortBy)
        uniqueDocsArray = docsWithIdAndScore.map(([id, score]) => [id, score])
      } else {
        uniqueDocsArray = orama.sorter
          .sortBy(orama.data.sorting, uniqueDocsArray, params.sortBy)
          .map(([id, score]) => [getInternalDocumentId(orama.internalDocumentIDStore, id), score])
      }
    } else {
      uniqueDocsArray = uniqueDocsArray.sort(sortTokenScorePredicate)
    }

    let results
    if (!isPreflight) {
      results = distinctOn
        ? fetchDocumentsWithDistinct(orama, uniqueDocsArray, offset, limit, distinctOn)
        : fetchDocuments(orama, uniqueDocsArray, offset, limit)
    }

    const searchResult: Results<ResultDocument> = {
      elapsed: {
        formatted: '',
        raw: 0
      },
      hits: [],
      count: uniqueDocsArray.length
    }

    if (typeof results !== 'undefined') {
      searchResult.hits = results.filter(Boolean)
      if (!includeVectors) {
        removeVectorsFromHits(searchResult, vectorProperties)
      }
    }

    if (shouldCalculateFacets) {
      const facets = getFacets(orama, uniqueDocsArray, params.facets!)
      searchResult.facets = facets
    }

    if (params.groupBy) {
      searchResult.groups = getGroups<T, ResultDocument>(orama, uniqueDocsArray, params.groupBy)
    }

    searchResult.elapsed = orama.formatElapsedTime(
      getNanosecondsTime() - context.timeStart
    ) as ElapsedTime

    return searchResult
  }

  async function executeSearchAsync() {
    if (orama.beforeSearch) {
      await runBeforeSearch(orama.beforeSearch, orama, params, language)
    }

    const searchResult = performSearchLogic()

    if (orama.afterSearch) {
      await runAfterSearch(orama.afterSearch, orama, params, language, searchResult)
    }

    return searchResult
  }

  if (asyncNeeded) {
    return executeSearchAsync()
  }

  return performSearchLogic()
}
