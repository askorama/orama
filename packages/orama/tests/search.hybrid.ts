import t from 'tap'
import { search, insertMultiple, create } from '../src/index.js'

t.only('hybrid search', async t => {
  t.only('should return results', async t => {
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
    })

    console.log(results)

    t.equal(results.count, 2)
  })
})