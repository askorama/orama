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
import { filterAndReduceDocuments, getNanosecondsTime, removeVectorsFromHits, safeArrayPush, sortTokenScorePredicate } from '../utils.js'
import { createSearchContext, defaultBM25Params, fetchDocuments, fetchDocumentsWithDistinct } from './search.js'

export async function fullTextSearch<T extends AnyOrama, ResultDocument = TypedDocument<T>>(
  orama: T,
  params: SearchParamsFullText<T, ResultDocument>,
  language?: string
): Promise<Results<ResultDocument>> {
  const timeStart = await getNanosecondsTime()

  if (orama.beforeSearch) {
    await runBeforeSearch(orama.beforeSearch, orama, params, language)
  }

  params.relevance = Object.assign(defaultBM25Params, params.relevance ?? {})

  const vectorProperties = Object.keys(orama.data.index.vectorIndexes)

  const shouldCalculateFacets = params.facets && Object.keys(params.facets).length > 0
  const { limit = 10, offset = 0, term, properties, returning, threshold = 1, distinctOn, includeVectors = false } = params
  const isPreflight = params.preflight === true

  const { index, docs } = orama.data
  const tokens = await orama.tokenizer.tokenize(term ?? '', language)

  // Get searchable string properties
  let propertiesToSearch = orama.caches['propertiesToSearch'] as string[]
  if (!propertiesToSearch) {
    const propertiesToSearchWithTypes = await orama.index.getSearchablePropertiesWithTypes(index)

    propertiesToSearch = await orama.index.getSearchableProperties(index)
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

  // Create the search context and the results
  const context = await createSearchContext(
    orama.tokenizer,
    orama.index,
    orama.documentsStore,
    language,
    params,
    propertiesToSearch,
    tokens,
    await orama.documentsStore.count(docs),
    timeStart
  )

  // If filters are enabled, we need to get the IDs of the documents that match the filters.
  const hasFilters = Object.keys(params.where ?? {}).length > 0
  let whereFiltersIDs: InternalDocumentID[] = []

  if (hasFilters) {
    whereFiltersIDs = await orama.index.searchByWhereClause(context, index, params.where!)
  }

  const tokensLength = tokens.length

  if (tokensLength || properties?.length) {
    // Now it's time to loop over all the indices and get the documents IDs for every single term
    const indexesLength = propertiesToSearch.length
    for (let i = 0; i < indexesLength; i++) {
      const prop = propertiesToSearch[i]
      const docIds = context.indexMap[prop]

      if (tokensLength !== 0) {
        for (let j = 0; j < tokensLength; j++) {
          const term = tokens[j]

          // Lookup
          const scoreList = await orama.index.search(context, index, prop, term)

          safeArrayPush(docIds[term], scoreList)
        }
      } else {
        docIds[''] = []
        const scoreList = await orama.index.search(context, index, prop, '')
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
    // This case is hard to handle correctly.
    // For the time being, if tokenizer returns empty array but the term is not empty,
    // we returns an empty result set
    context.uniqueDocsIDs = {}
  } else {
    context.uniqueDocsIDs = Object.fromEntries(
      Object.keys(await orama.documentsStore.getAll(orama.data.docs)).map((k) => [k, 0])
    )
  }

  // Get unique doc IDs from uniqueDocsIDs map
  let uniqueDocsArray = Object.entries(context.uniqueDocsIDs).map(([id, score]) => [+id, score] as TokenScore)

  // If filters are enabled, we need to remove the IDs of the documents that don't match the filters.
  if (hasFilters) {
    uniqueDocsArray = intersectFilteredIDs(whereFiltersIDs, uniqueDocsArray)
  }

  if (params.sortBy) {
    if (typeof params.sortBy === 'function') {
      const ids = uniqueDocsArray.map(([id]) => id)
      const docs = await orama.documentsStore.getMultiple(orama.data.docs, ids)
      const docsWithIdAndScore: CustomSorterFunctionItem<ResultDocument>[] = docs.map((d, i) => [
        uniqueDocsArray[i][0],
        uniqueDocsArray[i][1],
        d!
      ])
      docsWithIdAndScore.sort(params.sortBy)
      uniqueDocsArray = docsWithIdAndScore.map(([id, score]) => [id, score])
    } else {
      uniqueDocsArray = await orama.sorter
        .sortBy(orama.data.sorting, uniqueDocsArray, params.sortBy)
        .then((results) =>
          results.map(([id, score]) => [getInternalDocumentId(orama.internalDocumentIDStore, id), score])
        )
    }
  } else {
    uniqueDocsArray = uniqueDocsArray.sort(sortTokenScorePredicate)
  }

  let results
  if (!isPreflight) {
    results = await (distinctOn
      ? fetchDocumentsWithDistinct(orama, uniqueDocsArray, offset, limit, distinctOn)
      : fetchDocuments(orama, uniqueDocsArray, offset, limit))
  }

  const searchResult: Results<ResultDocument> = {
    elapsed: {
      formatted: '',
      raw: 0
    },
    // We keep the hits array empty if it's a preflight request.
    hits: [],
    count: uniqueDocsArray.length
  }

  if (typeof results !== 'undefined') {
    searchResult.hits = filterAndReduceDocuments(results, returning)

    // Vectors can be very large, so we remove them from the result if not needed
    if (!includeVectors && typeof returning === 'undefined') {
      removeVectorsFromHits(searchResult, vectorProperties)
    }
  }

  if (shouldCalculateFacets) {
    // Populate facets if needed
    const facets = await getFacets(orama, uniqueDocsArray, params.facets!)
    searchResult.facets = facets
  }

  if (params.groupBy) {
    searchResult.groups = await getGroups<T, ResultDocument>(orama, uniqueDocsArray, params.groupBy)
  }

  if (orama.afterSearch) {
    await runAfterSearch(orama.afterSearch, orama, params, language, searchResult)
  }

  // Calculate elapsed time only at the end of the function
  searchResult.elapsed = (await orama.formatElapsedTime(
    (await getNanosecondsTime()) - context.timeStart
  )) as ElapsedTime

  return searchResult
}
