import { createError } from '../errors.js'
import { TokenScore, BM25Params } from '../types.js'
import { InternalDocumentID } from './internal-document-id-store.js'

export function prioritizeTokenScores(
  arrays: TokenScore[][],
  boost: number,
  threshold = 1,
  keywordsCount: number,
): TokenScore[] {
  if (boost === 0) {
    throw createError('INVALID_BOOST_VALUE')
  }

  const tokenScoresMap = new Map<InternalDocumentID, number>()
  const tokenKeywordsCountMap = new Map<InternalDocumentID, number>()

  const mapsLength = arrays.length
  for (let i = 0; i < mapsLength; i++) {
    const arr = arrays[i]

    const entriesLength = arr.length
    for (let j = 0; j < entriesLength; j++) {
      const [token, score] = arr[j]
      const boostScore = score * boost
      const oldScore = tokenScoresMap.get(token)

      if (oldScore !== undefined) {
        tokenScoresMap.set(token, oldScore * 1.5 + boostScore)
        tokenKeywordsCountMap.set(token, tokenKeywordsCountMap.get(token)! + 1)
      } else {
        tokenScoresMap.set(token, boostScore)
        tokenKeywordsCountMap.set(token, 1)
      }
    }
  }

  const tokenScores: TokenScore[] = []

  for (const tokenScoreEntry of tokenScoresMap.entries()) {
    tokenScores.push(tokenScoreEntry)
  }

  const results = tokenScores.sort((a, b) => b[1] - a[1])

  // If threshold is 1, it means we will return all the results with at least one search term,
  // prioritizig the ones that contains more search terms (fuzzy match)
  if (threshold === 1) {
    return results
  }

  // Prepare keywords count tracking for threshold handling
  const allResults = results.length
  const tokenKeywordsCount: [InternalDocumentID, number][] = []

  for (const tokenKeywordsCountEntry of tokenKeywordsCountMap.entries()) {
    tokenKeywordsCount.push(tokenKeywordsCountEntry)
  }

  // Find the index of the last result with all keywords.
  // Note that since score is multipled by 1.5 any time the token is encountered in results it means
  // that tokenScores and tokenKeywordsCount should always have the same order.
  const keywordsPerToken = tokenKeywordsCount.sort((a, b) => b[1] - a[1])

  let lastTokenWithAllKeywords: number | undefined = undefined
  for (let i = 0; i < allResults; i++) {
    if (keywordsPerToken[i][1] === keywordsCount) {
      lastTokenWithAllKeywords = i
    } else {
      break
    }
  }

  // If no results had all the keywords, either bail out earlier or normalize
  if (typeof lastTokenWithAllKeywords === 'undefined') {
    if (threshold === 0) {
      return []
    }

    lastTokenWithAllKeywords = 0
  }

  // If threshold is 0, it means we will only return all the results that contains ALL the search terms (exact match)
  if (threshold === 0) {
    return results.slice(0, lastTokenWithAllKeywords + 1)
  }

  // If the threshold is between 0 and 1, we will return all the results that contains at least the threshold of search terms
  // For example, if threshold is 0.5, we will return all the results that contains at least 50% of the search terms
  // (fuzzy match with a minimum threshold)
  const thresholdLength =
    lastTokenWithAllKeywords + Math.ceil((threshold * 100 * (results.length - lastTokenWithAllKeywords)) / 100)

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
