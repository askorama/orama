import t from 'tap'
import { ScalarSearchableValue, count, create, insert, insertMultiple, load, remove, save, search } from '../src/index.js'

t.test('enum', async t => {

  t.test('filter', async t => {
    const db = await create({
      schema: {
        categoryId: 'enum',
      },
    })

    const c1 = await insert(db, {
      categoryId: 1,
    })
    const [c11, c2, c3, c5] = await insertMultiple(db, [
      { categoryId: 1 },
      { categoryId: 2 },
      { categoryId: 3 },
      { categoryId: "5" },
    ])
    const documentCount = await count(db)
    const allIds = [c1, c11, c2, c3, c5]

    const tests: {value: ScalarSearchableValue, expected: string[] }[] = [
      { value: 1, expected: [c1, c11] },
      { value: 2, expected: [c2] },
      { value: 3, expected: [c3] },
      { value: '5', expected: [c5] },
      { value: 'unknown', expected: [] },
    ]
    

    t.test('eq operator', async t => {
      for (const { value, expected } of tests) {
        t.test(`eq: ${value}`, async t => {
          const result = await search(db, {
            term: '',
            where: {
              categoryId: { eq: value },
            }
          })
          t.equal(result.hits.length, expected.length)
          t.strictSame(result.hits.map(h => h.id), expected)

          t.end()
        })
      }
    })

    t.test('in operator', async t => {
      for (const { value, expected } of tests) {
        t.test(`in: [${value}]`, async t => {
          const result = await search(db, {
            term: '',
            where: {
              categoryId: { in: [value] },
            }
          })
          t.equal(result.hits.length, expected.length)
          t.strictSame(result.hits.map(h => h.id), expected)

          t.end()
        })
      }

      t.test(`in: [1, 3, "5", 'unknown']`, async t => {
        const result = await search(db, {
          term: '',
          where: {
            categoryId: { in: [1, 3, "5", 'unknown'] },
          }
        })
        t.equal(result.hits.length, 4)
        t.strictSame(result.hits.map(h => h.id), [c1, c11, c3, c5])

        t.end()
      })
    })

    t.test('nin operator', async t => {
      for (const { value, expected } of tests) {
        t.test(`nin: [${value}]`, async t => {
          const result = await search(db, {
            term: '',
            where: {
              categoryId: { nin: [value] },
            }
          })
          t.equal(result.hits.length, documentCount - expected.length)
          t.strictSame(result.hits.map(h => h.id), allIds.filter(id => expected.includes(id) === false))
        })
      }

      t.test(`nin: [1, 3, "5", 'unknown']`, async t => {
        const result = await search(db, {
          term: '',
          where: {
            categoryId: { nin: [1, 3, "5", 'unknown'] },
          }
        })
        t.equal(result.hits.length, 1)
        t.strictSame(result.hits.map(h => h.id), [c2])

        t.end()
      })

      t.test(`nin: [1, 2, 3, "5", 'unknown']`, async t => {
        const result = await search(db, {
          term: '',
          where: {
            categoryId: { nin: [1, 2, 3, "5", 'unknown'] },
          }
        })
        t.equal(result.hits.length, 0)
        t.strictSame(result.hits.map(h => h.id), [])

        t.end()
      })
    })

    t.end()
  })

  t.test(`remove document works fine`, async t => {
    const db = await create({
      schema: {
        categoryId: 'enum',
      },
    })
    const c1 = await insert(db, { categoryId: 1 })
    const c11 = await insert(db, { categoryId: 1 })

    const result1 = await search(db, {
      term: '',
      where: { categoryId: { eq: 1 }, }
    })
    t.equal(result1.hits.length, 2)
    t.strictSame(result1.hits.map(h => h.id), [c1, c11])

    await remove(db, c1)

    const result2 = await search(db, {
      term: '',
      where: { categoryId: { eq: 1 }, }
    })
    t.equal(result2.hits.length, 1)
    t.strictSame(result2.hits.map(h => h.id), [c11])

    t.end()
  })

  t.test(`still serializable`, async t => {
    const db1 = await create({
      schema: {
        categoryId: 'enum',
      },
    })
    const [c1, c11, c2, c3, c5] = await insertMultiple(db1, [
      { categoryId: 1 },
      { categoryId: 1 },
      { categoryId: 2 },
      { categoryId: 3 },
      { categoryId: "5" },
    ])

    const dump = await save(db1)
    const dump2 = JSON.parse(JSON.stringify(dump))

    const db2 = await create({
      schema: {
        categoryId: 'enum',
      },
    })
    await load(db2, dump2)

    const result1 = await search(db2, {
      term: '',
      where: {
        categoryId: { eq: 1 },
      }
    })
    t.equal(result1.hits.length, 2)
    t.strictSame(result1.hits.map(h => h.id), [c1, c11])

    const result2 = await search(db2, {
      term: '',
      where: {
        categoryId: { in: [1, 2, 3, '5', 'unknown'] },
      }
    })
    t.equal(result2.hits.length, 5)
    t.strictSame(result2.hits.map(h => h.id), [c1, c11, c2, c3, c5])

    t.end()
  })

  t.test(`complex example`, async t => {
    const filmDb = await create({
      schema: {
        title: 'string',
        year: 'number',
        categoryId: 'enum',
      },
    })
    const [c1] = await insertMultiple(filmDb, [
      { title: 'The Shawshank Redemption', year: 1994, categoryId: 1 },
      { title: 'The Godfather', year: 1972, categoryId: 1 },
      { title: 'The Dark Knight', year: 2008, categoryId: 2 },
      { title: 'Schindler\'s List', year: 1993, categoryId: 3 },
      { title: 'The Lord of the Rings: The Return of the King', year: 2003, categoryId: 4 },
    ])


    const result1 = await search(filmDb, {
      term: 'r',
    })
    t.equal(result1.hits.length, 2)

    const result2 = await search(filmDb, {
      term: 'r',
      where: {
        categoryId: { eq: 1 },
      }
    })
    t.equal(result2.hits.length, 1)
    t.strictSame(result2.hits.map(h => h.id), [c1])

    const result3 = await search(filmDb, {
      term: 'r',
      where: {
        year: { gt: 2000 },
        categoryId: { eq: 1 },
      }
    })
    t.equal(result3.hits.length, 0)
    t.strictSame(result3.hits.map(h => h.id), [])

    const result4 = await search(filmDb, {
      term: 'r',
      where: {
        year: { lte: 2000 },
        categoryId: { eq: 1 },
      }
    })
    t.equal(result4.hits.length, 1)
    t.strictSame(result4.hits.map(h => h.id), [c1])

    t.end()
  })

  t.end()
})
