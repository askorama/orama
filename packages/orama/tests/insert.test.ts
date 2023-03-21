import t from 'tap'
import { create } from '../src/methods/create.js'
import { insert, insertMultiple } from '../src/methods/insert.js'

t.test('insert', t => {
  t.plan(6)

  t.test("should use the 'id' field found in the document", async t => {
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
        id: 'string',
        name: 'string',
      },
    })

    await t.rejects(
      () =>
        insert(db, {
          id: 123,
          name: 'John',
        }),
      { code: 'DOCUMENT_ID_MUST_BE_STRING' },
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

  t.test('should take the ID field even if not specified in the schema', async t => {
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

  t.test('custom ID should work with insertMultiple as well', async t => {
    t.plan(1)

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
      {
        id: '01',
        name: 'John',
      },
      {
        id: '02',
        name: 'Doe',
      },
    ])

    t.strictSame(ids, ['john-01', 'doe-02'])
  })
})
