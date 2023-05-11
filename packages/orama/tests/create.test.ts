import t from 'tap'
import { create } from '../src/methods/create.js'

t.test('create should provide an unique ID for the instance', async t => {
  t.plan(3)

  const orama1 = await create({ schema: {} })
  const orama2 = await create({ schema: {} })

  t.hasProp(orama1, 'id')
  t.hasProp(orama2, 'id')

  t.equal(orama1.id === orama2.id, false)
})

t.test('create should accept an "id" property and set is as instance ID', async t => {
  t.plan(2)

  const orama = await create({ schema: {}, id: 'my-instance-id' })

  t.hasProp(orama, 'id')
  t.same(orama.id, 'my-instance-id')
})
