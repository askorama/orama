import type { Magnitude, VectorType } from '../types.js'

export type SimilarVector = [string, number]

export function getMagnitude(vector: Float32Array, vectorLength: number): number {
  let magnitude = 0
  for (let i = 0; i < vectorLength; i++) {
    magnitude += vector[i] * vector[i]
  }
  return Math.sqrt(magnitude)
}

// @todo: Write plugins for Node and Browsers to use parallel computation for this function
export function findSimilarVectors(
  targetVector: Float32Array,
  vectors: Record<string, [Magnitude, VectorType]>,
  length: number,
  threshold = 0.8
): SimilarVector[] {
  const targetMagnitude = getMagnitude(targetVector, length)

  const similarVectors: SimilarVector[] = []

  for (const [vectorId, [magnitude, vector]] of Object.entries(vectors)) {
    let dotProduct = 0

    for (let i = 0; i < length; i++) {
      dotProduct += targetVector[i] * vector[i]
    }

    const similarity = dotProduct / (targetMagnitude * magnitude)

    if (similarity >= threshold) {
      similarVectors.push([vectorId, similarity])
    }
  }

  return similarVectors.sort((a, b) => b[1] - a[1])
}
