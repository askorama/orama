import { findSimilarVectors } from '../components/cosine-similarity.js'
import { getInternalDocumentId } from '../components/internal-document-id-store.js'
import { createError } from '../errors.js'
import type { AnyOrama, Result, Results, TypedDocument } from '../types.js'
import { formatNanoseconds, getNanosecondsTime } from '../utils.js'

export type SearchVectorParams = {
  vector: number[] | Float32Array
  property: string
  similarity?: number
  limit?: number
  offset?: number
  includeVectors?: boolean
}

export async function searchVector<T extends AnyOrama, ResultDocument extends TypedDocument<T>>(
  orama: T,
  params: SearchVectorParams
): Promise<Results<ResultDocument>> {
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
