import type { BM25Params } from "./types.js";
import { TokenScore } from "./types.js";

// Adapted from https://github.com/lovasoa/fast_array_intersect
// MIT Licensed (https://github.com/lovasoa/fast_array_intersect/blob/master/LICENSE)
// while on tag https://github.com/lovasoa/fast_array_intersect/tree/v1.1.0
export function intersectTokenScores(arrays: TokenScore[][]): TokenScore[] {
  if (arrays.length === 0) {
    return [];
  }

  for (let i = 1; i < arrays.length; i++) {
    if (arrays[i].length < arrays[0].length) {
      const tmp = arrays[0];
      arrays[0] = arrays[i];
      arrays[i] = tmp;
    }
  }

  const set: Map<string, [number, number]> = new Map();
  for (const elem of arrays[0]) {
    set.set(elem[0], [1, elem[1]]);
  }

  const arrLength = arrays.length;
  for (let i = 1; i < arrLength; i++) {
    let found = 0;
    for (const elem of arrays[i]) {
      /* c8 ignore next */
      const key = elem[0] ?? "";

      const [count, score] = set.get(key) ?? [0, 0];
      if (count === i) {
        set.set(key, [count + 1, score + elem[1]]);
        found++;
      }
    }

    if (found === 0) {
      return [];
    }
  }

  const result: TokenScore[] = [];

  for (const [token, [count, score]] of set) {
    if (count === arrLength) {
      result.push([token, score]);
    }
  }

  return result;
}

export function prioritizeTokenScores(arrays: TokenScore[][]): TokenScore[] {
  const tokenMap: Record<string, number> = {};

  const mapsLength = arrays.length;
  for (let i = 0; i < mapsLength; i++) {
    const arr = arrays[i];

    const entriesLength = arr.length;
    for (let j = 0; j < entriesLength; j++) {
      const [token, score] = arr[j];

      if (token in tokenMap) {
        tokenMap[token] += score + 0.5
      } else {
        tokenMap[token] = score;
      }
    }
  }

  return Object.entries(tokenMap).sort((a, b) => b[1] - a[1]);
}

export function BM25(
  tf: number,
  matchingCount: number,
  docsCount: number,
  fieldLength: number,
  averageFieldLength: number,
  BM25Params: BM25Params
) {
  const { k, b, d } = BM25Params;
  const idf = Math.log(1 + (docsCount - matchingCount + 0.5) / (matchingCount + 0.5));
  return idf * (d + tf * (k + 1)) / (tf + k * (1 - b + b * fieldLength / averageFieldLength));
}