import t from 'tap'
import { create } from '../src/methods/create.js'

t.test('create method', (t) => {
  t.test('should provide an unique ID for the instance', async (t) => {
    t.plan(3)

    const orama1 = create({ schema: {} })
    const orama2 = create({ schema: {} })

    t.hasProp(orama1, 'id')
    t.hasProp(orama2, 'id')

    t.equal(orama1.id === orama2.id, false)
  })

  t.test('should accept an "id" property and set is as instance ID', async (t) => {
    t.plan(2)

    const orama = create({ schema: {}, id: 'my-instance-id' })

    t.hasProp(orama, 'id')
    t.same(orama.id, 'my-instance-id')
  })

  t.test('should throw if custom tokenizer and language are specified together', async (t) => {
    t.throws(() =>
      create({
        schema: {},
        language: 'en'
      })
    )

    t.end()
  })

  t.test('should allow creation of an index with a geopoint property', async (t) => {
    t.plan(1)

    t.ok(
      create({
        schema: {
          name: 'string',
          location: 'geopoint'
        }
      })
    )
  })

  t.end()
})
