import t from 'tap'
import { findSimilarVectors, getMagnitude } from '../src/components/cosine-similarity.js'

function toF32(vector: number[]): Float32Array {
  return new Float32Array(vector)
}

t.test('cosine similarity', (t) => {
  t.plan(2)

  t.test('getMagnitude', (t) => {
    t.plan(1)

    t.test('should return the magnitude of a vector', (t) => {
      t.plan(3)

      {
        const vector = toF32([1, 0, 0, 0, 0, 0, 0, 0, 0, 0])
        const magnitude = getMagnitude(vector, vector.length)

        t.equal(magnitude, 1)
      }

      {
        const vector = toF32([1, 1, 1, 1, 1, 1, 1, 1, 1, 1])
        const magnitude = getMagnitude(vector, vector.length)

        t.equal(magnitude, Math.sqrt(10))
      }

      {
        const vector = toF32([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
        const magnitude = getMagnitude(vector, vector.length)

        t.equal(magnitude, Math.sqrt(385))
      }
    })
  })

  t.test('findSimilarVectors', (t) => {
    t.plan(1)

    t.test('should return the most similar vectors', (t) => {
      t.plan(3)

      const targetVector = toF32([1, 1, 1, 1, 1, 1, 1, 1, 1, 1])
      const vectors = {
        '1': [1, toF32([1, 0, 0, 0, 0, 0, 0, 0, 0, 0])],
        '2': [1, toF32([0, 1, 1, 1, 1, 1, 1, 1, 1, 1])],
        '3': [1, toF32([0, 0, 1, 1, 1, 1, 1, 1, 1, 1])]
      }

      // @ts-expect-error - @todo: fix types
      const similarVectors = findSimilarVectors(targetVector, vectors, targetVector.length)

      t.same(similarVectors.length, 2)
      t.same(similarVectors[0].id, '2')
      t.same(similarVectors[1].id, '3')
    })
  })
})
