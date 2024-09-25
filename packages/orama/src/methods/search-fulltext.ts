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
import { getNanosecondsTime, removeVectorsFromHits, sortTokenScorePredicate } from '../utils.js'
import { defaultBM25Params, fetchDocuments, fetchDocumentsWithDistinct } from './search.js'

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
  const { limit = 10, offset = 0, term, properties, distinctOn, includeVectors = false } = params
  const isPreflight = params.preflight === true

  const index = orama.data.index

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

  // If filters are enabled, we need to get the IDs of the documents that match the filters.
  const hasFilters = Object.keys(params.where ?? {}).length > 0
  let whereFiltersIDs: InternalDocumentID[] = []

  if (hasFilters) {
    whereFiltersIDs = await orama.index.searchByWhereClause(index, orama.tokenizer, params.where!, language)
  }

  let uniqueDocsIDs: TokenScore[]
  // We need to perform the search if:
  // - we have a search term
  // - or we have properties to search
  //   in this case, we need to return all the documents that contains at least one of the given properties
  if (term || properties) {
    uniqueDocsIDs = await orama.index.search(
      index,
      term || '',
      orama.tokenizer,
      language,
      propertiesToSearch,
      params.exact || false,
      params.tolerance || 0,
      params.boost || {}
    )
  } else {
    // Tokenizer returns empty array and the search term is empty as well.
    // We return all the documents.
    uniqueDocsIDs = Object.keys(await orama.documentsStore.getAll(orama.data.docs)).map((k) => [+k, 0] as TokenScore)
  }

  // Get unique doc IDs from uniqueDocsIDs map
  // let uniqueDocsArray = Object.entries(context.uniqueDocsIDs).map(([id, score]) => [+id, score] as TokenScore)

  // If filters are enabled, we need to remove the IDs of the documents that don't match the filters.
  if (hasFilters) {
    uniqueDocsIDs = intersectFilteredIDs(whereFiltersIDs, uniqueDocsIDs)
  }

  if (params.sortBy) {
    if (typeof params.sortBy === 'function') {
      const ids = uniqueDocsIDs.map(([id]) => id)
      const docs = await orama.documentsStore.getMultiple(orama.data.docs, ids)
      const docsWithIdAndScore: CustomSorterFunctionItem<ResultDocument>[] = docs.map((d, i) => [
        uniqueDocsIDs[i][0],
        uniqueDocsIDs[i][1],
        d!
      ])
      docsWithIdAndScore.sort(params.sortBy)
      uniqueDocsIDs = docsWithIdAndScore.map(([id, score]) => [id, score])
    } else {
      uniqueDocsIDs = await orama.sorter
        .sortBy(orama.data.sorting, uniqueDocsIDs, params.sortBy)
        .then((results) =>
          results.map(([id, score]) => [getInternalDocumentId(orama.internalDocumentIDStore, id), score])
        )
    }
  } else {
    uniqueDocsIDs = uniqueDocsIDs.sort(sortTokenScorePredicate)
  }

  let results
  if (!isPreflight) {
    results = await (distinctOn
      ? fetchDocumentsWithDistinct(orama, uniqueDocsIDs, offset, limit, distinctOn)
      : fetchDocuments(orama, uniqueDocsIDs, offset, limit))
  }

  const searchResult: Results<ResultDocument> = {
    elapsed: {
      formatted: '',
      raw: 0
    },
    // We keep the hits array empty if it's a preflight request.
    hits: [],
    count: uniqueDocsIDs.length
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
    const facets = await getFacets(orama, uniqueDocsIDs, params.facets!)
    searchResult.facets = facets
  }

  if (params.groupBy) {
    searchResult.groups = await getGroups<T, ResultDocument>(orama, uniqueDocsIDs, params.groupBy)
  }

  if (orama.afterSearch) {
    await runAfterSearch(orama.afterSearch, orama, params, language, searchResult)
  }

  // Calculate elapsed time only at the end of the function
  searchResult.elapsed = (await orama.formatElapsedTime((await getNanosecondsTime()) - timeStart)) as ElapsedTime

  return searchResult
}
