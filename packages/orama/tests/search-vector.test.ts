import t from 'tap'
import { create, insertMultiple, searchVector } from '../src/index.js'

t.test('create', (t) => {
  t.plan(3)

  t.test('should create a vector instance', async (t) => {
    const db = await create({
      schema: {
        title: 'string',
        description: 'string',
        embedding: 'vector[1536]'
      }
    })

    t.ok(db, 'db instance created')
  })

  t.test('should throw an error if no vector size is provided', async (t) => {
    try {
      await create({
        schema: {
          title: 'string',
          description: 'string',
          // @ts-expect-error error case
          embedding: 'vector[]'
        }
      })
    } catch (err) {
      t.ok(err, 'error thrown')
    }
  })

  t.test('should throw an error if vector size is not a number', async (t) => {
    try {
      await create({
        schema: {
          title: 'string',
          description: 'string',
          // @ts-expect-error error case
          embedding: 'vector[foo]'
        }
      })
    } catch (err) {
      t.ok(err, 'error thrown')
    }
  })
})

t.test('searchVector', (t) => {
  t.plan(4)

  t.test('should return the most similar vectors', async (t) => {
    t.plan(3)

    const db = await create({
      schema: {
        vector: 'vector[5]'
      }
    })

    await insertMultiple(db, [{ vector: [1, 1, 1, 1, 1] }, { vector: [0, 1, 1, 1, 1] }, { vector: [0, 0, 1, 1, 1] }])

    const results = await searchVector(db, {
      vector: [1, 1, 1, 1, 1],
      property: 'vector',
      includeVectors: true
    })

    t.same(results.count, 2)
    t.same(results.hits[0].document.vector, [1, 1, 1, 1, 1])
    t.same(results.hits[1].document.vector, [0, 1, 1, 1, 1])
  })

  t.test('should search through nested properties', async (t) => {
    t.plan(3)

    const db = await create({
      schema: {
        title: 'string',
        vectors: {
          embedding: 'vector[5]'
        }
      }
    })

    await insertMultiple(db, [
      { title: 'foo', vectors: { embedding: [1, 1, 1, 1, 1] } },
      { title: 'bar', vectors: { embedding: [0, 1, 1, 1, 1] } },
      { title: 'baz', vectors: { embedding: [0, 0, 1, 1, 1] } }
    ])

    const results = await searchVector(db, {
      vector: [1, 1, 1, 1, 1],
      property: 'vectors.embedding',
      includeVectors: true
    })

    t.same(results.count, 2)
    t.same((results.hits[0].document as any).vectors.embedding, [1, 1, 1, 1, 1])
    t.same((results.hits[1].document as any).vectors.embedding, [0, 1, 1, 1, 1])
  })

  t.test('should search through deeply nested properties', async (t) => {
    t.plan(3)

    const db = await create({
      schema: {
        title: 'string',
        deeply: {
          nested: {
            vectors: 'vector[5]'
          }
        }
      }
    })

    await insertMultiple(db, [
      { title: 'foo', deeply: { nested: { vectors: [1, 1, 1, 1, 1] } } },
      { title: 'bar', deeply: { nested: { vectors: [0, 1, 1, 1, 1] } } },
      { title: 'baz', deeply: { nested: { vectors: [0, 0, 1, 1, 1] } } }
    ])

    const results = await searchVector(db, {
      vector: [1, 1, 1, 1, 1],
      property: 'deeply.nested.vectors',
      includeVectors: true
    })

    t.same(results.count, 2)
    t.same((results.hits[0].document as any).deeply.nested.vectors, [1, 1, 1, 1, 1])
    t.same((results.hits[1].document as any).deeply.nested.vectors, [0, 1, 1, 1, 1])
  })

  t.test('should be able to work on multiple vector properties at creation time', async (t) => {
    t.plan(7)

    const db = await create({
      schema: {
        title: 'string',
        vectors: {
          embedding: 'vector[5]',
          embedding_2: 'vector[6]'
        }
      }
    })

    await insertMultiple(db, [
      { title: 'foo', vectors: { embedding: [1, 1, 1, 1, 1], embedding_2: [0.2, 0.2, 0.2, 0.2, 0.2, 0.2] } },
      { title: 'bar', vectors: { embedding: [0, 1, 1, 1, 1], embedding_2: [0.2, 0.02, 0.1, 0.1, 0.1, 0.1] } },
      { title: 'baz', vectors: { embedding: [0, 0, 1, 1, 1], embedding_2: [0.2, 0.2, 0.21, 0.21, 0.21, 0.21] } }
    ])

    const results1 = await searchVector(db, {
      vector: [1, 1, 1, 1, 1],
      property: 'vectors.embedding',
      includeVectors: true
    })

    const results2 = await searchVector(db, {
      vector: [0.2, 0.2, 0.2, 0.2, 0.2, 0.2],
      property: 'vectors.embedding_2',
      includeVectors: true
    })

    t.same(results1.count, 2)
    t.same((results1.hits[0].document as any).vectors.embedding, [1, 1, 1, 1, 1])
    t.same((results1.hits[1].document as any).vectors.embedding, [0, 1, 1, 1, 1])

    t.same(results2.count, 3)
    t.same((results2.hits[0].document as any).vectors.embedding_2, [0.2, 0.2, 0.2, 0.2, 0.2, 0.2])
    t.same((results2.hits[1].document as any).vectors.embedding_2, [0.2, 0.2, 0.21, 0.21, 0.21, 0.21])
    t.same((results2.hits[2].document as any).vectors.embedding_2, [0.2, 0.02, 0.1, 0.1, 0.1, 0.1])
  })
})
