import t from 'tap'
import { DocumentsStore } from '../src/components/documents-store.js'
import { Index } from '../src/components/index.js'
import { getInternalDocumentId } from '../src/components/internal-document-id-store.js'
import { Document, create, insert, insertMultiple, search } from '../src/index.js'
import dataset from './datasets/events.json' assert { type: 'json' }

t.test('insert method', t => {
  t.test('should correctly insert and retrieve data', async t => {
    t.plan(4)

    const db = await create({
      schema: {
        example: 'string',
      },
    })

    const ex1Insert = await insert(db, { example: 'The quick, brown, fox' })
    const ex1Search = await search(db, {
      term: 'quick',
      properties: ['example'],
    })
    t.ok(ex1Insert)
    t.equal(ex1Search.count, 1)
    t.type(ex1Search.elapsed.raw, 'number')
    t.equal(ex1Search.hits[0].document.example, 'The quick, brown, fox')
  })

  t.test('should be able to insert documens with non-searchable fields', async t => {
    t.plan(2)

    const db = await create({
      schema: {
        quote: 'string',
        author: 'string',
        isFavorite: 'boolean',
        rating: 'number',
      },
    })

    await insert(db, {
      quote: 'Be yourself; everyone else is already taken.',
      author: 'Oscar Wilde',
      isFavorite: false,
      rating: 4,
    })

    await insert(db, {
      quote: 'So many books, so little time.',
      author: 'Frank Zappa',
      isFavorite: true,
      rating: 5,
    })

    const searchResult = await search(db, {
      term: 'frank',
    })

    t.equal(searchResult.count, 1)
    t.equal(searchResult.hits[0].document.author, 'Frank Zappa')
  })

  t.test("should use the 'id' field found in the document as index id", async t => {
    t.plan(2)

    const db = await create({
      schema: {
        id: 'string',
        name: 'string',
      },
    })

    const i1 = await insert(db, {
      id: 'john-01',
      name: 'John',
    })

    const i2 = await insert(db, {
      id: 'doe-02',
      name: 'Doe',
    })

    t.equal(i1, 'john-01')
    t.equal(i2, 'doe-02')
  })

  t.test("should use the custom 'id' function passed in the configuration object", async t => {
    t.plan(2)

    const db = await create({
      schema: {
        id: 'string',
        name: 'string',
      },
      components: {
        getDocumentIndexId(doc: { name: string }): string {
          return `${doc.name.toLowerCase()}-foo-bar-baz`
        },
      },
    })

    const i1 = await insert(db, {
      id: 'john-01',
      name: 'John',
    })

    const i2 = await insert(db, {
      id: 'doe-02',
      name: 'Doe',
    })

    t.equal(i1, 'john-foo-bar-baz')
    t.equal(i2, 'doe-foo-bar-baz')
  })

  t.test("should throw an error if the 'id' field is not a string", async t => {
    t.plan(1)

    const db = await create({
      schema: {
        name: 'string',
      },
    })

    await t.rejects(
      () =>
        insert(db, {
          id: 123,
          name: 'John',
        }),
      {
        code: 'DOCUMENT_ID_MUST_BE_STRING',
      },
    )
  })

  t.test("should throw an error if the 'id' field is already taken", async t => {
    t.plan(1)

    const db = await create({
      schema: {
        id: 'string',
        name: 'string',
      },
    })

    await insert(db, {
      id: 'john-01',
      name: 'John',
    })

    await t.rejects(
      () =>
        insert(db, {
          id: 'john-01',
          name: 'John',
        }),
      { code: 'DOCUMENT_ALREADY_EXISTS' },
    )
  })

  t.test('should use the ID field as index id even if not specified in the schema', async t => {
    t.plan(1)

    const db = await create({
      schema: {
        name: 'string',
      },
    })

    const i1 = await insert(db, {
      id: 'john-01',
      name: 'John',
    })

    t.equal(i1, 'john-01')
  })

  t.test('should allow doc with missing schema keys to be inserted without indexing those keys', async t => {
    t.plan(6)

    const db = await create({
      schema: {
        quote: 'string',
        author: 'string',
      },
    })
    await insert(db, {
      quote: 'hello, world!',
      author: 'author should be singular',
    })

    t.equal(Object.keys(db.data.docs.docs).length, 1)

    const docWithExtraKey = { quote: 'hello, world!', author: '3', foo: { bar: 10 } }

    const insertedInfo = await insert(db, docWithExtraKey)

    t.ok(insertedInfo)
    t.equal(Object.keys(db.data.docs.docs).length, 2)

    t.ok(
      'foo' in db.data.docs.docs[getInternalDocumentId(db.internalDocumentIDStore, insertedInfo)]!,
    )
    t.same(
      docWithExtraKey.foo,
      db.data.docs.docs[getInternalDocumentId(db.internalDocumentIDStore, insertedInfo)]!.foo,
    )
    t.notOk('foo' in (db.data.index as unknown as Index).indexes)
  })

  t.test(
    'should allow doc with missing schema keys to be inserted without indexing those keys - nested schema version',
    async t => {
      t.plan(6)
      const db = await create({
        schema: {
          quote: 'string',
          author: {
            name: 'string',
            surname: 'string',
          },
          tag: {
            name: 'string',
            description: 'string',
          },
          isFavorite: 'boolean',
          rating: 'number',
        },
      })
      const nestedExtraKeyDoc = {
        quote: 'So many books, so little time.',
        author: {
          name: 'Frank',
          surname: 'Zappa',
        },
        tag: {
          name: 'books',
          description: 'Quotes about books',
          unexpectedNestedProperty: 'amazing',
        },
        isFavorite: false,
        rating: 5,
        unexpectedProperty: 'wow',
      }
      const insertedInfo = await insert(db, nestedExtraKeyDoc)

      t.ok(insertedInfo)
      t.equal(Object.keys((db.data.docs as DocumentsStore).docs).length, 1)

      t.same(
        nestedExtraKeyDoc.unexpectedProperty,
        (db.data.docs as DocumentsStore).docs[getInternalDocumentId(db.internalDocumentIDStore, insertedInfo)]!
          .unexpectedProperty,
      )

      t.same(
        nestedExtraKeyDoc.tag.unexpectedNestedProperty,
        (
          (db.data.docs as DocumentsStore).docs[getInternalDocumentId(db.internalDocumentIDStore, insertedInfo)]!
            .tag as unknown as Record<string, string>
        ).unexpectedNestedProperty,
      )

      t.notOk('unexpectedProperty' in (db.data.index as Index).indexes)
      t.notOk('tag.unexpectedProperty' in (db.data.index as Index).indexes)
    },
  )

  t.test('should validate', t => {
    t.test('the properties are not mandatory', async t => {
      const db = await create({
        schema: {
          id: 'string',
          name: 'string',
          inner: {
            name: 'string',
          },
        },
      })

      await t.resolves(insert(db, {}))
      await t.resolves(insert(db, { id: 'foo' }))
      await t.resolves(insert(db, { name: 'bar' }))
      await t.resolves(insert(db, { inner: {} }))

      t.end()
    })

    t.test('invalid document', async t => {
      const db = await create({
        schema: {
          string: 'string',
          number: 'number',
          boolean: 'boolean',
          inner: {
            string: 'string',
            number: 'number',
            boolean: 'boolean',
          },
        },
      })

      const invalidDocuments: Array<object> = [
        { string: null },
        { string: 42 },
        { string: true },
        { string: false },
        { string: {} },
        { string: [] },
        { number: null },
        { number: '' },
        { number: true },
        { number: false },
        { number: {} },
        { number: [] },
        { boolean: null },
        { boolean: 42 },
        { boolean: '' },
        { boolean: {} },
        { boolean: [] },
      ]
      invalidDocuments.push(...invalidDocuments.map(d => ({ inner: { ...d } })))
      for (const doc of invalidDocuments) {
        await t.rejects(insert(db, doc as Document))
      }

      t.end()
    })

    t.end()
  })

  t.end()
})

t.test('insert short prefixes, as in #327 and #328', t => {
  t.plan(2)

  t.test('example 1', async t => {
    t.plan(8)

    const db = await create({
      schema: {
        id: 'string',
        abbrv: 'string',
        type: 'string',
      },
    })

    await insertMultiple(db, [
      {
        id: '1',
        abbrv: 'RDGE',
        type: 'Ridge',
      },
      {
        id: '2',
        abbrv: 'RD',
        type: 'Road',
      },
    ])

    const exactResults = await search(db, {
      term: 'RD',
      exact: true,
    })

    const prefixResults = await search(db, {
      term: 'RD',
      exact: false,
    })

    t.same(exactResults.count, 1)
    t.same(exactResults.hits[0].id, '2')
    t.same(exactResults.hits[0].document.abbrv, 'RD')

    t.same(prefixResults.count, 2)
    t.same(prefixResults.hits[0].id, '2')
    t.same(prefixResults.hits[0].document.abbrv, 'RD')
    t.same(prefixResults.hits[1].id, '1')
    t.same(prefixResults.hits[1].document.abbrv, 'RDGE')
  })

  t.test('example 2', async t => {
    t.plan(5)

    const db = await create({
      schema: {
        id: 'string',
        quote: 'string',
      },
    })

    await insertMultiple(db, [
      { id: '1', quote: 'AB' },
      { id: '2', quote: 'ABCDEF' },
      { id: '3', quote: 'CDEF' },
      { id: '4', quote: 'AB' },
    ])

    const exactResults = await search(db, {
      term: 'AB',
      exact: true,
    })

    t.same(exactResults.count, 2)
    t.same(exactResults.hits[0].id, '1')
    t.same(exactResults.hits[0].document.quote, 'AB')
    t.same(exactResults.hits[1].id, '4')
    t.same(exactResults.hits[1].document.quote, 'AB')
  })
})

t.test('insertMultiple method', t => {
  t.test("should use the custom 'id' function passed in the configuration object", async t => {
    const db = await create({
      schema: {
        id: 'string',
        name: 'string',
      },
      components: {
        getDocumentIndexId(doc: { id: string; name: string }): string {
          return `${doc.name.toLowerCase()}-${doc.id}`
        },
      },
    })

    const ids = await insertMultiple(db, [
      { id: '01', name: 'John' },
      { id: '02', name: 'Doe' },
    ])

    t.strictSame(ids, ['john-01', 'doe-02'])

    t.end()
  })

  t.test("should use the 'id' field as index id if found in the document", async t => {
    const db = await create({
      schema: {
        name: 'string',
      },
    })

    const ids = await insertMultiple(db, [{ name: 'John' }, { id: '02', name: 'Doe' }])

    t.ok(ids.includes('02'))

    t.end()
  })

  t.test('should support batch insert of documents', async t => {
    t.plan(2)

    const db = await create({
      schema: {
        date: 'string',
        description: 'string',
        lang: 'string',
        category1: 'string',
        category2: 'string',
        granularity: 'string',
      },
    })

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const docs = (dataset as DataSet).result.events.slice(0, 4000)
    const wrongSchemaDocs: WrongDataEvent[] = docs.map(doc => ({ ...doc, date: +new Date() }))

    try {
      await insertMultiple(db, docs)
      t.equal(Object.keys((db.data.docs as DocumentsStore).docs).length, 4000)

      // eslint-disable-next-line no-empty
    } catch (_e) {}

    await t.rejects(() => insertMultiple(db, wrongSchemaDocs as unknown as DataEvent[]))
  })

  t.end()
})

interface BaseDataEvent extends Document {
  description: string
  lang: string
  category1: string
  category2: string
  granularity: string
}

interface DataEvent extends BaseDataEvent {
  date: string
}

interface WrongDataEvent extends BaseDataEvent {
  date: number
}

interface DataSet {
  result: { events: DataEvent[] }
}
