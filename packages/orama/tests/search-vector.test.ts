import t from 'tap'
import { create, insertMultiple, searchVector } from '../src/index.js'

t.test('create', t => {
  t.plan(2)

  t.test('should create a vector instance', async t => {
    const db = await create({
      schema: {
        title: 'string',
        description: 'string',
        embedding: 'vector[1536]' 
      }
    })
  
    t.ok(db, 'db instance created')
  })

  t.test('should throw an error if no vector size is provided', async t => {
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

})

t.test('searchVector', t => {
  t.plan(1)

  t.test('should return the most similar vectors', async t => {
    t.plan(3)

    const db = await create({
      schema: {
        vector: 'vector[5]'
      }
    })

    await insertMultiple(db, [
      { vector: [1, 1, 1, 1, 1] },
      { vector: [0, 1, 1, 1, 1] },
      { vector: [0, 0, 1, 1, 1] }
    ])

    const results = await searchVector(db, {
      vector: [1, 1, 1, 1, 1],
      property: 'vector',
      includeVectors: true
    })

    t.same(results.count, 2)
    t.same(results.hits[0].document.vector, [1, 1, 1, 1, 1])
    t.same(results.hits[1].document.vector, [0, 1, 1, 1, 1])

  })
})