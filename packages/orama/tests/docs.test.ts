import t from 'tap'
import { count, getByID, create, insert } from '../src/index.js'

t.test('count', async (t) => {
  const db = await create({
    schema: {
      id: 'string',
      title: 'string'
    } as const
  })

  await insert(db, { id: 'doc1', title: 'Hello World 1' })
  await insert(db, { id: 'doc2', title: 'Hello World 2' })
  await insert(db, { id: 'doc3', title: 'Hello World 3' })

  t.equal(await count(db), 3, 'count')
  t.equal((await getByID(db, 'doc1'))?.title, 'Hello World 1', 'getByID')
})
