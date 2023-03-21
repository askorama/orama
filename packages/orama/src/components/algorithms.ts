import { createError } from '../errors.js'
import { TokenScore, BM25Params } from '../types.js'

export function prioritizeTokenScores(arrays: TokenScore[][], boost: number): TokenScore[] {
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

  return Object.entries(tokenMap).sort((a, b) => b[1] - a[1])
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
