import type { AnyOrama, Results, SearchParamsVector, TypedDocument, Result } from '../types.js'
import type { InternalDocumentID } from '../components/internal-document-id-store.js'
import { createSearchContext } from './search.js'
import { getNanosecondsTime, formatNanoseconds } from '../utils.js'
import { createError } from '../errors.js'
import { findSimilarVectors } from '../components/cosine-similarity.js'
import { intersectFilteredIDs } from '../components/filters.js'
import { getInternalDocumentId, getDocumentIdFromInternalId } from '../components/internal-document-id-store.js'
import { Language } from '../index.js'

export type SearchVectorParams = {
  vector: number[] | Float32Array
  property: string
  similarity?: number
  limit?: number
  offset?: number
  includeVectors?: boolean
}

export async function searchVector<T extends AnyOrama, ResultDocument = TypedDocument<T>>(orama: T, params: SearchVectorParams): Promise<Results<ResultDocument>> {
  console.warn(`"searchVector" function is now part of "search" function, and will be deprecated in Orama v2.0. Please use "search" instead.`)
  console.warn('Read more at https://docs.oramasearch.com/open-source/usage/search/vector-search.html')
  return searchVectorFn(orama, params as SearchParamsVector<T, ResultDocument>)
}

export async function searchVectorFn<T extends AnyOrama, ResultDocument = TypedDocument<T>>(orama: T, params: SearchParamsVector<T, ResultDocument>, language: Language = 'english'): Promise<Results<ResultDocument>> {
  const timeStart = await getNanosecondsTime()
  let { vector } = params
  const { property, limit = 10, offset = 0, includeVectors = false } = params
  const vectorIndex = orama.data.index.vectorIndexes[property]
  const vectorSize = vectorIndex.size
  const vectors = vectorIndex.vectors
  const hasFilters = Object.keys(params.where ?? {}).length > 0
  const { index, docs: oramaDocs } = orama.data

  if (vector.length !== vectorSize) {
    throw createError('INVALID_INPUT_VECTOR', property, vectorSize, vector.length)
  }

  if (!(vector instanceof Float32Array)) {
    vector = new Float32Array(vector)
  }

  let results = findSimilarVectors(vector, vectors, vectorSize, params.similarity)
    .map(([id, score]) => [getInternalDocumentId(orama.internalDocumentIDStore, id), score]) as [number, number][]

  let propertiesToSearch = orama.caches['propertiesToSearch'] as string[]

  if (!propertiesToSearch) {
    const propertiesToSearchWithTypes = await orama.index.getSearchablePropertiesWithTypes(index)

    propertiesToSearch = await orama.index.getSearchableProperties(index)
    propertiesToSearch = propertiesToSearch.filter((prop: string) =>propertiesToSearchWithTypes[prop].startsWith('string'))

    orama.caches['propertiesToSearch'] = propertiesToSearch
  }
  const tokens = []

  const context = await createSearchContext(
    orama.tokenizer,
    orama.index,
    orama.documentsStore,
    language,
    params,
    propertiesToSearch,
    tokens,
    await orama.documentsStore.count(oramaDocs),
    timeStart
  )

  let whereFiltersIDs: InternalDocumentID[] = []

  if (hasFilters) {
    whereFiltersIDs = await orama.index.searchByWhereClause(context, index, params.where!)
    results = intersectFilteredIDs(whereFiltersIDs, results)
  }

  const docs: Result<ResultDocument>[] = Array.from({ length: limit })

  for (let i = 0; i < limit; i++) {
    const result = results[i + offset]
    if (!result) {
      break
    }

    const doc = orama.data.docs.docs[result[0]]

    if (doc) {
      if (!includeVectors) {
        doc[property] = null
      }

      const newDoc: Result<ResultDocument> = {
        id: getDocumentIdFromInternalId(orama.internalDocumentIDStore, result[0]),
        score: result[1],
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