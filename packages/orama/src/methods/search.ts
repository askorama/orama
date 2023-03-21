import { prioritizeTokenScores } from '../components/algorithms.js'
import { getFacets } from '../components/facets.js'
import { intersectFilteredIDs } from '../components/filters.js'
import { createError } from '../errors.js'
import { BM25Params, IndexMap, Orama, Result, Results, SearchContext, SearchParams, TokenMap } from '../types.js'
import { getNanosecondsTime, sortTokenScorePredicate } from '../utils.js'

const defaultBM25Params: BM25Params = {
  k: 1.2,
  b: 0.75,
  d: 0.5,
}

function createSearchContext(
  properties: string[],
  tokens: string[],
  params: SearchParams,
  docsCount: number,
): SearchContext {
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
    timeStart: getNanosecondsTime(),
    params,
    docsCount,
    uniqueDocsIDs: {},
    indexMap,
    docsIntersection,
  }
}

export async function search(orama: Orama, params: SearchParams, language?: string): Promise<Results> {
  params.relevance = Object.assign(params.relevance ?? {}, defaultBM25Params)

  const shouldCalculateFacets = params.facets && Object.keys(params.facets).length > 0
  const { limit = 10, offset = 0, term, properties } = params

  const { index, docs } = orama.data
  const tokens = orama.tokenizer.tokenize(term, language)

  // Get searchable string properties
  let propertiesToSearch = orama.caches['propertiesToSearch'] as string[]
  if (!propertiesToSearch) {
    const propertiesToSearchWithTypes = await orama.index.getSearchablePropertiesWithTypes(index)

    propertiesToSearch = await orama.index.getSearchableProperties(index)
    propertiesToSearch = propertiesToSearch.filter((prop: string) => propertiesToSearchWithTypes[prop] === 'string')

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
  const context = createSearchContext(propertiesToSearch, tokens, params, await orama.documentsStore.count(docs))
  const results: Result[] = Array.from({
    length: limit,
  })

  // If filters are enabled, we need to get the IDs of the documents that match the filters.
  const hasFilters = Object.keys(params.where ?? {}).length > 0
  let whereFiltersIDs: string[] = []

  if (hasFilters) {
    whereFiltersIDs = orama.index.searchByWhereClause(index, params.where!)
  }

  // Now it's time to loop over all the indices and get the documents IDs for every single term
  const indexesLength = propertiesToSearch.length
  for (let i = 0; i < indexesLength; i++) {
    const prop = propertiesToSearch[i]

    const tokensLength = tokens.length
    for (let j = 0; j < tokensLength; j++) {
      const term = tokens[j]

      // Lookup
      const scoreList = await orama.index.search(index, prop, term, context)

      context.indexMap[prop][term].push(...scoreList)
    }

    const docIds = context.indexMap[prop]
    const vals = Object.values(docIds)
    context.docsIntersection[prop] = prioritizeTokenScores(vals, params?.boost?.[prop] ?? 1)
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

  // Get unique doc IDs from uniqueDocsIDs map, sorted by value.
  let uniqueDocsArray = Object.entries(context.uniqueDocsIDs).sort(sortTokenScorePredicate)

  // If filters are enabled, we need to remove the IDs of the documents that don't match the filters.
  if (hasFilters) {
    uniqueDocsArray = intersectFilteredIDs(whereFiltersIDs, uniqueDocsArray)
  }

  const resultIDs: Set<string> = new Set()
  // Populate facets if needed
  const facets = shouldCalculateFacets ? await getFacets(orama, uniqueDocsArray, params.facets!) : {}

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

  const searchResult: Results = {
    elapsed: await orama.formatElapsedTime(getNanosecondsTime() - context.timeStart),
    hits: results.filter(Boolean),
    count: uniqueDocsArray.length,
  }

  if (shouldCalculateFacets) {
    searchResult.facets = facets
  }

  return searchResult
}
