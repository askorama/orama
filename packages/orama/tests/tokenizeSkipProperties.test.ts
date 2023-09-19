import * as t from 'tap'
import { Orama, create, insert, search } from '../src/index.js'

t.test('tokenizeSkipProperties', t => {
  t.test('skipProperties', async t => {
    const [db, id1] = await createSimpleDB(true)

    const result = await search(db, {
      where: {
        'meta.finish': 'black matte',
      },
    })

    t.ok(result.elapsed)
    t.ok(result.elapsed.raw)
    t.ok(result.elapsed.formatted)
    t.equal(result.count, 1)
    t.equal(result.hits[0].id, id1)

    t.end()
  })

  t.test('noSkipProperties', async t => {
    const [db, id1, id2, , id4] = await createSimpleDB(false)

    const result = await search(db, {
      where: {
        'meta.finish': 'black matte',
      },
    })

    t.ok(result.elapsed)
    t.ok(result.elapsed.raw)
    t.ok(result.elapsed.formatted)
    t.equal(result.count, 3)

    for (const id of [id1, id2, id4]) {
      t.ok(result.hits.find(d => d.id === id))
    }

    t.end()
  })
  t.end()
})

async function createSimpleDB(skipProperties: boolean) {
  let db: Orama<{
    name: 'string'
    rating: 'number'
    price: 'number'
    meta: {
      sales: 'number'
      finish: 'string'
    }
  }>
  if (skipProperties) {
    db = await create({
      schema: {
        name: 'string',
        rating: 'number',
        price: 'number',
        meta: {
          sales: 'number',
          finish: 'string',
        },
      },
      components: {
        tokenizer: {
          tokenizeSkipProperties: ['meta.finish'],
        },
      },
    })
  } else {
    db = await create({
      schema: {
        name: 'string',
        rating: 'number',
        price: 'number',
        meta: {
          sales: 'number',
          finish: 'string',
        },
      },
    })
  }

  const id1 = await insert(db, {
    name: 'super coffee maker',
    rating: 5,
    price: 900,
    meta: {
      sales: 100,
      finish: 'black matte',
    },
  })

  const id2 = await insert(db, {
    name: 'washing machine',
    rating: 5,
    price: 900,
    meta: {
      sales: 100,
      finish: 'gloss black',
    },
  })

  const id3 = await insert(db, {
    name: 'coffee maker',
    rating: 3,
    price: 30,
    meta: {
      sales: 25,
      finish: 'gloss blue',
    },
  })

  const id4 = await insert(db, {
    name: 'coffee maker deluxe',
    rating: 5,
    price: 45,
    meta: {
      sales: 25,
      finish: 'blue matte',
    },
  })

  return [db, id1, id2, id3, id4] as const
}
