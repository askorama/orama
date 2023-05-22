import t from 'tap'
import { create, insert, insertMultiple, remove, search } from '../src/index.js'

t.test('search with sortByKey', t => {
  t.test('on number', async t => {
    const db = await create({
      schema: {
        number: 'number'
      },
      sortSchema: {
        number: 'number'
      }
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
        schema: { number: 'number' },
        sortSchema: { number: 'number' }
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
      sortSchema: {
        string: 'string'
      }
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
        sortSchema: {
          string: 'string'
        }
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

  t.test('on boolean', async t => {
    const db = await create({
      schema: {
        boolean: 'boolean'
      },
      sortSchema: {
        boolean: 'boolean'
      }
    })
    const [id1, id2, id3, id4, id5, id6] = await insertMultiple(db, [
      { boolean: true },
      { boolean: false },
      { boolean: false },
      { boolean: true },
      { boolean: true },
      { }
    ])

    t.test('should sort correctly - asc', async t => {
      const result = await search(db, {
        sortBy: {
          property: 'boolean'
        }
      })
      t.strictSame(result.hits.map(d => d.id), [
        id2, id3, id5, id4, id1, id6
      ])
      t.end()
    })

    t.test('should sort correctly - desc', async t => {
      const result = await search(db, {
        sortBy: {
          property: 'boolean',
          order: 'DESC'
        }
      })
      t.strictSame(result.hits.map(d => d.id), [
        id1, id4,id5, id3, id2, id6
      ])
      t.end()
    })

    t.test('should work correctly also after removal', async t => {
      const db = await create({
        schema: {
          boolean: 'boolean'
        },
        sortSchema: {
          boolean: 'boolean'
        }
      })
      const [id1, id2, id3, id4, id5, id6] = await insertMultiple(db, [
        { boolean: true },
        { boolean: false },
        { boolean: false },
        { boolean: true },
        { boolean: true },
        { }
      ])
      let ascExpected = [ id2, id3, id5, id4, id1, id6 ]
      let descExpected = [ id1, id4,id5, id3, id2, id6 ]

      let resultAsc = await search(db, { sortBy: { property: 'boolean' } })
      t.strictSame(resultAsc.hits.map(d => d.id), ascExpected)
      let resultDesc = await search(db, { sortBy: { property: 'boolean', order: 'DESC' } })
      t.strictSame(resultDesc.hits.map(d => d.id), descExpected)

      const elementToRemove = [id2, id1, id4, id3, id5, id6]
      for (const idToRemove of elementToRemove) {
        await remove(db, idToRemove)
        descExpected = descExpected.filter(id => id !== idToRemove)
        ascExpected = ascExpected.filter(id => id !== idToRemove)

        resultAsc = await search(db, { sortBy: { property: 'boolean' } })
        t.strictSame(resultAsc.hits.map(d => d.id), ascExpected)
        resultDesc = await search(db, { sortBy: { property: 'boolean', order: 'DESC' } })
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
      sortSchema: {
        obj: {
          number: 'number'
        }
      }
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
    const order: string[] = []
    const db = await create({
      schema: {
        number: 'number'
      },
      sortSchema: {
        number: 'number'
      },
      components: {
        sort: {
          async sortBy(sort, docIds) {
            order.push('sortBy')
            return docIds
          },
          async create() {
            order.push('create')
            return {
            }
          },
          async insert() {
            order.push('insert')
            return
          },
          async remove() {
            order.push('remove')
            return
          },
          getSortableProperties() {
            return ['number']
          },
          getSortablePropertiesWithTypes() {
            return {
              number: 'number'
            }
          },
        }
      }
    })
    const id = await insert(db, { number: 1 })
    await search(db, { sortBy: { property: 'number' } })
    await remove(db, id)
    
    t.strictSame(order, [
      'create', 'insert', 'sortBy', 'remove'
    ])

    t.end()
  })

  t.test('should throw if `sortByKey` is unknown', async t => {
    const db = await create({
      schema: {
        number: 'number'
      },
    })
    await t.rejects(search(db, { sortBy: { property: 'number' } }))

    t.end()
  })

  t.end()
})