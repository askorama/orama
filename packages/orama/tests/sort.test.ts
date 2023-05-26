import t from 'tap'
import { CustomSorterFunctionItem, create, insert, insertMultiple, load, remove, save, search } from '../src/index.js'

t.test('search with sortBy', t => {
  t.test('on number', async t => {
    const db = await create({
      schema: {
        number: 'number',
      },
    })
    const [id1, id2, id3, id4, id5, id6] = await insertMultiple(db, [
      { number: 5 },
      { number: 2 },
      { number: 7 },
      { number: 10 },
      { number: -3 },
      {},
    ])

    t.test('should sort correctly - asc', async t => {
      const result = await search(db, {
        sortBy: {
          property: 'number',
        },
      })

      t.strictSame(
        result.hits.map(d => d.id),
        [id5, id2, id1, id3, id4, id6],
      )

      const result2 = await search(db, {
        sortBy: {
          property: 'number',
          order: 'ASC',
        },
      })

      t.strictSame(
        result2.hits.map(d => d.id),
        [id5, id2, id1, id3, id4, id6],
      )

      t.end()
    })

    t.test('should sort correctly - desc', async t => {
      const result = await search(db, {
        sortBy: {
          property: 'number',
          order: 'DESC',
        },
      })

      t.strictSame(
        result.hits.map(d => d.id),
        [id4, id3, id1, id2, id5, id6],
      )

      t.end()
    })

    t.test('should work correctly also after removal', async t => {
      const db = await create({
        schema: { number: 'number' },
      })
      const [id1, id2, id3, id4, id5, id6] = await insertMultiple(db, [
        { number: 5 },
        { number: 2 },
        { number: 7 },
        { number: 10 },
        { number: -3 },
        {},
      ])
      let ascExpected = [id5, id2, id1, id3, id4, id6]
      let descExpected = [id4, id3, id1, id2, id5, id6]

      let resultAsc = await search(db, { sortBy: { property: 'number' } })
      t.strictSame(
        resultAsc.hits.map(d => d.id),
        ascExpected,
      )
      let resultDesc = await search(db, { sortBy: { property: 'number', order: 'DESC' } })
      t.strictSame(
        resultDesc.hits.map(d => d.id),
        descExpected,
      )

      const elementToRemove = [id2, id1, id4, id3, id5, id6]
      for (const idToRemove of elementToRemove) {
        await remove(db, idToRemove)
        descExpected = descExpected.filter(id => id !== idToRemove)
        ascExpected = ascExpected.filter(id => id !== idToRemove)

        resultAsc = await search(db, { sortBy: { property: 'number' } })
        t.strictSame(
          resultAsc.hits.map(d => d.id),
          ascExpected,
        )
        resultDesc = await search(db, { sortBy: { property: 'number', order: 'DESC' } })
        t.strictSame(
          resultDesc.hits.map(d => d.id),
          descExpected,
        )
      }

      t.end()
    })

    t.end()
  })

  t.test('on string', async t => {
    const db = await create({
      schema: {
        string: 'string',
      },
    })
    const [id1, id2, id3, id4, id5, id6] = await insertMultiple(db, [
      { string: 'a' },
      { string: 'e' },
      { string: 'z' },
      { string: 'd' },
      { string: 'f' },
      {},
    ])

    t.test('should sort correctly - asc', async t => {
      const result = await search(db, {
        sortBy: {
          property: 'string',
        },
      })
      t.strictSame(
        result.hits.map(d => d.id),
        [id1, id4, id2, id5, id3, id6],
      )
      t.end()
    })

    t.test('should sort correctly - desc', async t => {
      const result = await search(db, {
        sortBy: {
          property: 'string',
          order: 'DESC',
        },
      })
      t.strictSame(
        result.hits.map(d => d.id),
        [id3, id5, id2, id4, id1, id6],
      )
      t.end()
    })

    t.test('should work correctly also after removal', async t => {
      const db = await create({
        schema: {
          string: 'string',
        },
      })
      const [id1, id2, id3, id4, id5, id6] = await insertMultiple(db, [
        { string: 'a' },
        { string: 'e' },
        { string: 'z' },
        { string: 'd' },
        { string: 'f' },
        {},
      ])
      let ascExpected = [id1, id4, id2, id5, id3, id6]
      let descExpected = [id3, id5, id2, id4, id1, id6]

      let resultAsc = await search(db, { sortBy: { property: 'string' } })
      t.strictSame(
        resultAsc.hits.map(d => d.id),
        ascExpected,
      )
      let resultDesc = await search(db, { sortBy: { property: 'string', order: 'DESC' } })
      t.strictSame(
        resultDesc.hits.map(d => d.id),
        descExpected,
      )

      const elementToRemove = [id2, id1, id4, id3, id5, id6]
      for (const idToRemove of elementToRemove) {
        await remove(db, idToRemove)
        descExpected = descExpected.filter(id => id !== idToRemove)
        ascExpected = ascExpected.filter(id => id !== idToRemove)

        resultAsc = await search(db, { sortBy: { property: 'string' } })
        t.strictSame(
          resultAsc.hits.map(d => d.id),
          ascExpected,
        )
        resultDesc = await search(db, { sortBy: { property: 'string', order: 'DESC' } })
        t.strictSame(
          resultDesc.hits.map(d => d.id),
          descExpected,
        )
      }

      t.end()
    })

    t.end()
  })

  t.test('on boolean', async t => {
    const db = await create({
      schema: {
        boolean: 'boolean',
      },
    })
    const [id1, id2, id3, id4, id5, id6] = await insertMultiple(db, [
      { boolean: true },
      { boolean: false },
      { boolean: false },
      { boolean: true },
      { boolean: true },
      {},
    ])

    t.test('should sort correctly - asc', async t => {
      const result = await search(db, {
        sortBy: {
          property: 'boolean',
        },
      })
      t.strictSame(
        result.hits.map(d => d.id),
        [id2, id3, id5, id4, id1, id6],
      )
      t.end()
    })

    t.test('should sort correctly - desc', async t => {
      const result = await search(db, {
        sortBy: {
          property: 'boolean',
          order: 'DESC',
        },
      })
      t.strictSame(
        result.hits.map(d => d.id),
        [id1, id4, id5, id3, id2, id6],
      )
      t.end()
    })

    t.test('should work correctly also after removal', async t => {
      const db = await create({
        schema: {
          boolean: 'boolean',
        },
      })
      const [id1, id2, id3, id4, id5, id6] = await insertMultiple(db, [
        { boolean: true },
        { boolean: false },
        { boolean: false },
        { boolean: true },
        { boolean: true },
        {},
      ])
      let ascExpected = [id2, id3, id5, id4, id1, id6]
      let descExpected = [id1, id4, id5, id3, id2, id6]

      let resultAsc = await search(db, { sortBy: { property: 'boolean' } })
      t.strictSame(
        resultAsc.hits.map(d => d.id),
        ascExpected,
      )
      let resultDesc = await search(db, { sortBy: { property: 'boolean', order: 'DESC' } })
      t.strictSame(
        resultDesc.hits.map(d => d.id),
        descExpected,
      )

      const elementToRemove = [id2, id1, id4, id3, id5, id6]
      for (const idToRemove of elementToRemove) {
        await remove(db, idToRemove)
        descExpected = descExpected.filter(id => id !== idToRemove)
        ascExpected = ascExpected.filter(id => id !== idToRemove)

        resultAsc = await search(db, { sortBy: { property: 'boolean' } })
        t.strictSame(
          resultAsc.hits.map(d => d.id),
          ascExpected,
        )
        resultDesc = await search(db, { sortBy: { property: 'boolean', order: 'DESC' } })
        t.strictSame(
          resultDesc.hits.map(d => d.id),
          descExpected,
        )
      }

      t.end()
    })

    t.end()
  })

  t.test('on nested property', async t => {
    const db = await create({
      schema: {
        obj: {
          number: 'number',
        },
      },
    })
    const [id1, id2, id3, id4, id5, id6, id7] = await insertMultiple(db, [
      { obj: { number: 5 } },
      { obj: { number: 2 } },
      { obj: { number: 7 } },
      { obj: { number: 10 } },
      { obj: { number: -3 } },
      { obj: {} },
      {},
    ])

    t.test('should sort correctly - asc', async t => {
      const result = await search(db, {
        sortBy: {
          property: 'obj.number',
        },
      })

      t.strictSame(
        result.hits.map(d => d.id),
        [id5, id2, id1, id3, id4, id6, id7],
      )

      const result2 = await search(db, {
        sortBy: {
          property: 'obj.number',
          order: 'ASC',
        },
      })

      t.strictSame(
        result2.hits.map(d => d.id),
        [id5, id2, id1, id3, id4, id6, id7],
      )

      t.end()
    })

    t.test('should sort correctly - desc', async t => {
      const result = await search(db, {
        sortBy: {
          property: 'obj.number',
          order: 'DESC',
        },
      })

      t.strictSame(
        result.hits.map(d => d.id),
        [id4, id3, id1, id2, id5, id6, id7],
      )

      t.end()
    })

    t.end()
  })

  t.test('should throw if `sortBy` is unknown', async t => {
    const db = await create({
      schema: {
        number: 'number',
      },
    })
    await t.rejects(search(db, { sortBy: { property: 'foobar' } }))

    t.end()
  })

  t.test('should throw if `sortBy` is ignored', async t => {
    const db = await create({
      schema: {
        number: 'number',
      },
      sort: {
        unsortableProperties: ['number'],
      },
    })
    await t.rejects(search(db, { sortBy: { property: 'number' } }))

    t.end()
  })

  t.test('should allow custom function', async t => {
    interface Doc {
      string?: string
    }
    const db = await create({
      schema: {
        string: 'string',
      },
    })
    const [id1, id2, id3, id4, id5, id6] = await insertMultiple(db, [
      { string: 'a' },
      { string: 'e' },
      { string: 'z' },
      { string: 'd' },
      { string: 'f' },
      {},
    ])

    const result = await search(db, {
      sortBy: (a: CustomSorterFunctionItem, b: CustomSorterFunctionItem) => {
        return ((a[2] as unknown as Doc).string || '').localeCompare((b[2] as unknown as Doc).string || '')
      },
    })

    t.strictSame(
      result.hits.map(d => d.id),
      [id6, id1, id4, id2, id5, id3],
    )

    t.end()
  })

  t.end()
})

t.test('serialize work fine', async t => {
  const db = await create({
    schema: {
      title: 'string',
      year: 'number',
      isTop: 'boolean',
      meta: {
        tag: 'string',
        rating: 'number',
        favorite: 'boolean',
      },
    },
  })
  const id = await insert(db, {
    title: 'The title',
    year: 2000,
    isTop: true,
    meta: {
      tag: 'tag',
      rating: 5,
      favorite: true,
    },
  })
  const raw = await save(db)

  const db2 = await create({
    schema: {
      title: 'string',
      year: 'number',
      isTop: 'boolean',
      meta: {
        tag: 'string',
        rating: 'number',
        favorite: 'boolean',
      },
    },
  })
  await t.resolves(load(db2, raw))

  const r = await search(db2, { sortBy: { property: 'title' } })

  t.strictSame(
    r.hits.map(d => d.id),
    [id],
  )

  t.end()
})

t.test('disabled', async t => {
  const db = await create({
    schema: {
      number: 'number',
    },
    sort: {
      enabled: false,
    },
  })
  const id = await insert(db, { number: 1 })
  await t.rejects(search(db, { sortBy: { property: 'number' } }), {
    code: 'SORT_DISABLED',
  })
  await remove(db, id)
  const raw = await save(db)

  t.strictSame(raw.sorting as { enabled: boolean }, { enabled: false })

  const db2 = await create({
    schema: {
      number: 'number',
    },
    sort: {
      enabled: false,
    },
  })

  await load(db2, raw)

  const id2 = await insert(db2, { number: 1 })
  await t.rejects(search(db2, { sortBy: { property: 'number' } }), {
    code: 'SORT_DISABLED',
  })
  await remove(db2, id2)
  const raw2 = await save(db2)

  t.equal((raw2.sorting as { enabled: boolean }).enabled, false)

  t.end()
})

t.only('search wth sortBy should be consistent ignoring the insert order', async t => {
  const docs = [
    { id: '5' },
    { id: '2', number: 5 },
    { id: '4', number: 10 },
    { id: '0', number: -3 },
    { id: '1', number: 2 },
    { id: '3', number: 7 },
  ]

  let iters = 10
  while (iters--) {
    const db = await create({
      schema: {
        id: 'string',
        number: 'number',
      },
    })

    const d = shuffle([...docs])

    await insertMultiple(db, d)
    const result = await search(db, {
      sortBy: {
        property: 'number',
      },
    })

    t.strictSame(
      result.hits.map(d => d.id),
      ['0', '1', '2', '3', '4', '5'],
    )
  }

  iters = 10
  while (iters--) {
    const db = await create({
      schema: {
        id: 'string',
        number: 'number',
      },
    })

    const d = shuffle([...docs])

    await insertMultiple(db, d)
    const result = await search(db, {
      sortBy: {
        property: 'number',
        order: 'DESC',
      },
    })

    t.strictSame(
      result.hits.map(d => d.id),
      ['4', '3', '2', '1', '0', '5'],
    )
  }

  t.end()
})

function shuffle(array) {
  let currentIndex = array.length,
    randomIndex

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--

    // And swap it with the current element.
    ;[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]]
  }

  return array
}
