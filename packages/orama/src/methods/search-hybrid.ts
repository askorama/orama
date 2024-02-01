import type { AnyOrama, TypedDocument, SearchParamsHybrid, Results, TokenScore, Result, HybridWeights } from '../types.js'
import type { InternalDocumentID } from '../components/internal-document-id-store.js'
import { getNanosecondsTime, safeArrayPush, formatNanoseconds, removeVectorsFromHits } from '../utils.js'
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
  const hybridWeights = params.hybridWeights
  let uniqueTokenScores = mergeAndRankResults(fullTextIDs, vectorIDs, params.term ?? '', hybridWeights)

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
    uniqueTokenScores = intersectFilteredIDs(whereFiltersIDs, uniqueTokenScores).slice(offset, offset + limit)
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

  const results = (await fetchDocuments(orama, uniqueTokenScores, offset, limit)).filter(Boolean)

  if (orama.afterSearch) {
    await runAfterSearch(orama.afterSearch, orama, params, language, results as any)
  }

  const timeEnd = await getNanosecondsTime()

  const returningResults = {
    count: uniqueTokenScores.length,
    elapsed: {
      raw: Number(timeEnd - timeStart),
      formatted: await formatNanoseconds(timeEnd - timeStart)
    },
    hits: results as Result<ResultDocument>[],
    ...(facetsResults ? { facets: facetsResults } : {}),
    ...(groups ? { groups } : {})
  }

  if (!includeVectors) {
    const vectorProperties = Object.keys(orama.data.index.vectorIndexes)
    removeVectorsFromHits(returningResults, vectorProperties)
  }

  return returningResults
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

function normalizeScore(score: number, maxScore: number) {
  return score / maxScore
}

function hybridScore(textScore: number, vectorScore: number, textWeight: number, vectorWeight: number) {
  return textScore * textWeight + vectorScore * vectorWeight
}

function mergeAndRankResults(textResults: TokenScore[], vectorResults: TokenScore[], query: string, hybridWeights: HybridWeights | undefined) {
  const maxTextScore = Math.max(...textResults.map(([, score]) => score))
  const maxVectorScore = Math.max(...vectorResults.map(([, score]) => score))
  const hasHybridWeights = hybridWeights && hybridWeights.text && hybridWeights.vector

  const { text: textWeight, vector: vectorWeight } = hasHybridWeights ? hybridWeights : getQueryWeights(query)
  const mergedResults = new Map()

  const textResultsLength = textResults.length
  for (let i = 0; i < textResultsLength; i++) {
    const normalizedScore = normalizeScore(textResults[i][1], maxTextScore)
    //                                                    ^ 1 here refers to "score"
    const hybridScoreValue = hybridScore(normalizedScore, 0, textWeight, vectorWeight)
    mergedResults.set(textResults[i][0], hybridScoreValue)
    //                               ^ 0 here refers to "id"
  }

  const vectorResultsLength = vectorResults.length
  for (let i = 0; i < vectorResultsLength; i++) {
    const normalizedScore = normalizeScore(vectorResults[i][1], maxVectorScore)
    //                                                      ^ 1 here refers to "score"
    if (mergedResults.has(vectorResults[i][0])) {
      let existingRes = mergedResults.get(vectorResults[i][0])
      //                                                   ^ 0 here refers to "id"
      mergedResults.set(vectorResults[i][0], (existingRes += hybridScore(0, normalizedScore, textWeight, vectorWeight)))
      //                                 ^ 0 here refers to "id"
    } else {
      mergedResults.set(vectorResults[i][0], hybridScore(0, normalizedScore, textWeight, vectorWeight))
      //                                 ^ 0 here refers to "id"
    }
  }

  return [...mergedResults].sort((a, b) => b[1] - a[1])
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getQueryWeights(query: string): HybridWeights {
  // In the next versions of Orama, we will ship a plugin containing a ML model to adjust the weights
  // based on whether the query is keyword-focused, conceptual, etc.
  // For now, we just return a fixed value.
  return {
    text: 0.5,
    vector: 0.5
  }
}
