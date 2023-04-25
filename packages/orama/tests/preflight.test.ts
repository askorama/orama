import t from 'tap'
import { create } from '../src/methods/create.js'
import { insert } from '../src/methods/insert.js'
import { search } from '../src/methods/search.js'

t.test('preflight request', async t => {
  t.plan(4)

  const db = await create({
    schema: {
      title: 'string',
    },
  })

  await insert(db, { title: 'Red headphones' })
  await insert(db, { title: 'Blue headphones' })
  await insert(db, { title: 'Yellow headphones' })
  await insert(db, { title: 'Magenta headphones' })
  await insert(db, { title: 'Green headphones' })

  const results = await search(db, {
    term: 'headphones',
    preflight: true,
  })

  const fullResults = await search(db, {
    term: 'headphones',
  })

  t.same(results.count, 5)
  t.same(results.hits, [])
  t.same(fullResults.count, 5)
  t.same(fullResults.hits.length, 5)
})
