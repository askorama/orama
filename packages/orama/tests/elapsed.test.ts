import t from 'tap'
import { create, insert, search } from '../src/index.js'

t.test('elapsed', async (t) => {
  t.test('should correctly set elapsed time to a custom format', async (t) => {
    const db = await create({
      schema: {
        title: 'string',
        body: 'string'
      } as const,
      components: {
        formatElapsedTime: (n: bigint) => {
          return `${Number(n)}n`
        }
      }
    })

    await insert(db, {
      title: 'Hello world',
      body: 'This is a test'
    })

    const results = await search(db, {
      term: 'test'
    })

    t.same(typeof results.elapsed, 'string')
    t.same(/(\d)n$/.test(results.elapsed as unknown as string), true)
  })

  t.test('should correctly set elapsed time to a bigint by default', async (t) => {
    const db = await create({
      schema: {
        title: 'string',
        body: 'string'
      } as const
    })

    await insert(db, {
      title: 'Hello world',
      body: 'This is a test'
    })

    const results = await search(db, {
      term: 'test'
    })

    t.same(typeof results.elapsed, 'object')
  })
})
