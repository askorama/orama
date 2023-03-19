import t from 'tap'
import { DocumentsStore } from '../src/components/documents-store.js'
import { Index } from '../src/components/index.js'
import { create, insert, insertMultiple, remove, search } from '../src/index.js'
import { createTokenizer } from '../src/tokenizer/index.js'
import { SUPPORTED_LANGUAGES } from '../src/tokenizer/languages.js'
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
      code: 'INVALID_DOCUMENT_PROPERTY',
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
  t.plan(19)

  t.test('should correctly search for data', async t => {
    t.plan(8)

    const db = await create({
      schema: {
        quote: 'string',
        author: 'string',
      },
    })

    await insert(db, { quote: 'the quick, brown fox jumps over the lazy dog. What a fox!', author: 'John Doe' })
    await insert(db, { quote: 'Foxes are nice animals. But I prefer having a dog.', author: 'John Doe' })
    await insert(db, { quote: 'I like dogs. They are the best.', author: 'Jane Doe' })
    await insert(db, { quote: 'I like cats. They are the best.', author: 'Jane Doe' })

    // Exact search
    const result1 = await search(db, { term: 'fox', exact: true })
    const result2 = await search(db, { term: 'dog', exact: true })

    t.equal(result1.count, 2)
    t.equal(result2.count, 3)

    // Prefix search
    const result3 = await search(db, { term: 'fox', exact: false })
    const result4 = await search(db, { term: 'dog', exact: false })

    t.equal(result3.count, 2)
    t.equal(result4.count, 3)

    // Typo-tolerant search
    const result5 = await search(db, { term: 'fx', tolerance: 1 })
    const result6 = await search(db, { term: 'dg', tolerance: 2 })

    t.equal(result5.count, 2)
    t.equal(result6.count, 4)

    // Long string search (Tests for https://github.com/OramaSearch/orama/issues/159 )
    const result7 = await search(db, { term: 'They are the best' })
    const result8 = await search(db, { term: 'Foxes are nice animals' })

    t.equal(result7.count, 2)
    t.equal(result8.count, 2)
  })

  t.test('should correctly search for data returning doc including with unindexed keys', async t => {
    t.plan(4)

    const db = await create({
      schema: {
        quote: 'string',
        author: 'string',
      },
      components: {
        tokenizer: await createTokenizer('english', { stemming: false, stopWords: false }),
      },
    })

    const documentWithUnindexedField = {
      quote: 'I like cats. They are the best.',
      author: 'Jane Doe',
      unindexedField: 'unindexedValue',
    }
    const documentWithNestedUnindexedField = {
      quote: 'Foxes are nice animals. But I prefer having a dog.',
      author: 'John Doe',
      nested: { unindexedNestedField: 'unindexedNestedValue' },
    }

    await insert(db, documentWithNestedUnindexedField)
    await insert(db, documentWithUnindexedField)

    const result1 = await search(db, { term: 'They are the best' })
    const result2 = await search(db, { term: 'Foxes are nice animals' })

    t.equal(result1.count, 1)
    t.equal(result2.count, 1)
    t.same(result1.hits[0].document, documentWithUnindexedField)
    t.same(result2.hits[0].document, documentWithNestedUnindexedField)
  })

  t.test('should not found any doc if searching by unindexed field value', async t => {
    t.plan(2)

    const db = await create({
      schema: {
        quote: 'string',
        author: 'string',
      },
    })

    await insert(db, {
      quote: 'I like dogs. They are the best.',
      author: 'Jane Doe',
      nested: { unindexedNestedField: 'unindexedNestedValue' },
    })

    await insert(db, {
      quote: 'I like cats. They are the best.',
      author: 'Jane Doe',
      unindexedField: 'unindexedValue',
    })

    const result1 = await search(db, { term: 'unindexedNestedValue' })
    const result2 = await search(db, { term: 'unindexedValue' })

    t.equal(result1.count, 0)
    t.equal(result2.count, 0)
  })

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
    t.type(ex1Search.elapsed, 'bigint')
    t.equal(ex1Search.hits[0].document.example, 'The quick, brown, fox')
  })

  t.test('should correctly paginate results', async t => {
    t.plan(9)

    const db = await create({
      schema: {
        animal: 'string',
      },
    })

    await insert(db, { animal: 'Quick brown fox' })
    await insert(db, { animal: 'Lazy dog' })
    await insert(db, { animal: 'Jumping penguin' })
    await insert(db, { animal: 'Fast chicken' })
    await insert(db, { animal: 'Fabolous ducks' })
    await insert(db, { animal: 'Fantastic horse' })

    const search1 = await search(db, { term: 'f', limit: 1, offset: 0 })
    const search2 = await search(db, { term: 'f', limit: 1, offset: 1 })
    const search3 = await search(db, { term: 'f', limit: 1, offset: 2 })
    const search4 = await search(db, { term: 'f', limit: 2, offset: 2 })

    t.equal(search1.count, 4)
    t.equal(search1.hits[0].document.animal, 'Fast chicken')

    t.equal(search2.count, 4)
    t.equal(search2.hits[0].document.animal, 'Fabolous ducks')

    t.equal(search3.count, 4)
    t.equal(search3.hits[0].document.animal, 'Fantastic horse')

    t.equal(search4.count, 4)
    t.equal(search4.hits[0].document.animal, 'Fantastic horse')
    t.equal(search4.hits[1].document.animal, 'Quick brown fox')
  })

  t.test('Should throw an error when searching in non-existing indices', async t => {
    t.plan(1)

    const db = await create({ schema: { foo: 'string', baz: 'string' } })

    await t.rejects(
      () =>
        search(db, {
          term: 'foo',
          properties: ['bar'],
        }),
      {
        code: 'UNKNOWN_INDEX',
      },
    )
  })

  t.test('Should correctly remove a document after its insertion', async t => {
    t.plan(4)

    const db = await create({
      schema: {
        quote: 'string',
        author: 'string',
      },
    })

    const id1 = await insert(db, {
      quote: 'Be yourself; everyone else is already taken.',
      author: 'Oscar Wilde',
    })

    const id2 = await insert(db, {
      quote: 'To live is the rarest thing in the world. Most people exist, that is all.',
      author: 'Oscar Wilde',
    })

    await insert(db, {
      quote: 'So many books, so little time.',
      author: 'Frank Zappa',
    })

    await remove(db, id1)

    const searchResult = await search(db, {
      term: 'Oscar',
      properties: ['author'],
    })

    t.equal(searchResult.count, 1)
    t.equal(searchResult.hits[0].document.author, 'Oscar Wilde')
    t.equal(
      searchResult.hits[0].document.quote,
      'To live is the rarest thing in the world. Most people exist, that is all.',
    )
    t.equal(searchResult.hits[0].id, id2)
  })

  // Tests for https://github.com/nearform/orama/issues/52
  t.test('Should correctly remove documents via substring search', async t => {
    t.plan(1)

    const orama = await create({
      schema: {
        word: 'string',
      },
    })

    const halo = await insert(orama, { word: 'Halo' })
    await insert(orama, { word: 'Halloween' })
    await insert(orama, { word: 'Hal' })

    await remove(orama, halo)

    const searchResult = await search(orama, {
      term: 'Hal',
    })

    t.equal(searchResult.count, 2)
  })

  t.test('Should remove a document with a nested schema', async t => {
    t.plan(4)

    const movieDB = await create({
      schema: {
        title: 'string',
        director: 'string',
        plot: 'string',
        year: 'number',
        isFavorite: 'boolean',
      },
    })

    const harryPotter = await insert(movieDB, {
      title: "Harry Potter and the Philosopher's Stone",
      director: 'Chris Columbus',
      plot: 'Harry Potter, an eleven-year-old orphan, discovers that he is a wizard and is invited to study at Hogwarts. Even as he escapes a dreary life and enters a world of magic, he finds trouble awaiting him.',
      year: 2001,
      isFavorite: false,
    })

    const testSearch1 = await search(movieDB, {
      term: 'Harry Potter',
      properties: ['title', 'director', 'plot'],
    })

    await remove(movieDB, harryPotter)

    const testSearch2 = await search(movieDB, {
      term: 'Harry Potter',
      properties: ['title', 'director', 'plot'],
    })

    t.ok(testSearch1)
    t.equal(testSearch1.hits[0].document.title, "Harry Potter and the Philosopher's Stone")

    t.ok(testSearch2)
    t.equal(testSearch2.count, 0)
  })

  t.test("Shouldn't returns deleted documents", async t => {
    t.plan(1)

    const db = await create({
      schema: {
        txt: 'string',
      },
    })

    await insert(db, { txt: 'stelle' })
    await insert(db, { txt: 'stellle' })
    await insert(db, { txt: 'scelte' })

    const searchResult = await search(db, { term: 'stelle', exact: true })

    const { id } = searchResult.hits[0]

    await remove(db, id)

    const searchResult2 = await search(db, { term: 'stelle', exact: true })

    t.equal(searchResult2.count, 0)
  })

  t.test("Shouldn't affects other document when deleted one", async t => {
    t.plan(2)

    const db = await create({
      schema: {
        txt: 'string',
      },
    })

    await insert(db, { txt: 'abc' })
    await insert(db, { txt: 'abc' })
    await insert(db, { txt: 'abcd' })

    const searchResult = await search(db, { term: 'abc', exact: true })

    const id = searchResult.hits[0].id
    await remove(db, id)

    const searchResult2 = await search(db, { term: 'abc', exact: true })

    t.ok(searchResult2.hits.every(({ id: docID }) => docID !== id))
    t.equal(searchResult2.count, 1)
  })

  t.test('Should preserve identical docs after deletion', async t => {
    t.plan(8)

    const db = await create({
      schema: {
        quote: 'string',
        author: 'string',
      },
    })

    const id1 = await insert(db, {
      quote: 'Be yourself; everyone else is already taken.',
      author: 'Oscar Wilde',
    })

    const id2 = await insert(db, {
      quote: 'Be yourself; everyone else is already taken.',
      author: 'Oscar Wilde',
    })

    await insert(db, {
      quote: 'So many books, so little time.',
      author: 'Frank Zappa',
    })

    await remove(db, id1)

    const searchResult = await search(db, {
      term: 'Oscar',
      properties: ['author'],
    })

    const searchResult2 = await search(db, {
      term: 'already',
      properties: ['quote'],
    })

    t.equal(searchResult.count, 1)
    t.equal(searchResult.hits[0].document.author, 'Oscar Wilde')
    t.equal(searchResult.hits[0].document.quote, 'Be yourself; everyone else is already taken.')
    t.equal(searchResult.hits[0].id, id2)

    t.equal(searchResult2.count, 1)
    t.equal(searchResult2.hits[0].document.author, 'Oscar Wilde')
    t.equal(searchResult2.hits[0].document.quote, 'Be yourself; everyone else is already taken.')
    t.equal(searchResult2.hits[0].id, id2)
  })

  t.test('Should be able to insert documens with non-searchable fields', async t => {
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

  t.test('Should exact match', async t => {
    t.plan(4)

    const db = await create({
      schema: {
        author: 'string',
        quote: 'string',
      },
    })

    await insert(db, {
      quote: 'Be yourself; everyone else is already taken.',
      author: 'Oscar Wilde',
    })

    const partialSearch = await search(db, {
      term: 'alr',
      exact: true,
    })

    t.equal(partialSearch.count, 0)

    const exactSearch = await search(db, {
      term: 'already',
      exact: true,
    })

    t.equal(exactSearch.count, 1)
    t.equal(exactSearch.hits[0].document.quote, 'Be yourself; everyone else is already taken.')
    t.equal(exactSearch.hits[0].document.author, 'Oscar Wilde')
  })

  t.test("Shouldn't tolerate typos", async t => {
    t.plan(1)

    const db = await create({
      schema: {
        quote: 'string',
        author: 'string',
      },
    })

    await insert(db, {
      quote:
        'Absolutely captivating creatures, seahorses seem like a product of myth and imagination rather than of nature.',
      author: 'Sara A. Lourie',
    })

    const searchResult = await search(db, {
      term: 'seahrse',
      tolerance: 0,
    })

    t.equal(searchResult.count, 0)
  })

  t.test('Should tolerate typos', async t => {
    t.plan(2)

    const db = await create({
      schema: {
        quote: 'string',
        author: 'string',
      },
    })

    await insert(db, {
      quote:
        'Absolutely captivating creatures, seahorses seem like a product of myth and imagination rather than of nature.',
      author: 'Sara A. Lourie',
    })

    await insert(db, {
      quote: 'Seahorses look mythical, like dragons, but these magnificent shy creatures are real.',
      author: 'Jennifer Keats Curtis',
    })

    const tolerantSearch = await search(db, {
      term: 'seahrse',
      tolerance: 2,
    })

    t.equal(tolerantSearch.count, 2)

    const moreTolerantSearch = await search(db, {
      term: 'sahrse',
      tolerance: 5,
    })

    t.equal(moreTolerantSearch.count, 2)
  })

  t.test('Should support nested properties', async t => {
    t.plan(4)

    const db = await create({
      schema: {
        quote: 'string',
        author: {
          name: 'string',
          surname: 'string',
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

    await insert(db, {
      quote: 'I am Homer Simpson.',
      author: {
        name: 'Homer',
        surname: 'Simpson',
      },
    })

    const resultAuthorSurname = await search(db, {
      term: 'Riddle',
      properties: ['author.surname'],
    })

    const resultAuthorName = await search(db, {
      term: 'Riddle',
      properties: ['author.name'],
    })

    const resultSimpsonQuote = await search(db, {
      term: 'Homer',
      properties: ['quote'],
    })

    const resultSimpsonAuthorName = await search(db, {
      term: 'Homer',
      properties: ['author.name'],
    })

    t.equal(resultSimpsonAuthorName.count, 1)
    t.equal(resultSimpsonQuote.count, 1)
    t.equal(resultAuthorSurname.count, 1)
    t.equal(resultAuthorName.count, 0)
  })

  t.test('Should support multiple nested properties', async t => {
    t.plan(3)

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
      },
    })

    await insert(db, {
      quote: 'Be yourself; everyone else is already taken.',
      author: {
        name: 'Oscar',
        surname: 'Wild',
      },
      tag: {
        name: 'inspirational',
        description: 'Inspirational quotes',
      },
    })

    await insert(db, {
      quote: 'So many books, so little time.',
      author: {
        name: 'Frank',
        surname: 'Zappa',
      },
      tag: {
        name: 'books',
        description: 'Quotes about books',
      },
    })

    await insert(db, {
      quote: 'A room without books is like a body without a soul.',
      author: {
        name: 'Marcus',
        surname: 'Tullius Cicero',
      },
      tag: {
        name: 'books',
        description: 'Quotes about books',
      },
    })

    const resultAuthor = await search(db, {
      term: 'Oscar',
    })

    const resultTag = await search(db, {
      term: 'books',
    })

    const resultQuotes = await search(db, {
      term: 'quotes',
    })

    t.equal(resultAuthor.count, 1)
    t.equal(resultTag.count, 2)
    t.equal(resultQuotes.count, 3)
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
        tokenizer: await createTokenizer(language, { stemming: false }),
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
      tokenizer: await createTokenizer('italian', { stemming: false }),
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
      tokenizer: await createTokenizer('english', { stemming: false }),
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
      tokenizer: await createTokenizer('dutch', { stemming: false }),
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
      tokenizer: await createTokenizer('slovenian', { stemming: false }),
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
      tokenizer: await createTokenizer('bulgarian', { stemming: false }),
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
