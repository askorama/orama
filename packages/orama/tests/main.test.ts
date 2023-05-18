import t from 'tap'
import { DocumentsStore } from '../src/components/documents-store.js'
import { Index } from '../src/components/index.js'
import { create, insert, insertMultiple, search } from '../src/index.js'
import { SUPPORTED_LANGUAGES } from '../src/components/tokenizer/languages.js'
import type { Document } from '../src/types'
import dataset from './datasets/events.json' assert { type: 'json' }

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

t.test('language', t => {
  t.plan(5)

  t.test('should throw an error if the desired language is not supported', async t => {
    t.plan(1)

    await t.rejects(
      () =>
        create({
          schema: {},
          language: 'latin',
        }),
      { code: 'LANGUAGE_NOT_SUPPORTED' },
    )
  })

  t.test('should throw an error if the desired language is not supported during insertion', async t => {
    t.plan(1)

    const db = await create({
      schema: { foo: 'string' },
    })

    await t.rejects(
      () =>
        insert(
          db,
          {
            foo: 'bar',
          },
          'latin',
        ),
      { code: 'LANGUAGE_NOT_SUPPORTED' },
    )
  })

  t.test('should not throw if if the language is supported', async t => {
    t.plan(1)

    try {
      await create({
        schema: {},
        language: 'portuguese',
      })

      t.pass()
    } catch (e) {
      t.fail()
    }
  })

  t.test('should not throw if if the language is supported', async t => {
    t.plan(1)

    try {
      await create({
        schema: {},
        language: 'slovenian',
      })

      t.pass()
    } catch (e) {
      t.fail()
    }
  })

  t.test('should not throw if if the language is supported', async t => {
    t.plan(1)

    try {
      await create({
        schema: {},
        language: 'bulgarian',
      })

      t.pass()
    } catch (e) {
      t.fail()
    }
  })
})

t.test('document validation', t => {
  t.plan(3)

  t.test('should compare the inserted doc with the schema definition', async t => {
    t.plan(2)

    const db = await create({
      schema: {
        quote: 'string',
        author: 'string',
      },
    })

    t.ok(await insert(db, { quote: 'hello, world!', author: 'me' }))

    await t.rejects(() => insert(db, { quote: 'hello, world!', author: true }), {
      code: 'SCHEMA_VALIDATION_FAILURE',
      message: 'Cannot insert document due schema validation failure on "author" property.',
    })
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
      authors: 'author should be singular',
    })

    t.equal(Object.keys((db.data.docs as DocumentsStore).docs).length, 1)

    const docWithExtraKey = { quote: 'hello, world!', foo: { bar: 10 } }

    const insertedInfo = await insert(db, docWithExtraKey)

    t.ok(insertedInfo)
    t.equal(Object.keys((db.data.docs as DocumentsStore).docs).length, 2)

    t.ok('foo' in (db.data.docs as DocumentsStore).docs[insertedInfo]!)
    t.same(docWithExtraKey.foo, (db.data.docs as DocumentsStore).docs[insertedInfo]!.foo)
    t.notOk('foo' in (db.data.index as Index).indexes)
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
        (db.data.docs as DocumentsStore).docs[insertedInfo]!.unexpectedProperty,
      )

      t.same(
        nestedExtraKeyDoc.tag.unexpectedNestedProperty,
        ((db.data.docs as DocumentsStore).docs[insertedInfo]!.tag as unknown as Record<string, string>)
          .unexpectedNestedProperty,
      )

      t.notOk('unexpectedProperty' in (db.data.index as Index).indexes)
      t.notOk('tag.unexpectedProperty' in (db.data.index as Index).indexes)
    },
  )
})

t.test('orama', t => {

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

  t.test('should suport batch insert of documents', async t => {
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

t.test('orama - hooks', t => {
  t.plan(2)
  t.test('should validate on orama creation', async t => {
    t.plan(1)

    await t.rejects(
      () =>
        create({
          schema: { date: 'string' },
          components: {
            ['anotherHookName' as string]: () => {
              t.fail("it shouldn't be called")
            },
          },
        }),
      { code: 'UNSUPPORTED_COMPONENT' },
    )
  })

  t.test('afterInsert hook', async t => {
    let callOrder = 0
    const db = await create({
      schema: {
        quote: 'string',
        author: {
          name: 'string',
          surname: 'string',
        },
      },
      components: {
        afterInsert(): void {
          t.same(++callOrder, 1)
        },
      },
    })
    await insert(db, {
      quote: 'Harry Potter, the boy who lived, come to die. Avada kedavra.',
      author: {
        name: 'Tom',
        surname: 'Riddle',
      },
    })
    t.same(++callOrder, 2)
  })
})

t.test('custom tokenizer configuration', t => {
  t.plan(1)

  t.test('tokenizerFn', async t => {
    t.plan(2)
    const db = await create({
      schema: {
        txt: 'string',
      },
      components: {
        tokenizer: {
          tokenize(text: string) {
            return text.split(',')
          },
          language: 'english',
          normalizationCache: new Map(),
        },
      },
    })

    await insert(db, {
      txt: 'hello, world! How are you?',
    })

    const searchResult = await search(db, {
      term: ' world! How are you?',
      exact: true,
    })

    const searchResult2 = await search(db, {
      term: 'How are you?',
      exact: true,
    })

    t.same(searchResult.count, 1)
    t.same(searchResult2.count, 0)
  })
})

t.test('should access own properties exclusively', async t => {
  t.plan(1)

  const db = await create({
    schema: {
      txt: 'string',
    },
  })

  await insert(db, {
    txt: 'constructor',
  })

  await search(db, {
    term: 'constructor',
    tolerance: 1,
  })

  t.same(1, 1)
})

t.test('should search numbers in supported languages', async t => {
  for (const language of SUPPORTED_LANGUAGES) {
    const db = await create({
      schema: {
        number: 'string',
      },
      components: {
        tokenizer: { language: language, stemming: false },
      },
    })

    await insert(db, {
      number: '123',
    })

    const searchResult = await search(db, {
      term: '123',
    })

    t.same(searchResult.count, 1, `Language: ${language}`)
  }

  t.end()
})

//  Tests for https://github.com/OramaSearch/orama/issues/230
t.test('should correctly search accented words in Italian', async t => {
  const db = await create({
    schema: {
      description: 'string',
    },
    components: {
      tokenizer: { language: 'italian', stemming: false },
    },
  })

  await insert(db, {
    description: 'Il mio nome è Josè',
  })

  const searchResult = await search(db, {
    term: 'jose',
  })
  t.equal(searchResult.count, 1)
})

//  Tests for https://github.com/OramaSearch/orama/issues/230
t.test('should correctly search accented words in English', async t => {
  const db = await create({
    schema: {
      description: 'string',
    },
    components: {
      tokenizer: { language: 'english', stemming: false },
    },
  })

  await insert(db, {
    description: 'My name is Josè',
  })

  const searchResult = await search(db, {
    term: 'jose',
  })
  t.equal(searchResult.count, 1)
})

//  Tests for https://github.com/OramaSearch/orama/issues/230
t.test('should correctly search accented words in Dutch', async t => {
  const db = await create({
    schema: {
      description: 'string',
    },
    components: {
      tokenizer: { language: 'dutch', stemming: false },
    },
  })

  await insert(db, {
    description: 'Mein Name ist Josè',
  })

  const searchResult = await search(db, {
    term: 'jose',
  })
  t.equal(searchResult.count, 1)
})

t.test('should correctly search accented words in Slovenian', async t => {
  const db = await create({
    schema: {
      description: 'string',
    },
    components: {
      tokenizer: { language: 'slovenian', stemming: false },
    },
  })

  await insert(db, {
    description: 'ščisti se pešec čez križišče',
  })

  await insert(db, {
    description: 'na vrhu hriba je križ',
  })

  await insert(db, {
    description: 'okroglo križišče je krožišče',
  })

  const searchResult = await search(db, {
    term: 'križišče',
  })
  t.equal(searchResult.count, 2)
})

t.test('should correctly search words in Bulgarian', async t => {
  const db = await create({
    schema: {
      description: 'string',
    },
    components: {
      tokenizer: { language: 'bulgarian', stemming: false },
    },
  })

  await insert(db, {
    // text in the same vain as the quick brown fox, including all cyrillic letters
    description: 'Жълтата дюля беше щастлива, че пухът, който цъфна, замръзна като гьон',
  })

  await insert(db, {
    description: 'Пингвините са нелетящи птици, обитаващи Южното полукълбо',
  })

  await insert(db, {
    description: 'Гръдните мускули на пингвините са много по-мощни от тези на летящите им родственици',
  })

  const firstSearchResult = await search(db, {
    term: 'пингвин',
  })
  t.equal(firstSearchResult.count, 2)

  const secondSearchResult = await search(db, {
    term: 'жълта',
  })
  t.equal(secondSearchResult.count, 1)
})
