import type { Magnitude, VectorType } from '../types.js'
export type SimilarVector = [string, number]
export declare function getMagnitude(vector: Float32Array, vectorLength: number): number
export declare function findSimilarVectors(
  targetVector: Float32Array,
  vectors: Record<string, [Magnitude, VectorType]>,
  length: number,
  threshold?: number
): SimilarVector[]
