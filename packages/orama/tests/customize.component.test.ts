import t from 'tap'
import { ISorter, OpaqueSorter, Orama, create, insert, load, remove, save, search } from '../src/index.js'
import {
  internalDocumentIDStore as defaultInternalDocumentIDStore,
  sorter as defaultSorter,
  documentsStore as defaultDocumentsStore,
  index as defaultIndex,
} from '../src/components.js'
import { DefaultSorter, Sorter } from '../src/components/sorter.js'

t.test('index', t => {
  t.test('should allow custom component', async t => {
    const internalDocumentIdStore = defaultInternalDocumentIDStore.createInternalDocumentIDStore()
    const index = await defaultIndex.createIndex(internalDocumentIdStore)
    const db = await create({
      schema: {
        number: 'number',
      },
      components: {
        index: {
          ...index,
          remove(impl, i, prop, id, value, schemaType, language, tokenizer, docsCount) {
            return index.remove(impl, i, prop, id, value, schemaType, language, tokenizer, docsCount)
          },
        },
      },
    })
    const id = await insert(db, { number: 1 })
    await search(db, { sortBy: { property: 'number' } })
    await remove(db, id)
    const raw = await save(db)
    await load(db, raw)

    t.end()
  })

  t.end()
})

t.test('documentStore', t => {
  t.test('should allow custom component', async t => {
    const internalDocumentIdStore = defaultInternalDocumentIDStore.createInternalDocumentIDStore()
    const store = await defaultDocumentsStore.createDocumentsStore(internalDocumentIdStore)
    const db = await create({
      schema: {
        number: 'number',
      },
      components: {
        documentsStore: {
          count(s) {
            return store.count(s)
          },
          get(s, id) {
            return store.get(s, id)
          },
          create(s) {
            return store.create(s)
          },
          remove(s, id) {
            return store.remove(s, id)
          },
          save(s) {
            return store.save(s)
          },
          load(s) {
            return store.load(s)
          },
          getMultiple(s, ids) {
            return store.getMultiple(s, ids)
          },
          getAll(s) {
            return store.getAll(s)
          },
          store(s, id, doc) {
            return store.store(s, id, doc)
          },
        },
      },
    })
    const id = await insert(db, { number: 1 })
    await search(db, { sortBy: { property: 'number' } })
    await remove(db, id)
    const raw = await save(db)
    await load(db, raw)

    t.end()
  })

  t.test('should allow custom component - partially', async t => {
    const internalDocumentIdStore = defaultInternalDocumentIDStore.createInternalDocumentIDStore()
    const store = await defaultDocumentsStore.createDocumentsStore(internalDocumentIdStore)
    const db = await create({
      schema: {
        number: 'number',
      },
      components: {
        documentsStore: {
          ...store,
          remove(s, id) {
            return store.remove(s, id)
          },
        },
      },
    })
    const id = await insert(db, { number: 1 })
    await search(db, { sortBy: { property: 'number' } })
    await remove(db, id)
    const raw = await save(db)
    await load(db, raw)

    t.end()
  })

  t.end()
})

t.test('sorter', t => {
  t.test('should allow custom component', async t => {
    const internalDocumentIdStore = defaultInternalDocumentIDStore.createInternalDocumentIDStore()
    const s = await defaultSorter.createSorter(internalDocumentIdStore)
    const order: string[] = []
    const db = await create({
      schema: {
        number: 'number',
      },
      components: {
        sorter: {
          async sortBy(sort, docIds, by) {
            order.push('sortBy')
            return s.sortBy(sort, docIds, by)
          },
          async create(schema, config) {
            order.push('create')
            return s.create(schema, config)
          },
          async insert(sort, prop, id, value, schemaType, language) {
            order.push('insert')
            return s.insert(sort, prop, id, value, schemaType, language)
          },
          async remove(sort, prop, id) {
            order.push('remove')
            return s.remove(sort, prop, id)
          },
          async load(raw) {
            order.push('load')
            return s.load(raw)
          },
          async save(sort) {
            order.push('save')
            return s.save(sort)
          },
          getSortableProperties(sort) {
            return s.getSortableProperties(sort)
          },
          getSortablePropertiesWithTypes(sort) {
            return s.getSortablePropertiesWithTypes(sort)
          },
        },
      },
    })
    const id = await insert(db, { number: 1 })
    await search(db, { sortBy: { property: 'number' } })
    await remove(db, id)
    const raw = await save(db)
    await load(db, raw)

    t.strictSame(order, ['create', 'insert', 'sortBy', 'remove', 'save', 'load'])

    t.end()
  })

  t.test('should allow custom component - partially', async t => {
    const internalDocumentIdStore = defaultInternalDocumentIDStore.createInternalDocumentIDStore()
    const s = await defaultSorter.createSorter(internalDocumentIdStore)
    const order: string[] = []
    const db = await create({
      schema: {
        number: 'number',
      },
      components: {
        sorter: {
          ...s,
          async remove(sort, prop, id) {
            order.push('remove')
            return s.remove(sort, prop, id)
          },
        },
      },
    })
    const id = await insert(db, { number: 1 })
    await search(db, { sortBy: { property: 'number' } })
    await remove(db, id)
    const raw = await save(db)
    await load(db, raw)

    t.strictSame(order, ['remove'])

    t.end()
  })

  t.test('should allow custom component - partial type definition', async t => {
    interface SorterStorage extends OpaqueSorter {
      storage: Sorter
    }
    class MyCustomSorter implements ISorter<SorterStorage> {
      constructor(private sorter: DefaultSorter) {
        this.sorter = sorter
      }
      async sortBy(sort, docIds, by) {
        return this.sorter.sortBy(sort.storage, docIds, by)
      }
      async create(orama, schema, config) {
        return {
          storage: await this.sorter.create(orama, schema, config),
        }
      }
      async insert(sort: SorterStorage, prop, id, value, schemaType, language) {
        return this.sorter.insert(sort.storage, prop, id, value, schemaType, language)
      }
      async remove(sort: SorterStorage, prop, id) {
        return this.sorter.remove(sort.storage, prop, id)
      }
      async load(raw) {
        return {
          storage: await this.sorter.load(raw),
        }
      }
      async save<R = unknown>(sort) {
        return this.sorter.save(sort.storage) as R
      }
      getSortableProperties(sort) {
        return this.sorter.getSortableProperties(sort.storage)
      }
      getSortablePropertiesWithTypes(sort) {
        return this.sorter.getSortablePropertiesWithTypes(sort.storage)
      }
    }

    const internalDocumentIdStore = defaultInternalDocumentIDStore.createInternalDocumentIDStore()
    const db: Orama<{ Sorter: MyCustomSorter }> = await create({
      schema: {
        number: 'number',
      },
      components: {
        sorter: new MyCustomSorter(await defaultSorter.createSorter(internalDocumentIdStore)),
      },
    })
    const id = await insert(db, { number: 1 })
    await search(db, { sortBy: { property: 'number' } })
    await remove(db, id)
    const raw = await save(db)
    await load(db, raw)

    t.end()
  })

  t.end()
})
