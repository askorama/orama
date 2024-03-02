import type {
  AnyOrama,
  TypedDocument,
  SearchParamsFullText,
  Results,
  CustomSorterFunctionItem,
  TokenScore,
  ElapsedTime
} from '../types.ts'
import type { InternalDocumentID } from '../components/internal-document-id-store.ts'
import { getInternalDocumentId } from '../components/internal-document-id-store.ts'
import { getNanosecondsTime, removeVectorsFromHits, safeArrayPush, sortTokenScorePredicate } from '../utils.ts'
import { intersectFilteredIDs } from '../components/filters.ts'
import { prioritizeTokenScores } from '../components/algorithms.ts'
import { createError } from '../errors.ts'
import { createSearchContext, defaultBM25Params, fetchDocumentsWithDistinct, fetchDocuments } from './search.ts'
import { getFacets } from '../components/facets.ts'
import { getGroups } from '../components/groups.ts'
import { runBeforeSearch, runAfterSearch } from '../components/hooks.ts'

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
  const { limit = 10, offset = 0, term, properties, threshold = 1, distinctOn, includeVectors = false } = params
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

  if (tokensLength || (properties && properties.length > 0)) {
    // Now it's time to loop over all the indices and get the documents IDs for every single term
    const indexesLength = propertiesToSearch.length
    for (let i = 0; i < indexesLength; i++) {
      const prop = propertiesToSearch[i]

      if (tokensLength !== 0) {
        for (let j = 0; j < tokensLength; j++) {
          const term = tokens[j]

          // Lookup
          const scoreList = await orama.index.search(context, index, prop, term)

          safeArrayPush(context.indexMap[prop][term], scoreList)
        }
      } else {
        context.indexMap[prop][''] = []
        const scoreList = await orama.index.search(context, index, prop, '')
        safeArrayPush(context.indexMap[prop][''], scoreList)
      }

      const docIds = context.indexMap[prop]
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
  if (!isPreflight && distinctOn) {
    results = await fetchDocumentsWithDistinct(orama, uniqueDocsArray, offset, limit, distinctOn)
  } else if (!isPreflight) {
    results = await fetchDocuments(orama, uniqueDocsArray, offset, limit)
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
    searchResult.hits = results.filter(Boolean)

    // Vectors can be very large, so we remove them from the result if not needed
    if (!includeVectors) {
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
