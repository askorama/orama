import t from 'tap'
import { search, insertMultiple, create } from '../src/index.js'

t.test('hybrid search', async (t) => {
  t.test('should return results', async (t) => {
    const db = await create({
      schema: {
        text: 'string',
        embedding: 'vector[5]',
        number: 'number'
      } as const
    })

    await insertMultiple(db, [
      { text: 'hello world', embedding: [1, 2, 3, 4, 5], number: 1 },
      { text: 'hello there', embedding: [1, 2, 3, 4, 4], number: 2 }
    ])

    const results = await search(db, {
      mode: 'hybrid',
      term: 'hello',
      vector: {
        value: [1, 2, 3, 4, 5],
        property: 'embedding'
      },
      similarity: 1
    })

    t.equal(results.count, 2)
  })

  t.test('should return results with filters', async (t) => {
    const db = await create({
      schema: {
        text: 'string',
        embedding: 'vector[5]',
        number: 'number'
      } as const
    })

    await insertMultiple(db, [
      { text: 'hello world', embedding: [1, 2, 3, 4, 5], number: 1 },
      { text: 'hello there', embedding: [1, 2, 3, 4, 4], number: 2 },
      { text: 'hello there', embedding: [1, 2, 3, 4, 4], number: 3 }
    ])

    const results1 = await search(db, {
      mode: 'hybrid',
      term: 'hello',
      vector: {
        property: 'embedding',
        value: [1, 2, 3, 4, 4]
      },
      similarity: 1,
      where: {
        number: {
          eq: 3
        }
      }
    })

    const results2 = await search(db, {
      mode: 'hybrid',
      term: 'hello',
      vector: {
        property: 'embedding',
        value: [1, 2, 3, 4, 4]
      },
      similarity: 0.99,
      where: {
        number: {
          eq: 0
        }
      }
    })

    t.equal(results1.count, 1)
    t.equal(results2.count, 0)
  })

  t.test('should correctly paginate the results', async (t) => {
    const db = await create({
      schema: {
        text: 'string',
        embedding: 'vector[5]',
        number: 'number'
      } as const
    })

    await insertMultiple(db, [
      { text: 'hello world', embedding: [1, 2, 3, 4, 5], number: 1 },
      { text: 'hello there', embedding: [1, 2, 3, 4, 4], number: 2 },
      { text: 'hello there', embedding: [1, 2, 3, 4, 4], number: 3 },
      { text: 'hello there', embedding: [1, 2, 3, 4, 4], number: 4 },
      { text: 'hello there', embedding: [1, 2, 3, 4, 4], number: 5 },
      { text: 'hello there', embedding: [1, 2, 3, 4, 4], number: 6 },
      { text: 'hello there', embedding: [1, 2, 3, 4, 4], number: 7 },
      { text: 'hello there', embedding: [1, 2, 3, 4, 4], number: 8 },
      { text: 'hello there', embedding: [1, 2, 3, 4, 4], number: 9 },
      { text: 'hello there', embedding: [1, 2, 3, 4, 4], number: 10 },
      { text: 'hello there', embedding: [1, 2, 3, 4, 4], number: 11 },
      { text: 'hello there', embedding: [1, 2, 3, 4, 4], number: 12 },
      { text: 'hello there', embedding: [1, 2, 3, 4, 4], number: 13 },
      { text: 'hello there', embedding: [1, 2, 3, 4, 4], number: 14 },
      { text: 'hello there', embedding: [1, 2, 3, 4, 4], number: 15 },
      { text: 'hello there', embedding: [1, 2, 3, 4, 4], number: 16 },
      { text: 'hello there', embedding: [1, 2, 3, 4, 4], number: 17 },
      { text: 'hello there', embedding: [1, 2, 3, 4, 4], number: 18 },
      { text: 'hello there', embedding: [1, 2, 3, 4, 4], number: 19 },
      { text: 'hello there', embedding: [1, 2, 3, 4, 4], number: 20 }
    ])

    const page1 = await search(db, {
      term: 'hello there',
      mode: 'hybrid',
      vector: {
        property: 'embedding',
        value: [1, 2, 3, 4, 4]
      },
      similarity: 0.5,
      limit: 2,
      offset: 0
    })

    const page2 = await search(db, {
      term: 'hello there',
      mode: 'hybrid',
      vector: {
        property: 'embedding',
        value: [1, 2, 3, 4, 4]
      },
      similarity: 0.5,
      limit: 2,
      offset: 1
    })

    const page3 = await search(db, {
      term: 'hello there',
      mode: 'hybrid',
      vector: {
        property: 'embedding',
        value: [1, 2, 3, 4, 4]
      },
      similarity: 0.5,
      limit: 2,
      offset: 2
    })

    t.equal(page1.count, 20)
    t.equal(page2.count, 20)
    t.equal(page3.count, 20)
    t.equal(page1.hits.length, 2)
    t.equal(page2.hits.length, 2)
    t.equal(page3.hits.length, 2)

    // Result with number 1 is skipped since it's not similar enough
    t.equal(page1.hits[0].document.number, 2)
    t.equal(page1.hits[1].document.number, 3)

    t.equal(page2.hits[0].document.number, 3)
    t.equal(page2.hits[1].document.number, 4)

    t.equal(page3.hits[0].document.number, 4)
    t.equal(page3.hits[1].document.number, 5)
  })

  t.test('should use custom weights correctly', async (t) => {
    const db = await create({
      schema: {
        text: 'string',
        embedding: 'vector[5]',
        number: 'number'
      } as const
    })

    await insertMultiple(db, [
      { text: 'hello world', embedding: [0, 41, 10, 39, 12], number: 1 },
      { text: 'hello world', embedding: [1, 2, 3, 4, 4], number: 2 }
    ])

    const results = await search(db, {
      mode: 'hybrid',
      term: 'hello world',
      vector: {
        value: [1, 2, 3, 4, 5],
        property: 'embedding'
      },
      similarity: 1,
      hybridWeights: {
        text: 1, // only consider text, which is identical for both documents
        vector: 0
      }
    })

    t.equal(results.count, 2)
    t.equal(results.hits[0].score, 0.5)
    t.equal(results.hits[1].score, 0.5)
  })
})

t.test('should fix the issue realted #730', async (t) => {
  const db = await create({
    schema: {
      text: "string",
      embedding: "vector[5]",
      number: "number",
      itemId: "string",
    } as const,
  });

  await insertMultiple(db, [
    { "text": "hello world", "itemId": "1", "embedding": [1, 2, 3, 4, 5], "number": 1 },
    { "text": "hello there", "itemId": "1", "embedding": [1, 2, 3, 4, 4], "number": 2 },
    { "text": "hello there", "itemId": "1", "embedding": [1, 2, 3, 4, 4], "number": 3 },
    { "text": "hello there", "itemId": "1", "embedding": [1, 2, 3, 4, 4], "number": 4 },
    { "text": "hello there", "itemId": "1", "embedding": [1, 2, 3, 4, 4], "number": 5 },
    { "text": "hello there", "itemId": "1", "embedding": [1, 2, 3, 4, 4], "number": 6 },
    { "text": "hello there", "itemId": "1", "embedding": [1, 2, 3, 4, 4], "number": 7 },
    { "text": "hello there", "itemId": "1", "embedding": [1, 2, 3, 4, 4], "number": 8 },
    { "text": "hello there", "itemId": "1", "embedding": [1, 2, 3, 4, 4], "number": 9 },
    { "text": "hello there", "itemId": "1", "embedding": [1, 2, 3, 4, 4], "number": 10 },
    { "text": "hello there", "itemId": "1", "embedding": [1, 2, 3, 4, 4], "number": 11 },
    { "text": "hello there", "itemId": "1", "embedding": [1, 2, 3, 4, 4], "number": 12 },
    { "text": "hello there", "itemId": "1", "embedding": [1, 2, 3, 4, 4], "number": 13 },
    { "text": "hello there", "itemId": "1", "embedding": [1, 2, 3, 4, 4], "number": 14 },
    { "text": "hello there", "itemId": "1", "embedding": [1, 2, 3, 4, 4], "number": 15 },
    { "text": "hello there", "itemId": "1", "embedding": [1, 2, 3, 4, 4], "number": 16 },
    { "text": "hello there", "itemId": "1", "embedding": [1, 2, 3, 4, 4], "number": 17 },
    { "text": "hello there", "itemId": "1", "embedding": [1, 2, 3, 4, 4], "number": 18 },
    { "text": "hello there", "itemId": "1", "embedding": [1, 2, 3, 4, 4], "number": 19 },
    { "text": "hello there", "itemId": "1", "embedding": [1, 2, 3, 4, 4], "number": 20 }
  ]
  );

  const page1 = await search(db, {
    term: "hello there",
    mode: "hybrid",
    where: {
      itemId: "1",
    },
    vector: {
      property: "embedding",
      value: [1, 2, 3, 4, 4],
    },
    similarity: 0.5,
    limit: 2,
    offset: 0,
  });

  const page2 = await search(db, {
    term: "hello there",
    mode: "hybrid",
    where: {
      itemId: "1",
    },
    vector: {
      property: "embedding",
      value: [1, 2, 3, 4, 4],
    },
    similarity: 0.5,
    limit: 2,
    offset: 1,
  });

  const page3 = await search(db, {
    term: "hello there",
    mode: "hybrid",
    where: {
      itemId: "1",
    },
    vector: {
      property: "embedding",
      value: [1, 2, 3, 4, 4],
    },
    similarity: 0.5,
    limit: 2,
    offset: 2,  
  });
  const page4 = await search(db, {
    term: "hello there",
    mode: "hybrid",
    where: {
      itemId: "1",
    },
    vector: {
      property: "embedding",
      value: [1, 2, 3, 4, 4],
    },
    similarity: 0.5,
    limit: 10,
    offset: 5,  
  })
  t.equal(page1.hits.length, 2)
  t.equal(page2.hits.length, 2)
  t.equal(page3.hits.length, 2)
  t.equal(page4.hits.length, 10)
  t.equal(page1.count, 20)
  t.equal(page2.count, 20)
  t.equal(page3.count, 20)
  t.equal(page4.count, 20)
})


