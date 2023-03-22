import t from 'tap'
import { create, insert, search } from '../src/index.js'
import { formatNanoseconds } from '../src/utils.js'

t.test('elapsed', t => {
  t.plan(2)

  t.test('should correctly set elapsed time to a human-readable form', async t => {
    t.plan(2)

    const db = await create({
      schema: {
        title: 'string',
        body: 'string',
      },
    })

    await insert(db, {
      title: 'Hello world',
      body: 'This is a test',
    })

    const results = await search(db, {
      term: 'test',
    })

    t.same(typeof results.elapsed, 'object')
    t.same(results.elapsed.formatted, formatNanoseconds(results.elapsed.raw))
  })

  t.test('should correctly set elapsed time to a bigint by default', async t => {
    t.plan(1)
    const db = await create({
      schema: {
        title: 'string',
        body: 'string',
      },
    })

    await insert(db, {
      title: 'Hello world',
      body: 'This is a test',
    })

    const results = await search(db, {
      term: 'test',
    })

    t.same(typeof results.elapsed, 'object')
  })
})
