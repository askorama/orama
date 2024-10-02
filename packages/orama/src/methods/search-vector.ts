import type { AnyOrama, Results, SearchParamsVector, TypedDocument, Result } from '../types.js'
import type { InternalDocumentID } from '../components/internal-document-id-store.js'
import { createSearchContext } from './search.js'
import { getNanosecondsTime, formatNanoseconds } from '../utils.js'
import { getFacets } from '../components/facets.js'
import { createError } from '../errors.js'
import { findSimilarVectors } from '../components/cosine-similarity.js'
import { intersectFilteredIDs } from '../components/filters.js'
import { getGroups } from '../components/groups.js'
import { getInternalDocumentId, getDocumentIdFromInternalId } from '../components/internal-document-id-store.js'
import { Language } from '../index.js'
import { runBeforeSearch, runAfterSearch } from '../components/hooks.js'

export function searchVector<T extends AnyOrama, ResultDocument = TypedDocument<T>>(
  orama: T,
  params: SearchParamsVector<T, ResultDocument>,
  language: Language = 'english'
): Results<ResultDocument> | Promise<Results<ResultDocument>> {
  const timeStart = getNanosecondsTime()

  const asyncNeeded = orama.beforeSearch?.length || orama.afterSearch?.length

  function performSearchLogic(): Results<ResultDocument> {
    const { vector } = params

    if (vector && (!('value' in vector) || !('property' in vector))) {
      throw createError('INVALID_VECTOR_INPUT', Object.keys(vector).join(', '))
    }

    const { limit = 10, offset = 0, includeVectors = false } = params
    const vectorIndex = orama.data.index.vectorIndexes[vector!.property]
    const vectorSize = vectorIndex.size
    const vectors = vectorIndex.vectors
    const shouldCalculateFacets = params.facets && Object.keys(params.facets).length > 0
    const hasFilters = Object.keys(params.where ?? {}).length > 0
    const { index, docs: oramaDocs } = orama.data

    if (vector?.value.length !== vectorSize) {
      if (vector?.property === undefined || vector?.value.length === undefined) {
        throw createError('INVALID_INPUT_VECTOR', 'undefined', vectorSize, 'undefined')
      }
      throw createError('INVALID_INPUT_VECTOR', vector.property, vectorSize, vector.value.length)
    }

    if (!(vector instanceof Float32Array)) {
      vector.value = new Float32Array(vector.value)
    }

    let results = findSimilarVectors(vector.value as Float32Array, vectors, vectorSize, params.similarity).map(
      ([id, score]) => [getInternalDocumentId(orama.internalDocumentIDStore, id), score]
    ) as [number, number][]

    let propertiesToSearch = orama.caches['propertiesToSearch'] as string[]

    if (!propertiesToSearch) {
      const propertiesToSearchWithTypes = orama.index.getSearchablePropertiesWithTypes(index)

      propertiesToSearch = orama.index.getSearchableProperties(index)
      propertiesToSearch = propertiesToSearch.filter((prop: string) =>
        propertiesToSearchWithTypes[prop].startsWith('string')
      )

      orama.caches['propertiesToSearch'] = propertiesToSearch
    }

    const tokens = []

    const context = createSearchContext(
      orama.tokenizer,
      orama.index,
      orama.documentsStore,
      language,
      params,
      propertiesToSearch,
      tokens,
      orama.documentsStore.count(oramaDocs),
      timeStart
    )

    let whereFiltersIDs: InternalDocumentID[] = []

    if (hasFilters) {
      whereFiltersIDs = orama.index.searchByWhereClause(context, index, params.where!)
      results = intersectFilteredIDs(whereFiltersIDs, results)
    }

    let facetsResults: any = []

    if (shouldCalculateFacets) {
      const facets = getFacets(orama, results, params.facets!)
      facetsResults = facets
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
          doc[vector.property] = null
        }

        const newDoc: Result<ResultDocument> = {
          id: getDocumentIdFromInternalId(orama.internalDocumentIDStore, result[0]),
          score: result[1],
          document: doc
        }
        docs[i] = newDoc
      }
    }

    let groups: any = []

    if (params.groupBy) {
      groups = getGroups<T, ResultDocument>(orama, results, params.groupBy)
    }

    const timeEnd = getNanosecondsTime()
    const elapsedTime = timeEnd - timeStart

    return {
      count: results.length,
      hits: docs.filter(Boolean),
      elapsed: {
        raw: Number(elapsedTime),
        formatted: formatNanoseconds(elapsedTime)
      },
      ...(facetsResults ? { facets: facetsResults } : {}),
      ...(groups ? { groups } : {})
    }
  }

  async function executeSearchAsync(): Promise<Results<ResultDocument>> {
    if (orama.beforeSearch) {
      await runBeforeSearch(orama.beforeSearch, orama, params, language)
    }

    const results = performSearchLogic()

    if (orama.afterSearch) {
      await runAfterSearch(orama.afterSearch, orama, params, language, results as any)
    }

    return results
  }

  if (asyncNeeded) {
    return executeSearchAsync()
  }

  // Sync path
  return performSearchLogic()
}
