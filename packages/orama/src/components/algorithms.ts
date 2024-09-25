import { createError } from '../errors.js'
import { TokenScore, BM25Params } from '../types.js'
import { InternalDocumentID } from './internal-document-id-store.js'

export function prioritizeTokenScores(arrays: TokenScore[][], boost: number): TokenScore[] {
  if (boost === 0) {
    throw createError('INVALID_BOOST_VALUE')
  }

  const tokenScoresMap = new Map<InternalDocumentID, [number, number]>()

  const mapsLength = arrays.length
  for (let i = 0; i < mapsLength; i++) {
    const arr = arrays[i]

    const entriesLength = arr.length
    for (let j = 0; j < entriesLength; j++) {
      const [token, score] = arr[j]
      const boostScore = score * boost
      const oldScore = tokenScoresMap.get(token)?.[0]

      if (oldScore !== undefined) {
        tokenScoresMap.set(token, [oldScore * 1.5 + boostScore, (tokenScoresMap?.get(token)?.[1] || 0) + 1])
      } else {
        tokenScoresMap.set(token, [boostScore, 1])
      }
    }
  }

  const tokenScores: TokenScore[] = []

  for (const tokenScoreEntry of tokenScoresMap.entries()) {
    tokenScores.push([tokenScoreEntry[0], tokenScoreEntry[1][0]])
  }

  const results = tokenScores.sort((a, b) => b[1] - a[1])

  return results
}

export function BM25(
  tf: number,
  matchingCount: number,
  docsCount: number,
  fieldLength: number,
  averageFieldLength: number,
  { k, b, d }: Required<BM25Params>
) {
  const idf = Math.log(1 + (docsCount - matchingCount + 0.5) / (matchingCount + 0.5))
  return (idf * (d + tf * (k + 1))) / (tf + k * (1 - b + (b * fieldLength) / averageFieldLength))
}
