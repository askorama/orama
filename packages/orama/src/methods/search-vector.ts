import type { Magnitude, Orama, Result, Results, VectorType } from '../types.js'
import { getNanosecondsTime, formatNanoseconds } from '../utils.js'
import { findSimilarVectors } from '../components/cosine-similarity.js'
import { getInternalDocumentId } from '../components/internal-document-id-store.js'
import { createError } from '../errors.js'

export type SearchVectorParams = {
  vector: number[] | Float32Array
  property: string
  similarity?: number
  limit?: number
  offset?: number
  includeVectors?: boolean
}

export async function searchVector(orama: Orama, params: SearchVectorParams): Promise<Results> {
  const timeStart = await getNanosecondsTime()
  let { vector } = params
  const { property, limit = 10, offset = 0, includeVectors = false } = params
  const vectorIndex = (orama.data.index as any).vectorIndexes[property]
  const vectorSize = vectorIndex.size
  const vectors = vectorIndex.vectors as Record<string, [Magnitude, VectorType]>

  if (vector.length !== vectorSize) {
    throw createError('INVALID_INPUT_VECTOR', property, vectorSize, vector.length)
  }

  if (!(vector instanceof Float32Array)) {
    vector = new Float32Array(vector)
  }

  const results = findSimilarVectors(vector, vectors, vectorSize, params.similarity)

  const docs = Array.from({ length: limit })

  for (let i = 0; i < limit; i++) {
    const result = results[i + offset]
    if (!result) {
      break
    }

    const originalID = getInternalDocumentId(orama.internalDocumentIDStore, result.id)
    const doc = (orama.data.docs as any).docs[originalID]

    if (doc) {
      // TODO: manage multiple vector properties
      if (!includeVectors) {
        doc[property] = null
      }

      const newDoc = {
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
    hits: docs.filter(Boolean) as Result[],
    elapsed: {
      raw: Number(elapsedTime),
      formatted: await formatNanoseconds(elapsedTime),
    }
  }
}