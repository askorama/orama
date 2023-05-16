import t from 'tap'
import { create, insert, insertMultiple, search } from '../src'

t.test('create should support array of string', async t => {
  const db = await create({
    schema: {
      name: 'string[]',
    },
  })

  const albusId = await insert(db, {
    name: ['Albus', 'Percival', 'Wulfric', 'Brian'],
  })

  const [harryId, jamesId, lilyId] = await insertMultiple(db, [
    { name: ['Harry', 'James', 'Potter'] },
    { name: ['James', 'Potter'] },
    { name: ['Lily', 'Evans', 'Potter'] },
  ])

  await checkSearchTerm(t, db, 'Albus', [albusId])
  await checkSearchTerm(t, db, 'Harry', [harryId])
  await checkSearchTerm(t, db, 'James', [harryId, jamesId])
  await checkSearchTerm(t, db, 'Potter', [harryId, jamesId, lilyId])
  await checkSearchTerm(t, db, 'P', [albusId, harryId, jamesId, lilyId])
  await checkSearchTerm(t, db, 'foo', [])

  await checkSearchWhere(t, db, 'name', 'Albus', [albusId])
  await checkSearchWhere(t, db, 'name', 'Harry', [harryId])
  await checkSearchWhere(t, db, 'name', 'James', [harryId, jamesId])
  await checkSearchWhere(t, db, 'name', 'Potter', [harryId, jamesId, lilyId])
  await checkSearchWhere(t, db, 'name', 'P', [])
  await checkSearchWhere(t, db, 'name', 'foo', [])

  await checkSearchWhere(t, db, 'name', ['Albus'], [albusId])
  await checkSearchWhere(t, db, 'name', ['Harry'], [harryId])
  await checkSearchWhere(t, db, 'name', ['James'], [harryId, jamesId])
  await checkSearchWhere(t, db, 'name', ['Percival', 'Evans'], [albusId, lilyId])
  await checkSearchWhere(t, db, 'name', ['P'], [])
  await checkSearchWhere(t, db, 'name', ['foo'], [])

  t.end()
})

t.test('create should support array of number', async t => {
  const db = await create({
    schema: {
      n: 'number[]',
    },
  })

  const first = await insert(db, {
    n: [5],
  })

  const [second, third, fourth] = await insertMultiple(db, [{ n: [2, 7] }, { n: [3, 5, 7, 35] }, { n: [3, 2, 5] }])

  await checkSearchWhere(t, db, 'n', { eq: 5 }, [first, third, fourth])
  await checkSearchWhere(t, db, 'n', { eq: 35 }, [third])
  await checkSearchWhere(t, db, 'n', { gt: 6 }, [second, third])
  await checkSearchWhere(t, db, 'n', { gte: 7 }, [second, third])
  await checkSearchWhere(t, db, 'n', { between: [6, 10] }, [second, third])
  await checkSearchWhere(t, db, 'n', { eg: 42 }, [])

  t.end()
})

t.test('create should support array of boolean', async t => {
  const db = await create({
    schema: {
      b: 'boolean[]',
    },
  })

  const first = await insert(db, {
    b: [true],
  })

  const [second, third, fourth] = await insertMultiple(db, [
    { b: [false] },
    { b: [true, false] },
    { b: [true, true, true] },
  ])

  await checkSearchWhere(t, db, 'b', true, [first, third, fourth])
  await checkSearchWhere(t, db, 'b', false, [second, third])

  t.end()
})

async function checkSearchTerm(t, db, term, expectedIds) {
  const result = await search(db, {
    term,
  })
  t.equal(result.hits.length, expectedIds.length)
  t.equal(result.count, expectedIds.length)
  t.strictSame(new Set(result.hits.map(h => h.id)), new Set(expectedIds))
}

async function checkSearchWhere(t, db, key, where, expectedIds) {
  const result = await search(db, {
    where: {
      [key]: where,
    },
  })
  t.equal(result.hits.length, expectedIds.length)
  t.equal(result.count, expectedIds.length)
  t.strictSame(new Set(result.hits.map(h => h.id)), new Set(expectedIds))
}
