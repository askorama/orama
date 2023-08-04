import t from 'tap'
import { create } from '../src/methods/create.js'
import { Components } from '../src/types.js'

t.test('create method', t => {
  t.test('should provide an unique ID for the instance', async t => {
    t.plan(3)

    const orama1 = await create({ schema: {} })
    const orama2 = await create({ schema: {} })

    t.hasProp(orama1, 'id')
    t.hasProp(orama2, 'id')

    t.equal(orama1.id === orama2.id, false)
  })

  t.test('should accept an "id" property and set is as instance ID', async t => {
    t.plan(2)

    const orama = await create({ schema: {}, id: 'my-instance-id' })

    t.hasProp(orama, 'id')
    t.same(orama.id, 'my-instance-id')
  })

  t.test('should throw if custom component is not a function', async t => {
    await t.rejects(
      create({
        schema: {},
        components: {
          validateSchema: {},
        } as Components,
      }),
    )

    t.end()
  })

  t.test('should throw if some of custom component array is not a function', async t => {
    await t.rejects(
      create({
        schema: {},
        components: {
          afterInsert: [{}],
        } as Components,
      }),
    )

    t.end()
  })

  t.test('should throw if custom tokenizer and language are specified together', async t => {
    await t.rejects(
      create({
        schema: {},
        components: {
          tokenizer: {},
        } as Components,
        language: 'en',
      }),
    )

    t.end()
  })

  t.test('should throw on unknown component', async t => {
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

  t.end()
})
