export function getMagnitude(vector, vectorLength) {
  let magnitude = 0
  for (let i = 0; i < vectorLength; i++) {
    magnitude += vector[i] * vector[i]
  }
  return Math.sqrt(magnitude)
}
// @todo: Write plugins for Node and Browsers to use parallel computation for this function
export function findSimilarVectors(targetVector, vectors, length, threshold = 0.8) {
  const targetMagnitude = getMagnitude(targetVector, length)
  const similarVectors = []
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
//# sourceMappingURL=cosine-similarity.js.map
