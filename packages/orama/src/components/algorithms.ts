import { createError } from '../errors.js'
import { TokenScore, BM25Params } from '../types.js'

export function prioritizeTokenScores(arrays: TokenScore[][], boost: number, threshold = 1): TokenScore[] {
  if (boost === 0) {
    throw createError('INVALID_BOOST_VALUE')
  }

  const tokenMap: Record<string, number> = {}

  const mapsLength = arrays.length
  for (let i = 0; i < mapsLength; i++) {
    const arr = arrays[i]

    const entriesLength = arr.length
    for (let j = 0; j < entriesLength; j++) {
      const [token, score] = arr[j]
      const boostScore = score * boost

      if (token in tokenMap) {
        tokenMap[token] *= 1.5 + boostScore
      } else {
        tokenMap[token] = boostScore
      }
    }
  }

  const results = Object.entries(tokenMap).sort((a, b) => b[1] - a[1])

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
