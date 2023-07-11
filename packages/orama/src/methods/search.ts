import { prioritizeTokenScores } from '../components/algorithms.js'
import { getFacets } from '../components/facets.js'
import { intersectFilteredIDs } from '../components/filters.js'
import { getGroups } from '../components/groups.js'
import { runAfterSearch } from '../components/hooks.js'
import { InternalDocumentID } from "../components/internal-document-store.js";
import { createError } from '../errors.js'
import {
  BM25Params,
  IndexMap,
  Orama,
  Result,
  Results,
  SearchContext,
  SearchParams,
  TokenMap,
  ElapsedTime,
  IIndex,
  Tokenizer,
  IDocumentsStore,
  CustomSorterFunctionItem,
  OpaqueIndex,
  OpaqueDocumentStore,
  SearchableValue, TokenScore
} from "../types.js";
import { getNanosecondsTime, getNested, sortTokenScorePredicate } from '../utils.js'

const defaultBM25Params: BM25Params = {
  k: 1.2,
  b: 0.75,
  d: 0.5,
}

async function createSearchContext<I extends OpaqueIndex, D extends OpaqueDocumentStore, AggValue>(
  tokenizer: Tokenizer,
  index: IIndex<I>,
  documentsStore: IDocumentsStore<D>,
  language: string | undefined,
  params: SearchParams<AggValue>,
  properties: string[],
  tokens: string[],
  docsCount: number,
  timeStart: bigint,
): Promise<SearchContext<I, D, AggValue>> {
  // If filters are enabled, we need to get the IDs of the documents that match the filters.
  // const hasFilters = Object.keys(params.where ?? {}).length > 0;
  // let whereFiltersIDs: string[] = [];

  // if (hasFilters) {
  //   whereFiltersIDs = getWhereFiltersIDs(params.where!, orama);
  // }

  // indexMap is an object containing all the indexes considered for the current search,
  // and an array of doc IDs for each token in all the indices.
  //
  // Given the search term "quick brown fox" on the "description" index,
  // indexMap will look like this:
  //
  // {
  //   description: {
  //     quick: [doc1, doc2, doc3],
  //     brown: [doc2, doc4],
  //     fox:   [doc2]
  //   }
  // }
  const indexMap: IndexMap = {}

  // After we create the indexMap, we need to calculate the intersection
  // between all the postings lists for each token.
  // Given the example above, docsIntersection will look like this:
  //
  // {
  //   description: [doc2]
  // }
  //
  // as doc2 is the only document present in all the postings lists for the "description" index.
  const docsIntersection: TokenMap = {}

  for (const prop of properties) {
    const tokensMap: TokenMap = {}
    for (const token of tokens) {
      tokensMap[token] = []
    }
    indexMap[prop] = tokensMap
    docsIntersection[prop] = []
  }

  return {
    timeStart,
    tokenizer,
    index,
    documentsStore,
    language,
    params,
    docsCount,
    uniqueDocsIDs: {},
    indexMap,
    docsIntersection,
  }
}

export async function search<AggValue = Result[]>(
  orama: Orama,
  params: SearchParams<AggValue>,
  language?: string,
): Promise<Results<AggValue>> {
  const timeStart = await getNanosecondsTime()

  params.relevance = Object.assign(params.relevance ?? {}, defaultBM25Params)

  const shouldCalculateFacets = params.facets && Object.keys(params.facets).length > 0
  const { limit = 10, offset = 0, term, properties, threshold = 1, distinctOn } = params
  const isPreflight = params.preflight === true

  const { index, docs } = orama.data
  const tokens = await orama.tokenizer.tokenize(term ?? '', language)

  // Get searchable string properties
  let propertiesToSearch = orama.caches['propertiesToSearch'] as string[]
  if (!propertiesToSearch) {
    const propertiesToSearchWithTypes = await orama.index.getSearchablePropertiesWithTypes(index)

    propertiesToSearch = await orama.index.getSearchableProperties(index)
    propertiesToSearch = propertiesToSearch.filter((prop: string) =>
      propertiesToSearchWithTypes[prop].startsWith('string'),
    )

    orama.caches['propertiesToSearch'] = propertiesToSearch
  }

  if (properties && properties !== '*') {
    for (const prop of properties) {
      if (!propertiesToSearch.includes(prop)) {
        throw createError('UNKNOWN_INDEX', prop, propertiesToSearch.join(', '))
      }
    }

    propertiesToSearch = propertiesToSearch.filter((prop: string) => properties.includes(prop))
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
    timeStart,
  )

  // If filters are enabled, we need to get the IDs of the documents that match the filters.
  const hasFilters = Object.keys(params.where ?? {}).length > 0
  let whereFiltersIDs: number[] = []

  if (hasFilters) {
    whereFiltersIDs = await orama.index.searchByWhereClause(context, index, params.where!)
  }

  if (tokens.length) {
    // Now it's time to loop over all the indices and get the documents IDs for every single term
    const indexesLength = propertiesToSearch.length
    for (let i = 0; i < indexesLength; i++) {
      const prop = propertiesToSearch[i]

      const tokensLength = tokens.length
      for (let j = 0; j < tokensLength; j++) {
        const term = tokens[j]

        // Lookup
        const scoreList = await orama.index.search(context, index, prop, term)

        context.indexMap[prop][term].push(...scoreList)
      }

      const docIds = context.indexMap[prop]
      const vals = Object.values(docIds)
      context.docsIntersection[prop] = prioritizeTokenScores(vals, params?.boost?.[prop] ?? 1, threshold)
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
      Object.keys(await orama.documentsStore.getAll(orama.data.docs)).map(k => [k, 0]),
    )
  }

  // Get unique doc IDs from uniqueDocsIDs map
  let uniqueDocsArray = Object.entries(context.uniqueDocsIDs)
    .map(([id, score]) => [Number(id), score] as TokenScore);

  // If filters are enabled, we need to remove the IDs of the documents that don't match the filters.
  if (hasFilters) {
    uniqueDocsArray = intersectFilteredIDs(whereFiltersIDs, uniqueDocsArray)
  }

  if (params.sortBy) {
    if (typeof params.sortBy === 'function') {
      const ids = uniqueDocsArray.map(([id]) => id) as unknown as string[]
      const docs = await orama.documentsStore.getMultiple(orama.data.docs, ids)
      const docsWithIdAndScore: CustomSorterFunctionItem[] = docs.map((d, i) => [
        uniqueDocsArray[i][0],
        uniqueDocsArray[i][1],
        d!,
      ])
      docsWithIdAndScore.sort(params.sortBy)
      uniqueDocsArray = docsWithIdAndScore.map(([id, score]) => [id, score])
    } else {
      uniqueDocsArray = await orama.sorter.sortBy(orama.data.sorting, uniqueDocsArray, params.sortBy)
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

  const searchResult: Results<AggValue> = {
    elapsed: {
      formatted: '',
      raw: 0,
    },
    // We keep the hits array empty if it's a preflight request.
    hits: [],
    count: uniqueDocsArray.length,
  }

  if (typeof results !== 'undefined') {
    searchResult.hits = results.filter(Boolean)
  }

  if (shouldCalculateFacets) {
    // Populate facets if needed
    const facets = await getFacets(orama, uniqueDocsArray, params.facets!)
    searchResult.facets = facets
  }

  if (params.groupBy) {
    searchResult.groups = await getGroups(orama, uniqueDocsArray, params.groupBy)
  }

  if (orama.afterSearch) {
    await runAfterSearch(orama.afterSearch, orama, params, language, searchResult)
  }

  // Calculate elapsed time only at the end of the function
  searchResult.elapsed = (await orama.formatElapsedTime(
    (await getNanosecondsTime()) - context.timeStart,
  )) as ElapsedTime

  return searchResult
}

async function fetchDocumentsWithDistinct(
  orama: Orama,
  uniqueDocsArray: [InternalDocumentID, number][],
  offset: number,
  limit: number,
  distinctOn: string,
): Promise<Result[]> {
  const docs = orama.data.docs

  // Keep track which values we already seen
  const values = new Map<SearchableValue, true>()

  // We cannot know how many results we will have in the end,
  // so we need cannot pre-allocate the array.
  const results: Result[] = []

  const resultIDs: Set<InternalDocumentID> = new Set()
  const uniqueDocsArrayLength = uniqueDocsArray.length
  let count = 0
  for (let i = 0; i < uniqueDocsArrayLength; i++) {
    const idAndScore = uniqueDocsArray[i]

    // If there are no more results, just break the loop
    if (typeof idAndScore === 'undefined') {
      continue
    }

    const [id, score] = idAndScore

    if (resultIDs.has(id)) {
      continue
    }

    const doc = await orama.documentsStore.get(docs, id)
    const value = await getNested(doc as object, distinctOn)
    if (typeof value === 'undefined' || values.has(value)) {
      continue
    }
    values.set(value, true)

    count++
    // We shouldn't consider the document if it's not in the offset range
    if (count <= offset) {
      continue
    }

    results.push({ id, score, document: doc! })
    resultIDs.add(id)

    // reached the limit, break the loop
    if (count >= offset + limit) {
      break
    }
  }

  return results
}

async function fetchDocuments(
  orama: Orama,
  uniqueDocsArray: [InternalDocumentID, number][],
  offset: number,
  limit: number,
): Promise<Result[]> {
  const docs = orama.data.docs

  const results: Result[] = Array.from({
    length: limit,
  })

  const resultIDs: Set<InternalDocumentID> = new Set()

  // We already have the list of ALL the document IDs containing the search terms.
  // We loop over them starting from a positional value "offset" and ending at "offset + limit"
  // to provide pagination capabilities to the search.
  for (let i = offset; i < limit + offset; i++) {
    const idAndScore = uniqueDocsArray[i]

    // If there are no more results, just break the loop
    if (typeof idAndScore === 'undefined') {
      break
    }

    const [id, score] = idAndScore

    if (!resultIDs.has(id)) {
      // We retrieve the full document only AFTER making sure that we really want it.
      // We never retrieve the full document preventively.
      const fullDoc = await orama.documentsStore.get(docs, id)
      results[i] = { id, score, document: fullDoc! }
      resultIDs.add(id)
    }
  }
  return results
}
