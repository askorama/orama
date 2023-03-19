import t from 'tap'
import { create, insert, search } from '../src/index.js'

t.test('facets', t => {
  t.plan(2)

  t.test('should generate correct facets', async t => {
    t.plan(6)

    const db = await create({
      schema: {
        author: 'string',
        quote: 'string',
        meta: {
          tag: 'string',
          isFavorite: 'boolean',
        },
      },
    })

    await insert(db, {
      author: 'Mahatma Gandhi',
      quote: 'Be the change you wish to see in the world',
      meta: {
        tag: 'inspirational',
        isFavorite: true,
      },
    })

    await insert(db, {
      author: 'Thomas A. Edison',
      quote: "I have not failed. I've just found 10,000 ways that won't work.",
      meta: {
        tag: 'inspirational',
        isFavorite: true,
      },
    })

    await insert(db, {
      author: 'Confucius',
      quote: 'It does not matter how slowly you go as long as you do not stop.',
      meta: {
        tag: 'inspirational',
        isFavorite: false,
      },
    })

    await insert(db, {
      author: 'Helen Keller',
      quote:
        'The best and most beautiful things in the world cannot be seen or even touched - they must be felt with the heart.',
      meta: {
        tag: 'love',
        isFavorite: true,
      },
    })

    await insert(db, {
      author: 'Steve Jobs',
      quote: "Your time is limited, so don't waste it living someone else's life.",
      meta: {
        tag: 'inspirational',
        isFavorite: false,
      },
    })

    await insert(db, {
      author: 'Steve Jobs',
      quote: 'The only way to do great work is to love what you do.',
      meta: {
        tag: 'inspirational',
        isFavorite: false,
      },
    })

    const results = await search(db, {
      term: 'work time',
      facets: {
        'meta.isFavorite': {
          true: true,
          false: false,
        },
        'meta.tag': {},
        author: {},
      },
    })

    t.same(results.facets?.['meta.isFavorite'].count, 2)
    t.same(results.facets?.['meta.isFavorite'].values, { true: 1, false: 2 })
    t.same(results.facets?.['meta.tag'].count, 1)
    t.same(results.facets?.['meta.tag'].values, { inspirational: 3 })
    t.same(results.facets?.author.count, 2)
    t.same(results.facets?.author.values, { 'Steve Jobs': 2, 'Thomas A. Edison': 1 })
  })

  t.test('should correctly handle range facets', async t => {
    t.plan(5)

    const db = await create({
      schema: {
        name: 'string',
        price: 'number',
        category: 'string',
      },
    })

    await insert(db, {
      name: 'Chocolate',
      price: 1.99,
      category: 'groceries',
    })

    await insert(db, {
      name: 'Milk',
      price: 2.99,
      category: 'groceries',
    })

    await insert(db, {
      name: 'Bread',
      price: 3.99,
      category: 'groceries',
    })

    await insert(db, {
      name: 'Eggs',
      price: 4.99,
      category: 'groceries',
    })

    await insert(db, {
      name: 'Cheese',
      price: 5.99,
      category: 'groceries',
    })

    await insert(db, {
      name: 'Butter',
      price: 6.99,
      category: 'groceries',
    })

    const results = await search(db, {
      term: 'groceries',
      properties: ['category'],
      facets: {
        price: {
          ranges: [
            { from: 0, to: 2 },
            { from: 2, to: 4 },
            { from: 4, to: 6 },
            { from: 6, to: 8 },
          ],
        },
      },
    })

    t.same(results.facets?.price.count, 4)
    t.same(results.facets?.price.values['0-2'], 1)
    t.same(results.facets?.price.values['2-4'], 2)
    t.same(results.facets?.price.values['4-6'], 2)
    t.same(results.facets?.price.values['6-8'], 1)
  })
})
