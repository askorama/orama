import t from 'tap'
import { Orama, create, insert, insertMultiple, load, remove, save, search } from '../src/index.js'
import { sort as defaultSort } from '../src/components.js'
import { DefaultSort, Sort } from '../src/components/sort.js'

t.test('search with sortBy', t => {
  t.test('on number', async t => {
    const db = await create({
      schema: {
        number: 'number'
      },
    })
    const [id1, id2, id3, id4, id5, id6] = await insertMultiple(db, [
      { number: 5 },
      { number: 2 },
      { number: 7 },
      { number: 10 },
      { number: -3 },
      { }
    ])

    t.test('should sort correctly - asc', async t => {
      const result = await search(db, {
        sortBy: {
          property: 'number'
        }
      })

      t.strictSame(result.hits.map(d => d.id), [
        id5, id2, id1, id3, id4, id6
      ])

      const result2 = await search(db, {
        sortBy: {
          property: 'number',
          order: 'ASC',
        }
      })

      t.strictSame(result2.hits.map(d => d.id), [
        id5, id2, id1, id3, id4, id6
      ])

      t.end()
    })

    t.test('should sort correctly - desc', async t => {
      const result = await search(db, {
        sortBy: {
          property: 'number',
          order: 'DESC'
        }
      })

      t.strictSame(result.hits.map(d => d.id), [
        id4, id3, id1, id2, id5, id6
      ])

      t.end()
    })

    t.test('should work correctly also after removal', async t => {
      const db = await create({
        schema: { number: 'number' }
      })
      const [id1, id2, id3, id4, id5, id6] = await insertMultiple(db, [
        { number: 5 },
        { number: 2 },
        { number: 7 },
        { number: 10 },
        { number: -3 },
        { }
      ])
      let ascExpected = [ id5, id2, id1, id3, id4, id6 ]
      let descExpected = [ id4, id3, id1, id2, id5, id6 ]

      let resultAsc = await search(db, { sortBy: { property: 'number' } })
      t.strictSame(resultAsc.hits.map(d => d.id), ascExpected)
      let resultDesc = await search(db, { sortBy: { property: 'number', order: 'DESC' } })
      t.strictSame(resultDesc.hits.map(d => d.id), descExpected)

      const elementToRemove = [id2, id1, id4, id3, id5, id6]
      for (const idToRemove of elementToRemove) {
        await remove(db, idToRemove)
        descExpected = descExpected.filter(id => id !== idToRemove)
        ascExpected = ascExpected.filter(id => id !== idToRemove)

        resultAsc = await search(db, { sortBy: { property: 'number' } })
        t.strictSame(resultAsc.hits.map(d => d.id), ascExpected)
        resultDesc = await search(db, { sortBy: { property: 'number', order: 'DESC' } })
        t.strictSame(resultDesc.hits.map(d => d.id), descExpected)
      }

      t.end()
    })

    t.end()
  })

  t.test('on string', async t => {
    const db = await create({
      schema: {
        string: 'string'
      },
    })
    const [id1, id2, id3, id4, id5, id6] = await insertMultiple(db, [
      { string: 'a' },
      { string: 'e' },
      { string: 'z' },
      { string: 'd' },
      { string: 'f' },
      { }
    ])

    t.test('should sort correctly - asc', async t => {
      const result = await search(db, {
        sortBy: {
          property: 'string'
        }
      })
      t.strictSame(result.hits.map(d => d.id), [
        id1, id4, id2, id5, id3, id6
      ])
      t.end()
    })

    t.test('should sort correctly - desc', async t => {
      const result = await search(db, {
        sortBy: {
          property: 'string',
          order: 'DESC'
        }
      })
      t.strictSame(result.hits.map(d => d.id), [
        id3, id5, id2, id4, id1, id6
      ])
      t.end()
    })

    t.test('should work correctly also after removal', async t => {
      const db = await create({
        schema: {
          string: 'string'
        },
      })
      const [id1, id2, id3, id4, id5, id6] = await insertMultiple(db, [
        { string: 'a' },
        { string: 'e' },
        { string: 'z' },
        { string: 'd' },
        { string: 'f' },
        { }
      ])
      let ascExpected = [ id1, id4, id2, id5, id3, id6 ]
      let descExpected = [ id3, id5, id2, id4, id1, id6 ]

      let resultAsc = await search(db, { sortBy: { property: 'string' } })
      t.strictSame(resultAsc.hits.map(d => d.id), ascExpected)
      let resultDesc = await search(db, { sortBy: { property: 'string', order: 'DESC' } })
      t.strictSame(resultDesc.hits.map(d => d.id), descExpected)

      const elementToRemove = [id2, id1, id4, id3, id5, id6]
      for (const idToRemove of elementToRemove) {
        await remove(db, idToRemove)
        descExpected = descExpected.filter(id => id !== idToRemove)
        ascExpected = ascExpected.filter(id => id !== idToRemove)

        resultAsc = await search(db, { sortBy: { property: 'string' } })
        t.strictSame(resultAsc.hits.map(d => d.id), ascExpected)
        resultDesc = await search(db, { sortBy: { property: 'string', order: 'DESC' } })
        t.strictSame(resultDesc.hits.map(d => d.id), descExpected)
      }

      t.end()
    })

    t.end()
  })

  t.test('on nested property', async t => {
    const db = await create({
      schema: {
        obj: {
          number: 'number'
        }
      },
    })
    const [id1, id2, id3, id4, id5, id6, id7] = await insertMultiple(db, [
      { obj: { number: 5 } },
      { obj: { number: 2 } },
      { obj: { number: 7 } },
      { obj: { number: 10 } },
      { obj: { number: -3 } },
      { obj: {} },
      { }
    ])

    t.test('should sort correctly - asc', async t => {
      const result = await search(db, {
        sortBy: {
          property: 'obj.number'
        }
      })

      t.strictSame(result.hits.map(d => d.id), [
        id5, id2, id1, id3, id4, id7, id6
      ])

      const result2 = await search(db, {
        sortBy: {
          property: 'obj.number',
          order: 'ASC',
        }
      })

      t.strictSame(result2.hits.map(d => d.id), [
        id5, id2, id1, id3, id4, id7, id6
      ])

      t.end()
    })

    t.test('should sort correctly - desc', async t => {
      const result = await search(db, {
        sortBy: {
          property: 'obj.number',
          order: 'DESC'
        }
      })

      t.strictSame(result.hits.map(d => d.id), [
        id4, id3, id1, id2, id5, id7, id6
      ])

      t.end()
    })

    t.end()
  })

  t.test('should allow custom component', async t => {
    const s = await defaultSort.createSort() as DefaultSort
    const order: string[] = []
    const db = await create({
      schema: {
        number: 'number'
      },
      components: {
        sort: {
          async sortBy(sort, docIds, by) {
            order.push('sortBy')
            return s.sortBy(sort as Sort, docIds, by)
          },
          async create(orama, schema, config) {
            order.push('create')
            return s.create(orama as unknown as Orama<{ Sort: Sort}>, schema, config)
          },
          async insert(sort, prop, id, value, schemaType, language) {
            order.push('insert')
            return s.insert(sort as Sort, prop, id, value, schemaType, language)
          },
          async remove(sort, prop, id) {
            order.push('remove')
            return s.remove(sort as Sort, prop, id)
          },
          async load(raw) {
            order.push('load')
            return s.load(raw)
          },
          async save(sort) {
            order.push('save')
            return s.save(sort as Sort)
          },
          getSortableProperties(sort) {
            return s.getSortableProperties(sort as Sort)
          },
          getSortablePropertiesWithTypes(sort) {
            return s.getSortablePropertiesWithTypes(sort as Sort)
          },
        }
      }
    })
    const id = await insert(db, { number: 1 })
    await search(db, { sortBy: { property: 'number' } })
    await remove(db, id)
    const raw = await save(db)
    await load(db, raw)
    
    t.strictSame(order, [
      'create', 'insert', 'sortBy', 'remove', 'save', 'load'
    ])

    t.end()
  })

  t.test('should throw if `sortBy` is unknown', async t => {
    const db = await create({
      schema: {
        number: 'number'
      },
    })
    await t.rejects(search(db, { sortBy: { property: 'foobar' } }))

    t.end()
  })

  t.test('should throw if `sortBy` is ignored', async t => {
    const db = await create({
      schema: {
        number: 'number'
      },
      sort: {
        deniedProperties: ['number'],
      }
    })
    await t.rejects(search(db, { sortBy: { property: 'number' } }))

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
    }
  })
  const id = await insert(db, {
    title: 'The title',
    year: 2000,
    isTop: true,
    meta: {
      tag: 'tag',
      rating: 5,
      favorite: true
    }
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
    }
  })
  await t.resolves(load(db2, raw))

  const r = await search(db2, { sortBy: { property: 'title' } })

  t.strictSame(r.hits.map(d => d.id), [id])

  t.end()
})
