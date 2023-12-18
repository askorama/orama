import { prioritizeTokenScores } from '../components/algorithms.js'
import { getFacets } from '../components/facets.js'
import { intersectFilteredIDs } from '../components/filters.js'
import { getGroups } from '../components/groups.js'
import { runAfterSearch, runBeforeSearch } from '../components/hooks.js'
import {
  InternalDocumentID,
  getDocumentIdFromInternalId,
  getInternalDocumentId
} from '../components/internal-document-id-store.js'
import { createError } from '../errors.js'
import { getNanosecondsTime, getNested, sortTokenScorePredicate, safeArrayPush, formatNanoseconds } from '../utils.js'
import type {
  AnyOrama,
  BM25Params,
  CustomSorterFunctionItem,
  ElapsedTime,
  IndexMap,
  LiteralUnion,
  Result,
  Results,
  SearchContext,
  SearchParams,
  SearchParamsFullText,
  SearchParamsVector,
  SearchableValue,
  TokenMap,
  TokenScore,
  Tokenizer,
  TypedDocument
} from '../types.js'
import { MODE_FULLTEXT_SEARCH, MODE_VECTOR_SEARCH } from '../constants.js'
import { findSimilarVectors } from '../components/cosine-similarity.js'

const defaultBM25Params: BM25Params = {
  k: 1.2,
  b: 0.75,
  d: 0.5
}

async function createSearchContext<T extends AnyOrama, ResultDocument = TypedDocument<T>>(
  tokenizer: Tokenizer,
  index: T['index'],
  documentsStore: T['documentsStore'],
  language: string | undefined,
  params: SearchParams<T, ResultDocument>,
  properties: string[],
  tokens: string[],
  docsCount: number,
  timeStart: bigint
): Promise<SearchContext<T, ResultDocument>> {
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
    docsIntersection
  }
}

export async function search<T extends AnyOrama, ResultDocument = TypedDocument<T>>( orama: T, params: SearchParams<T, ResultDocument>, language?: string): Promise<Results<ResultDocument>> {
  const mode = params.mode ?? MODE_FULLTEXT_SEARCH

  if (mode === MODE_FULLTEXT_SEARCH) {
    return fullTextSearch(orama, params as SearchParamsFullText<T, ResultDocument>, language)
  }

  if (mode === MODE_VECTOR_SEARCH) {
    return searchVector(orama, params as SearchParamsVector<T, ResultDocument>)
  }

  throw ('No other search modes are supported yet')
}

export async function searchVector<T extends AnyOrama, ResultDocument = TypedDocument<T>>(orama: T, params: SearchParamsVector<T, ResultDocument>): Promise<Results<ResultDocument>> {
  const timeStart = await getNanosecondsTime()
  let { vector } = params
  const { property, limit = 10, offset = 0, includeVectors = false } = params
  const vectorIndex = orama.data.index.vectorIndexes[property]
  const vectorSize = vectorIndex.size
  const vectors = vectorIndex.vectors

  if (vector.length !== vectorSize) {
    throw createError('INVALID_INPUT_VECTOR', property, vectorSize, vector.length)
  }

  if (!(vector instanceof Float32Array)) {
    vector = new Float32Array(vector)
  }

  const results = findSimilarVectors(vector, vectors, vectorSize, params.similarity)

  const docs: Result<ResultDocument>[] = Array.from({ length: limit })

  for (let i = 0; i < limit; i++) {
    const result = results[i + offset]
    if (!result) {
      break
    }

    const originalID = getInternalDocumentId(orama.internalDocumentIDStore, result.id)
    const doc = orama.data.docs.docs[originalID]

    if (doc) {
      if (!includeVectors) {
        doc[property] = null
      }

      const newDoc: Result<ResultDocument> = {
        id: result.id,
        score: result.score,
        document: doc
      }
      docs[i] = newDoc
    }
  }

  const timeEnd = await getNanosecondsTime()
  const elapsedTime = timeEnd - timeStart

  return {
    count: results.length,
    hits: docs.filter(Boolean),
    elapsed: {
      raw: Number(elapsedTime),
      formatted: await formatNanoseconds(elapsedTime)
    }
  }
}


async function fullTextSearch<T extends AnyOrama, ResultDocument = TypedDocument<T>>(orama: T, params: SearchParamsFullText<T, ResultDocument>, language?: string): Promise<Results<ResultDocument>> {
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
    }
  
    if (shouldCalculateFacets) {
      // Populate facets if needed
      const facets = await getFacets(orama, uniqueDocsArray, params.facets!)
      searchResult.facets = facets
    }
  
    if (params.groupBy) {
      searchResult.groups = await getGroups<T, ResultDocument>(orama, uniqueDocsArray, params.groupBy)
    }
  
    if (orama.beforeSearch) {
      await runBeforeSearch(orama.beforeSearch, orama, params, language)
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

async function fetchDocumentsWithDistinct<T extends AnyOrama, ResultDocument extends TypedDocument<T>>(
  orama: T,
  uniqueDocsArray: [InternalDocumentID, number][],
  offset: number,
  limit: number,
  distinctOn: LiteralUnion<T['schema']>
): Promise<Result<ResultDocument>[]> {
  const docs = orama.data.docs

  // Keep track which values we already seen
  const values = new Map<SearchableValue, true>()

  // We cannot know how many results we will have in the end,
  // so we need cannot pre-allocate the array.
  const results: Result<ResultDocument>[] = []

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

    results.push({ id: getDocumentIdFromInternalId(orama.internalDocumentIDStore, id), score, document: doc! })
    resultIDs.add(id)

    // reached the limit, break the loop
    if (count >= offset + limit) {
      break
    }
  }

  return results
}

async function fetchDocuments<T extends AnyOrama, ResultDocument extends TypedDocument<T>>(
  orama: T,
  uniqueDocsArray: [InternalDocumentID, number][],
  offset: number,
  limit: number
): Promise<Result<ResultDocument>[]> {
  const docs = orama.data.docs

  const results: Result<ResultDocument>[] = Array.from({
    length: limit
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
      results[i] = { id: getDocumentIdFromInternalId(orama.internalDocumentIDStore, id), score, document: fullDoc! }
      resultIDs.add(id)
    }
  }
  return results
}
