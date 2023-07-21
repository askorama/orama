import { createError } from '../errors.js'
import { TokenScore, BM25Params } from '../types.js'
import { InternalDocumentID } from './internal-document-id-store.js'

export function prioritizeTokenScores(arrays: TokenScore[][], boost: number, threshold = 1): TokenScore[] {
  if (boost === 0) {
    throw createError('INVALID_BOOST_VALUE')
  }

  const tokenMap = new Map<InternalDocumentID, number>()

  const mapsLength = arrays.length
  for (let i = 0; i < mapsLength; i++) {
    const arr = arrays[i]

    const entriesLength = arr.length
    for (let j = 0; j < entriesLength; j++) {
      const [token, score] = arr[j]
      const boostScore = score * boost
      const oldScore = tokenMap.get(token)

      if (oldScore !== undefined) {
        tokenMap.set(token, oldScore * 1.5 + boostScore)
      } else {
        tokenMap.set(token, boostScore)
      }
    }
  }

  const tokenScores: TokenScore[] = []

  for (const tokenStore of tokenMap.entries()) {
    tokenScores.push(tokenStore)
  }

  const results = tokenScores.sort((a, b) => b[1] - a[1])

  // If threshold is 1, it means we will return all the results with at least one search term,
  // prioritizig the ones that contains more search terms (fuzzy match)
  if (threshold === 1) {
    return results
  }

  // If threshold is 0, it means we will only return all the results that contains ALL the search terms (exact match)
  if (threshold === 0) {
    const shortestArrayLength = Math.min(...arrays.map(arr => arr.length))
    return results.slice(0, shortestArrayLength)
  }

  // If the threshold is between 0 and 1, we will return all the results that contains at least the threshold of search terms
  // For example, if threshold is 0.5, we will return all the results that contains at least 50% of the search terms
  // (fuzzy match with a minimum threshold)
  const thresholdLength = Math.ceil((threshold * 100 * results.length) / 100)

  return results.slice(0, results.length + thresholdLength)
}

export function BM25(
  tf: number,
  matchingCount: number,
  docsCount: number,
  fieldLength: number,
  averageFieldLength: number,
  BM25Params: Required<BM25Params>,
) {
  const { k, b, d } = BM25Params
  const idf = Math.log(1 + (docsCount - matchingCount + 0.5) / (matchingCount + 0.5))
  return (idf * (d + tf * (k + 1))) / (tf + k * (1 - b + (b * fieldLength) / averageFieldLength))
}
