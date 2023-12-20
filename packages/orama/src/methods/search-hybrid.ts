import type { AnyOrama, TypedDocument, SearchParamsHybrid, Results, TokenScore, Result } from '../types.js'
import type { InternalDocumentID } from '../components/internal-document-id-store.js'
import { getNanosecondsTime, safeArrayPush, formatNanoseconds } from '../utils.js'
import { intersectFilteredIDs } from '../components/filters.js'
import { prioritizeTokenScores } from '../components/algorithms.js'
import { createError } from '../errors.js'
import { createSearchContext, defaultBM25Params } from './search.js'
import { getFacets } from '../components/facets.js'
import { getGroups } from '../components/groups.js'
import { findSimilarVectors } from '../components/cosine-similarity.js'
import { getInternalDocumentId } from '../components/internal-document-id-store.js'
import { fetchDocuments } from './search.js'
import { runBeforeSearch, runAfterSearch } from '../components/hooks.js'

export async function hybridSearch<T extends AnyOrama, ResultDocument = TypedDocument<T>>(
  orama: T,
  params: SearchParamsHybrid<T, ResultDocument>,
  language?: string
): Promise<Results<ResultDocument>> {
  const timeStart = await getNanosecondsTime()

  if (orama.beforeSearch) {
    await runBeforeSearch(orama.beforeSearch, orama, params, language)
  }

  const { offset = 0, limit = 10, includeVectors = false } = params
  const shouldCalculateFacets = params.facets && Object.keys(params.facets).length > 0

  const [fullTextIDs, vectorIDs] = await Promise.all([
    getFullTextSearchIDs(orama, params, language),
    getVectorSearchIDs(orama, params)
  ])

  const { index, docs } = orama.data
  let uniqueTokenScores = mergeSortedArrays(
    fullTextIDs.slice(offset, offset + limit),
    vectorIDs.slice(offset, offset + limit)
  )

  // @todo avoid tokenize twice
  const tokens = await orama.tokenizer.tokenize(params.term ?? '', language)
  let propertiesToSearch = orama.caches['propertiesToSearch'] as string[]
  if (!propertiesToSearch) {
    const propertiesToSearchWithTypes = await orama.index.getSearchablePropertiesWithTypes(index)

    propertiesToSearch = await orama.index.getSearchableProperties(index)
    propertiesToSearch = propertiesToSearch.filter((prop: string) =>
      propertiesToSearchWithTypes[prop].startsWith('string')
    )

    orama.caches['propertiesToSearch'] = propertiesToSearch
  }

  if (params.properties && params.properties !== '*') {
    for (const prop of params.properties) {
      if (!propertiesToSearch.includes(prop as string)) {
        throw createError('UNKNOWN_INDEX', prop as string, propertiesToSearch.join(', '))
      }
    }

    propertiesToSearch = propertiesToSearch.filter((prop: string) => (params.properties as string[]).includes(prop))
  }

  // @todo avoid create context twice
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

  const hasFilters = Object.keys(params.where ?? {}).length > 0
  let whereFiltersIDs: InternalDocumentID[] = []

  if (hasFilters) {
    whereFiltersIDs = await orama.index.searchByWhereClause(context, index, params.where!)
    uniqueTokenScores = intersectFilteredIDs(whereFiltersIDs, uniqueTokenScores)
  }

  let facetsResults: any
  if (shouldCalculateFacets) {
    const facets = await getFacets(orama, uniqueTokenScores, params.facets!)
    facetsResults = facets
  }

  let groups: any
  if (params.groupBy) {
    groups = await getGroups<T, ResultDocument>(orama, uniqueTokenScores, params.groupBy)
  }

  let results = (await fetchDocuments(orama, uniqueTokenScores, offset, limit)).filter(Boolean)
  if (!includeVectors) {
    results = results.map((doc) => {
      return {
        id: doc.id,
        score: doc.score,
        document: {
          ...doc.document,
          // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
          [params.vector?.property!]: null
        }
      }
    })
  }

  if (orama.afterSearch) {
    await runAfterSearch(orama.afterSearch, orama, params, language, results as any)
  }

  const timeEnd = await getNanosecondsTime()
  return {
    count: uniqueTokenScores.length,
    elapsed: {
      raw: Number(timeEnd - timeStart),
      formatted: await formatNanoseconds(timeEnd - timeStart)
    },
    hits: results as Result<ResultDocument>[],
    ...(facetsResults ? { facets: facetsResults } : {}),
    ...(groups ? { groups } : {})
  }
}

async function getFullTextSearchIDs<T extends AnyOrama, ResultDocument = TypedDocument<T>>(
  orama: T,
  params: SearchParamsHybrid<T, ResultDocument>,
  language?: string
): Promise<TokenScore[]> {
  const timeStart = await getNanosecondsTime()
  params.relevance = Object.assign(params.relevance ?? {}, defaultBM25Params)

  const { term, properties, threshold = 1 } = params

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

  const uniqueIDs = Object.entries(context.uniqueDocsIDs)
    .map(([id, score]) => [+id, score] as TokenScore)
    .sort((a, b) => b[1] - a[1])

  return minMaxScoreNormalization(uniqueIDs)
}

export async function getVectorSearchIDs<T extends AnyOrama, ResultDocument = TypedDocument<T>>(
  orama: T,
  params: SearchParamsHybrid<T, ResultDocument>
): Promise<TokenScore[]> {
  const vector = params.vector
  // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
  const vectorIndex = orama.data.index.vectorIndexes[vector?.property!]
  const vectorSize = vectorIndex.size
  const vectors = vectorIndex.vectors

  if (vector && (!vector.value || !vector.property)) {
    throw createError('INVALID_VECTOR_INPUT', Object.keys(vector).join(', '))
  }

  if (vector!.value.length !== vectorSize) {
    throw createError('INVALID_INPUT_VECTOR', vector!.property, vectorSize, vector!.value.length)
  }

  if (!(vector instanceof Float32Array)) {
    vector!.value = new Float32Array(vector!.value)
  }

  const uniqueIDs = findSimilarVectors(vector!.value as Float32Array, vectors, vectorSize, params.similarity).map(
    ([id, score]) => [getInternalDocumentId(orama.internalDocumentIDStore, id), score]
  ) as TokenScore[]

  return minMaxScoreNormalization(uniqueIDs)
}

function minMaxScoreNormalization(results: TokenScore[]): TokenScore[] {
  const maxScore = Math.max(...results.map(([, score]) => score))
  return results.map(([id, score]) => [id, score / maxScore] as TokenScore)
}

function mergeSortedArrays(fulltext: TokenScore[], vector: TokenScore[]): TokenScore[] {
  const merged: TokenScore[] = []
  const addedIds = new Map<number, boolean>()
  let i = 0,
    j = 0

  while (i < fulltext.length && j < vector.length) {
    if (fulltext[i][1] > vector[j][1]) {
      addUnique(merged, addedIds, fulltext[i])
      i++
    } else if (vector[j][1] > fulltext[i][1]) {
      addUnique(merged, addedIds, vector[j])
      j++
    } else {
      addUnique(merged, addedIds, fulltext[i])
      addUnique(merged, addedIds, vector[j])
      i++
      j++
    }
  }

  // Add remaining elements from both arrays
  while (i < fulltext.length) {
    addUnique(merged, addedIds, fulltext[i])
    i++
  }
  while (j < vector.length) {
    addUnique(merged, addedIds, vector[j])
    j++
  }

  return merged
}

function addUnique(array: TokenScore[], addedIds: Map<number, boolean>, element: TokenScore) {
  if (!addedIds.has(element[0])) {
    array.push(element)
    addedIds.set(element[0], true)
  }
}
