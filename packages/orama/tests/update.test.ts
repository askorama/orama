import t from 'tap'
import { create, insert, getByID, update, updateMultiple } from '../src/index.js'

t.test('update method', t => {
  t.plan(1)

  t.test('should remove a document the old document and insert the new one', async t => {
    t.plan(2)

    const db = await create({
      schema: {
        quote: 'string',
        author: 'string',
        meta: {
          tags: 'string',
        },
      },
    })

    const oldDocId = await insert(db, {
      quote: "Life is what happens when you're busy making other plans",
      author: 'John Lennon',
      meta: {
        tags: 'music, life, music',
      },
    })

    const newDocId = await update(db, oldDocId, {
      quote: 'What I cannot create, I do not understand',
      author: 'Richard Feynman',
      meta: {
        tags: 'physics, science, philosophy',
      },
    })

    const oldDoc = await getByID(db, oldDocId)
    t.notOk(oldDoc)

    const newDoc = await getByID(db, newDocId)
    t.ok(newDoc)
  })
})

t.test('updateMultiple', async t => {
  const db = await create({
    schema: {
      quote: 'string',
      author: 'string',
    },
  })

  const oldDocId1 = await insert(db, {
    quote: "Life is what happens when you're busy making other plans",
    author: 'John Lennon',
  })
  const oldDocId2 = await insert(db, {
    quote: 'What I cannot create, I do not understand',
  })

  const [id1, id2] = await updateMultiple(db, [oldDocId1, oldDocId2], [
    {
      quote: 'He who is brave is free',
      author: 'Seneca',
    },
    {
      quote: 'You must be the change you wish to see in the world',
      author: 'Mahatma Gandhi',
    }
  ])

  t.notOk(await getByID(db, oldDocId1))
  t.notOk(await getByID(db, oldDocId2))

  t.ok(await getByID(db, id1))
  t.ok(await getByID(db, id2))

  t.end()
})