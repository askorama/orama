import { TokenScore, BM25Params } from '../types.js'
export declare function prioritizeTokenScores(
  arrays: TokenScore[][],
  boost: number,
  threshold: number | undefined,
  keywordsCount: number
): TokenScore[]
export declare function BM25(
  tf: number,
  matchingCount: number,
  docsCount: number,
  fieldLength: number,
  averageFieldLength: number,
  { k, b, d }: Required<BM25Params>
): number
