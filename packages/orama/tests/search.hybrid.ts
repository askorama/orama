import t from 'tap'
import { search, insertMultiple, create } from '../src/index.js'

t.test('hybrid search', async t => {
  t.test('should return results', async t => {
    const db = await create({
      schema: {
        text: 'string',
        embedding: 'vector[5]',
        number: 'number'
      } as const
    })

    await insertMultiple(db, [
      { text: 'hello world', embedding: [1, 2, 3, 4, 5], number: 1 },
      { text: 'hello there', embedding: [1, 2, 3, 4, 4], number: 2 },
    ])

    const results = await search(db, {
      mode: 'hybrid',
      term: 'hello',
      vectorPropertiy: 'embedding',
      vector: [1, 2, 3, 4, 5],
      similarity: 1
    })

    t.equal(results.count, 1)
  })

  t.test('should return results with filters', async t => {
    const db = await create({
      schema: {
        text: 'string',
        embedding: 'vector[5]',
        number: 'number'
      } as const
    })

    await insertMultiple(db, [
      { text: 'hello world', embedding: [1, 2, 3, 4, 5], number: 1 },
      { text: 'hello there', embedding: [1, 2, 3, 4, 4], number: 2 },
      { text: 'hello there', embedding: [1, 2, 3, 4, 4], number: 3 },
    ])

    const results1 = await search(db, {
      mode: 'hybrid',
      term: 'hello',
      vectorPropertiy: 'embedding',
      vector: [1, 2, 3, 4, 4],
      similarity: 1,
      where: {
        number: {
          eq: 3
        }
      }
    })

    const results2 = await search(db, {
      mode: 'hybrid',
      term: 'hello',
      vectorPropertiy: 'embedding',
      vector: [1, 2, 3, 4, 4],
      similarity: 1,
      where: {
        number: {
          eq: 0
        }
      }
    })

    t.equal(results1.count, 1)
    t.equal(results2.count, 0)
  })


})