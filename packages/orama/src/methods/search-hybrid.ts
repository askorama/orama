import type { AnyOrama, TypedDocument, SearchParamsHybrid, Results, TokenScore, ElapsedTime, Result } from '../types.js'
import type { InternalDocumentID } from '../components/internal-document-id-store.js'
import { getNanosecondsTime, safeArrayPush, formatNanoseconds } from '../utils.js'
import { intersectFilteredIDs } from '../components/filters.js'
import { prioritizeTokenScores } from '../components/algorithms.js'
import { createError } from '../errors.js'
import { createSearchContext, defaultBM25Params } from './search.js'
import { getFacets } from '../components/facets.js'
import { getGroups } from '../components/groups.js'
import { runBeforeSearch, runAfterSearch } from '../components/hooks.js'
import { findSimilarVectors } from '../components/cosine-similarity.js'
import { getInternalDocumentId, getDocumentIdFromInternalId } from '../components/internal-document-id-store.js'
import { fetchDocuments } from './search.js'

export async function hybridSearch<T extends AnyOrama, ResultDocument = TypedDocument<T>>(orama: T, params: SearchParamsHybrid<T, ResultDocument>, language?: string): Promise<Results<ResultDocument>> {
  const timeStart = await getNanosecondsTime()
  const { offset = 0, limit = 10, includeVectors = false } = params
  const shouldCalculateFacets = params.facets && Object.keys(params.facets).length > 0

  const [fullTextIDs, vectorIDs] = await Promise.all([
    getFullTextSearchIDs(orama, params, language),
    getVectorSearchIDs(orama, params, language)
  ])

  const { index, docs } = orama.data
  let uniqueTokenScores = mergeSortedArrays(
    fullTextIDs.slice(offset, offset + limit),
    vectorIDs.slice(offset, offset + limit)
  )

  // @todo avoid tokenize twoce
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

  let facetsResults: any = []

  if (shouldCalculateFacets) {
    // Populate facets if needed
    const facets = await getFacets(orama, uniqueTokenScores, params.facets!)
    facetsResults = facets
  }

  let groups: any = []

  if (params.groupBy) {
    groups = await getGroups<T, ResultDocument>(orama, uniqueTokenScores, params.groupBy)
  }

  if (params.combine) {
    let docs = (await fetchDocuments(orama, uniqueTokenScores, offset, limit)).filter(Boolean)
    if (!includeVectors) {
      docs = docs.map((doc) => {
        return {
          id: doc.id,
          score: doc.score,
          document: {
            ...doc.document,
            [params.vectorPropertiy]: null
          }
        }
      })
    }

    const timeEnd = await getNanosecondsTime()
    return {
      count: fullTextIDs.length + vectorIDs.length,
      elapsed: {
        raw: Number(timeEnd - timeStart),
        formatted: await formatNanoseconds(timeEnd - timeStart)
      },
      hits: docs as Result<ResultDocument>[],
      ...(facetsResults ? { facets: facetsResults } : {}),
      ...(groups ? { groups } : {})
    }
  } else {
    let hits = (await fetchDocuments(orama, fullTextIDs, offset, limit) as Result<ResultDocument>[]).filter(Boolean)
    let vectorHits = (await fetchDocuments(orama, vectorIDs, offset, limit) as Result<ResultDocument>[]).filter(Boolean)
    const timeEnd = await getNanosecondsTime()
    const elapsedTime = timeEnd - timeStart

    if (!includeVectors) {
      hits = hits.map((doc) => {
        return {
          id: doc.id,
          score: doc.score,
          document: {
            ...doc.document,
            [params.vectorPropertiy]: null
          }
        }
      })
      vectorHits = vectorHits.map((doc) => {
        return {
          id: doc.id,
          score: doc.score,
          document: {
            ...doc.document,
            [params.vectorPropertiy]: null
          }
        }
      })
    }

    return {
      count: uniqueTokenScores.length,
      hits,
      vectorHits,
      elapsed: {
        raw: Number(elapsedTime),
        formatted: await formatNanoseconds(elapsedTime)
      },
      ...(facetsResults ? { facets: facetsResults } : {}),
      ...(groups ? { groups } : {})
    }
  }
}

async function getFullTextSearchIDs<T extends AnyOrama, ResultDocument = TypedDocument<T>>(orama: T, params: SearchParamsHybrid<T, ResultDocument>, language?: string): Promise<TokenScore[]> {
  const timeStart = await getNanosecondsTime()
  params.relevance = Object.assign(params.relevance ?? {}, defaultBM25Params)

  const { limit = 10, offset = 0, term, properties, threshold = 1 } = params

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

  const uniqueIDs = Object.entries(context.uniqueDocsIDs).map(([id, score]) => [+id, score] as TokenScore)
    .sort((a, b) => b[1] - a[1])

  return minMaxScoreNormalization(uniqueIDs)
}

export async function getVectorSearchIDs<T extends AnyOrama, ResultDocument = TypedDocument<T>>(orama: T, params: SearchParamsHybrid<T, ResultDocument>, language?: string): Promise<TokenScore[]> {
  let vector = params.vector
  const { vectorPropertiy, limit = 10, offset = 0 } = params
  const vectorIndex = orama.data.index.vectorIndexes[vectorPropertiy]
  const vectorSize = vectorIndex.size
  const vectors = vectorIndex.vectors

  if (vector?.length !== vectorSize) {
    throw createError('INVALID_INPUT_VECTOR', vectorPropertiy, vectorSize, vector!.length)
  }

  if (!(vector instanceof Float32Array)) {
    vector = new Float32Array(vector)
  }

  const uniqueIDs = findSimilarVectors(vector, vectors, vectorSize, params.similarity)
    .map(([id, score]) => [getInternalDocumentId(orama.internalDocumentIDStore, id), score]) as TokenScore[]

  return minMaxScoreNormalization(uniqueIDs)
}

function minMaxScoreNormalization(results: TokenScore[]): TokenScore[] {
  const maxScore = Math.max(...results.map(([id, score]) => score))
  return results.map(([id, score]) => [id, score / maxScore] as TokenScore)
}

function mergeSortedArrays(arr1: TokenScore[], arr2: TokenScore[]): TokenScore[] {
  let merged: TokenScore[] = new Array(arr1.length + arr2.length)
  let i = 0, j = 0, k = 0

  while (i < arr1.length && j < arr2.length) {
    if (arr1[i][1] > arr2[j][1]) {
      merged[k++] = arr1[i++]
    } else {
      merged[k++] = arr2[j++]
    }
  }

  while (i < arr1.length) {
    merged[k++] = arr1[i++]
  }

  while (j < arr2.length) {
    merged[k++] = arr2[j++]
  }

  return merged
}
