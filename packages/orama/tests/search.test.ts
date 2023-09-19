import t from 'tap'
import { stopwords as englishStopwords } from '@orama/stopwords/english'
import { create, getByID, insert, insertMultiple, search } from '../src/index.js'

t.test('search method', t => {
  t.test('with term', async t => {
    const [db, id1, id2, id3, id4] = await createSimpleDB()

    t.test('should return all the document on empty string', async t => {
      const result = await search(db, {
        term: '',
      })

      t.ok(result.elapsed)
      t.ok(result.elapsed.raw)
      t.ok(result.elapsed.formatted)

      for (const id of [id1, id2, id3, id4]) {
        const doc = await getByID(db, id)
        t.strictSame(
          result.hits.find(d => d.id === id),
          {
            id,
            score: 0,
            document: doc,
          },
        )
      }

      t.end()
    })

    t.test('should return all the document if params is an empty object', async t => {
      const result = await search(db, {})

      for (const id of [id1, id2, id3, id4]) {
        const doc = await getByID(db, id)
        t.strictSame(
          result.hits.find(d => d.id === id),
          {
            id,
            score: 0,
            document: doc,
          },
        )
      }

      t.end()
    })

    t.test('should filter the result based on "term" value', async t => {
      const { hits: allDocs } = await search(db, {})
      const docIdsShouldNotMatch = allDocs.filter(d => !/coffee/.test(d.document.name as string)).map(d => d.id)
      const docIdsShouldMatch = allDocs.filter(d => /coffee/.test(d.document.name as string)).map(d => d.id)

      const result = await search(db, {
        term: 'coffee',
      })

      const matchedIds = result.hits.map(d => d.id)
      t.strictSame(new Set(docIdsShouldMatch), new Set(matchedIds))
      t.notOk(docIdsShouldNotMatch.find(id => matchedIds.includes(id)))

      t.end()
    })

    t.test('should filter the result based on "term" value # 2', async t => {
      t.plan(8)

      const db = await create({
        schema: {
          quote: 'string',
          author: 'string',
        },
        components: {
          tokenizer: {
            stemming: true,
            stopWords: englishStopwords,
          },
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

    t.test('should apply term only on indexed fields', async t => {
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

    t.test('should throw an error when searching in non-existing indices', async t => {
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

    t.test('should return empty array if term is removed by tokenizer', async t => {
      const [db] = await createSimpleDB()

      await insert(db, {
        name: 'Allowed',
        rating: 5,
        price: 900,
        meta: {
          sales: 100,
        },
      })
      const result = await search(db, {
        term: 'all',
      })

      t.equal(result.count, 0)

      t.end()
    })

    t.end()
  })

  t.test('with exact', t => {
    t.test('should exact match', async t => {
      t.plan(4)

      const db = await create({
        schema: {
          author: 'string',
          quote: 'string',
        },
      })

      const id = await insert(db, {
        quote: 'Be yourself; everyone else is already taken.',
        author: 'Oscar Wilde',
      })

      const partialSearch = await search(db, {
        term: 'alr',
        exact: true,
      })

      t.equal(partialSearch.count, 0)
      t.strictSame(partialSearch.hits, [])

      const exactSearch = await search(db, {
        term: 'already',
        exact: true,
      })

      t.equal(exactSearch.count, 1)
      t.strictSame(
        exactSearch.hits.map(d => d.id),
        [id],
      )
    })

    t.end()
  })

  t.test('with tollerate', t => {
    t.test("shouldn't tolerate typos if set to 0", async t => {
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

    t.test('should tolerate typos', async t => {
      t.plan(4)

      const db = await create({
        schema: {
          quote: 'string',
          author: 'string',
        },
      })

      const id1 = await insert(db, {
        quote:
          'Absolutely captivating creatures, seahorses seem like a product of myth and imagination rather than of nature.',
        author: 'Sara A. Lourie',
      })

      const id2 = await insert(db, {
        quote: 'Seahorses look mythical, like dragons, but these magnificent shy creatures are real.',
        author: 'Jennifer Keats Curtis',
      })

      const tolerantSearch = await search(db, {
        term: 'seahrse',
        tolerance: 2,
      })

      t.equal(tolerantSearch.count, 2)
      t.strictSame(new Set(tolerantSearch.hits.map(d => d.id)), new Set([id1, id2]))

      const moreTolerantSearch = await search(db, {
        term: 'sahrse',
        tolerance: 5,
      })

      t.equal(moreTolerantSearch.count, 2)
      t.strictSame(new Set(tolerantSearch.hits.map(d => d.id)), new Set([id1, id2]))
    })

    t.end()
  })

  t.test('with pagination', t => {
    t.test('should correctly paginate results', async t => {
      const db = await create({
        schema: {
          animal: 'string',
        },
      })

      const id1 = await insert(db, { id: '0', animal: 'Quick brown fox' })
      await insert(db, { id: '1', animal: 'Lazy dog' })
      await insert(db, { id: '2', animal: 'Jumping penguin' })
      const id4 = await insert(db, { id: '3', animal: 'Fast chicken' })
      const id5 = await insert(db, { id: '4', animal: 'Fabolous ducks' })
      const id6 = await insert(db, { id: '5', animal: 'Fantastic horse' })

      const cases = [
        { limit: 1, offset: 0, expectedIds: [id4] },
        { limit: 1, offset: 1, expectedIds: [id5] },
        { limit: 1, offset: 2, expectedIds: [id6] },
        { limit: 2, offset: 2, expectedIds: [id6, id1] },
        { limit: 0, offset: 0, expectedIds: [] },
        { limit: 1, offset: 100000, expectedIds: [] },
      ]
      for (const c of cases) {
        const { limit, offset, expectedIds } = c
        const name = `limit: ${limit}, offset: ${offset}`
        t.test(name, async t => {
          const result = await search(db, { term: 'f', limit, offset })
          const actualIds = result.hits.map(d => d.id)

          t.equal(result.count, 4)
          t.strictSame(actualIds, expectedIds)
          t.end()
        })
      }

      t.end()
    })
    t.end()
  })

  t.test('should correctly search without term', async t => {
    t.plan(4)

    const db = await create({
      schema: {
        quote: 'string',
        author: 'string',
      },
      components: {
        tokenizer: {
          stopWords: englishStopwords,
          stemming: true,
        },
      },
    })

    const docs = [
      { id: '0', quote: 'the quick, brown fox jumps over the lazy dog. What a fox!', author: 'John Doe' },
      { id: '1', quote: 'Foxes are nice animals. But I prefer having a dog.', author: 'John Doe' },
      { id: '2', quote: 'I like dogs. They are the best.', author: 'Jane Doe' },
    ]

    await insert(db, docs[0])
    await insert(db, docs[1])
    await insert(db, docs[2])

    // Exact search
    const result1 = await search(db, { exact: false })
    const result2 = await search(db, { exact: true })

    t.equal(result1.count, 3)
    t.equal(result2.count, 3)
    t.strictSame(
      result1.hits.sort((a, b) => a.id.localeCompare(b.id)).map(h => h.document),
      docs,
    )
    t.strictSame(
      result1.hits.sort((a, b) => a.id.localeCompare(b.id)).map(h => h.document),
      docs,
    )
  })

  t.test('should correctly search for data returning doc including with unindexed keys', async t => {
    t.plan(4)

    const db = await create({
      schema: {
        quote: 'string',
        author: 'string',
      },
      components: {
        tokenizer: { language: 'english', stemming: false, stopWords: englishStopwords },
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

  t.test('should throw an error when searching in non-existing indices', async t => {
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

  t.test('should support nested properties', async t => {
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

  t.test('should support multiple nested properties', async t => {
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

  t.test('with afterSearchHook', t => {
    t.test('should run afterSearch hook', async t => {
      let called = 0
      const db = await create({
        schema: {
          animal: 'string',
        },
        components: {
          afterSearch: () => {
            called++
          },
        },
      })

      await insertMultiple(db, [
        { id: '0', animal: 'Quick brown fox' },
        { id: '1', animal: 'Lazy dog' },
        { id: '2', animal: 'Jumping penguin' },
        { id: '3', animal: 'Fast chicken' },
        { id: '4', animal: 'Fabolous ducks' },
        { id: '5', animal: 'Fantastic horse' },
      ])

      await search(db, { term: 'f' })

      t.equal(called, 1)

      t.end()
    })
    t.end()
  })

  t.end()
})

async function createSimpleDB() {
  let i = 0
  const db = await create({
    schema: {
      name: 'string',
      rating: 'number',
      price: 'number',
      meta: {
        sales: 'number',
      },
    },
    components: {
      tokenizer: {
        stopWords: englishStopwords,
      },
      getDocumentIndexId(): string {
        return `__${++i}`
      },
    },
  })

  const id1 = await insert(db, {
    name: 'super coffee maker',
    rating: 5,
    price: 900,
    meta: {
      sales: 100,
    },
  })

  const id2 = await insert(db, {
    name: 'washing machine',
    rating: 5,
    price: 900,
    meta: {
      sales: 100,
    },
  })

  const id3 = await insert(db, {
    name: 'coffee maker',
    rating: 3,
    price: 30,
    meta: {
      sales: 25,
    },
  })

  const id4 = await insert(db, {
    name: 'coffee maker deluxe',
    rating: 5,
    price: 45,
    meta: {
      sales: 25,
    },
  })

  return [db, id1, id2, id3, id4] as const
}
