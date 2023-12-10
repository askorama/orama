const b = require('benny')
const { setTimeout } = require('timers/promises')
const { formattedEvents } = require('./utils/dataset')
const { create, insertMultiple, search } = require('@orama/orama')

async function createDb() {
  const db = await create({
    schema: {
      date: 'string',
      description: 'string',
      categories: {
        first: 'string',
        second: 'string'
      }
    }
  })
  const first3000Events = formattedEvents.slice(0, 3000)

  await insertMultiple(db, first3000Events)

  return db
}

b.suite(
  'Example',

  b.add('normal', async () => {
    const db = await createDb()

    return async () => {
      await search(db, {
        limit: 1
      })
    }
  }),
  b.add('distinctOn', async () => {
    const db = await createDb()

    return async () => {
      await search(db, {
        distinctOn: 'date',
        limit: 1
      })
    }
  }),
  b.add('groupBy', async () => {
    const db = await createDb()

    return async () => {
      await search(db, {
        groupBy: {
          properties: ['date'],
          maxResult: 1
        }
      })
    }
  }),

  b.cycle(),
  b.complete(),
  b.save({ file: 'reduce', version: '1.0.0' }),
  b.save({ file: 'reduce', format: 'chart.html' })
)
