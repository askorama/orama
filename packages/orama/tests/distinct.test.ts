import t from 'tap'
import { create, insertMultiple, search } from '../src/index.js'

t.test('search with distinct', async (t) => {
  const [db, ids] = await createDb()

  t.test('should return distinct values', async (t) => {
    const results = await search(db, {
      distinctOn: 'design'
    })

    const foundIds = results.hits.map((hit) => hit.id)

    t.strictSame(foundIds, [ids[0], ids[3], ids[5], ids[6]])

    t.end()
  })

  t.test('should return distinct values with limit', async (t) => {
    const results = await search(db, {
      distinctOn: 'design',
      limit: 1
    })

    const foundIds = results.hits.map((hit) => hit.id)

    t.strictSame(foundIds, [ids[0]])

    t.end()
  })

  t.test('should return distinct values with offset', async (t) => {
    const results = await search(db, {
      distinctOn: 'design',
      offset: 1
    })

    const foundIds = results.hits.map((hit) => hit.id)

    t.strictSame(foundIds, [ids[3], ids[5], ids[6]])

    t.end()
  })

  t.test('should return distinct values with limit and offset', async (t) => {
    const results = await search(db, {
      distinctOn: 'design',
      limit: 1,
      offset: 1
    })

    const foundIds = results.hits.map((hit) => hit.id)

    t.strictSame(foundIds, [ids[3]])

    t.end()
  })

  t.test('should return distinct values with limit and offset and sortBy', async (t) => {
    const results = await search(db, {
      distinctOn: 'design',
      limit: 1,
      offset: 1,
      sortBy: {
        property: 'id',
        order: 'DESC'
      }
    })

    const foundIds = results.hits.map((hit) => hit.id)

    t.strictSame(foundIds, [ids[5]])
  })

  t.end()
})

async function createDb() {
  const db = await create({
    schema: {
      id: 'string',
      type: 'string',
      design: 'string',
      color: 'string',
      rank: 'number',
      isPromoted: 'boolean'
    }
  })

  const ids = await insertMultiple(db, [
    { id: '0', type: 't-shirt', design: 'A', color: 'blue', rank: 3, isPromoted: true },
    { id: '1', type: 't-shirt', design: 'A', color: 'green', rank: 5, isPromoted: false },
    { id: '2', type: 't-shirt', design: 'A', color: 'red', rank: 4, isPromoted: false },
    { id: '3', type: 't-shirt', design: 'B', color: 'blue', rank: 4, isPromoted: false },
    { id: '4', type: 't-shirt', design: 'B', color: 'green', rank: 4, isPromoted: true },
    { id: '5', type: 't-shirt', design: 'C', color: 'white', rank: 5, isPromoted: false },
    { id: '6', type: 't-shirt', design: 'D', color: 'white', rank: 2, isPromoted: true }
  ])

  return [db, ids] as const
}
