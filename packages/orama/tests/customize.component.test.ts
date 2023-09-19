import t from 'tap'
import {
  documentsStore as defaultDocumentsStore,
  index as defaultIndex,
  sorter as defaultSorter,
} from '../src/components.js'
import { DocumentsStore } from '../src/components/documents-store.js'
import { DocumentID, InternalDocumentIDStore } from '../src/components/internal-document-id-store.js'
import { Sorter } from '../src/components/sorter.js'
import {
  AnyDocumentStore,
  AnyOrama,
  AnySorterStore,
  Document,
  IDocumentsStore,
  ISorter,
  SyncOrAsyncValue,
  create,
  insert,
  load,
  remove,
  save,
  search,
} from '../src/index.js'

t.test('index', t => {
  t.test('should allow custom component', async t => {
    const index = await defaultIndex.createIndex()
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
    const store = await defaultDocumentsStore.createDocumentsStore()
    const customDocumentStore: IDocumentsStore<DocumentsStore> = {
      count(s) {
        return store.count(s)
      },
      get(s, id) {
        return store.get(s, id)
      },
      create(o, internalDocumentIdStore) {
        return store.create(o, internalDocumentIdStore)
      },
      remove(s, id) {
        return store.remove(s, id)
      },
      save(s) {
        return store.save(s)
      },
      load(internalDocumentIdStore, raw) {
        return store.load(internalDocumentIdStore, raw)
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
    }
    const db = await create({
      schema: {
        number: 'number',
      },
      components: {
        documentsStore: customDocumentStore,
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
    const store = await defaultDocumentsStore.createDocumentsStore()
    const customDocumentStore: IDocumentsStore<DocumentsStore> = {
      ...store,
      remove(s, id) {
        return store.remove(s, id)
      },
    }
    const db = await create({
      schema: {
        number: 'number',
      },
      components: {
        documentsStore: customDocumentStore,
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
    const s = await defaultSorter.createSorter()
    const customSorter: ISorter<Sorter> = {
      async sortBy(sort, docIds, by) {
        order.push('sortBy')
        return s.sortBy(sort, docIds, by)
      },
      async create(orama, internalDocumentIdStore, schema, config) {
        order.push('create')
        return s.create(orama, internalDocumentIdStore, schema, config)
      },
      async insert(sort, prop, id, value, schemaType, language) {
        order.push('insert')
        return s.insert(sort, prop, id, value, schemaType, language)
      },
      async remove(sort, prop, id) {
        order.push('remove')
        return s.remove(sort, prop, id)
      },
      async load(internalDocumentIdStore, raw) {
        order.push('load')
        return s.load(internalDocumentIdStore, raw)
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
    }
    const order: string[] = []
    const db = await create({
      schema: {
        number: 'number',
      },
      components: {
        sorter: customSorter,
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
    const s = await defaultSorter.createSorter()
    const customSorter: ISorter<Sorter> = {
      ...s,
      async remove(sort, prop, id) {
        order.push('remove')
        return s.remove(sort, prop, id)
      },
    }
    const order: string[] = []
    const db = await create({
      schema: {
        number: 'number',
      },
      components: {
        sorter: customSorter,
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

  t.test('should allow custom sorter - partial type definition', async t => {
    interface SorterStorage extends AnySorterStore {
      storage: Sorter
    }
    class MyCustomSorter implements ISorter<SorterStorage> {
      constructor(private sorter: ISorter<Sorter>) {
        this.sorter = sorter
      }
      async sortBy(sort, docIds, by) {
        return this.sorter.sortBy(sort.storage, docIds, by)
      }
      async create(orama, internalDocumentIdStore, schema, config) {
        return {
          storage: await this.sorter.create(orama, internalDocumentIdStore, schema, config),
        }
      }
      async insert(sort, prop, id, value, schemaType, language) {
        return this.sorter.insert(sort.storage, prop, id, value, schemaType, language)
      }
      async remove(sort, prop, id) {
        return this.sorter.remove(sort.storage, prop, id)
      }
      async load(internalDocumentIdStore, raw) {
        return {
          storage: await this.sorter.load(internalDocumentIdStore, raw),
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

    const sorter: ISorter<SorterStorage> = new MyCustomSorter(await defaultSorter.createSorter())

    const db = await create({
      schema: {
        number: 'number',
      },
      components: {
        sorter: sorter,
      },
    })
    const id = await insert(db, { number: 1 })
    await search(db, { sortBy: { property: 'number' } })
    await remove(db, id)
    const raw = await save(db)
    await load(db, raw)

    t.end()
  })

  t.test('should allow custom document store - partial type definition', async t => {
    interface DocStorage extends AnyDocumentStore {
      storage: DocumentsStore
    }
    class MyCustomDoc implements IDocumentsStore<DocStorage> {
      constructor(private doc: IDocumentsStore<DocumentsStore>) {
        this.doc = doc
      }
      async create<T extends AnyOrama<any>>(
        orama: T,
        sharedInternalDocumentStore: InternalDocumentIDStore,
      ): Promise<DocStorage> {
        const originalDoc = await this.doc.create(orama, sharedInternalDocumentStore)
        return {
          storage: originalDoc,
          docs: originalDoc.docs,
        }
      }
      get(store: DocStorage, id: DocumentID) {
        return this.doc.get(store.storage, id)
      }
      getMultiple(store: DocStorage, ids: DocumentID[]): SyncOrAsyncValue<any[]> {
        return this.doc.getMultiple(store.storage, ids)
      }
      getAll(store: DocStorage): SyncOrAsyncValue<Record<number, any>> {
        return this.doc.getAll(store.storage)
      }
      store(store: DocStorage, id: DocumentID, doc: Document): SyncOrAsyncValue<boolean> {
        return this.doc.store(store.storage, id, doc)
      }
      remove(store: DocStorage, id: DocumentID): SyncOrAsyncValue<boolean> {
        return this.doc.remove(store.storage, id)
      }
      count(store: DocStorage): SyncOrAsyncValue<number> {
        return this.doc.count(store.storage)
      }
      async load<R = unknown>(sharedInternalDocumentStore: InternalDocumentIDStore, raw: R): Promise<DocStorage> {
        const originalDoc = await this.doc.load(sharedInternalDocumentStore, raw)

        return {
          storage: originalDoc,
          docs: originalDoc.docs,
        }
      }
      save<R = unknown>(store: DocStorage): SyncOrAsyncValue<R> {
        return this.doc.save(store.storage)
      }
    }

    const documentsStore = new MyCustomDoc(await defaultDocumentsStore.createDocumentsStore())

    const db = await create({
      schema: {
        number: 'number',
      },
      components: {
        documentsStore: documentsStore,
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
