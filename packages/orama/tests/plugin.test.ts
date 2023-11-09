import t from 'tap'
import { create } from '../src/index.js'
import { getAllPluginsByHook } from '../src/components/plugins.js'

t.test('getAllPluginsByHook', async t => {
  t.plan(1)

  t.test('should return all the plugins that includes a given hook name', async t => {
    t.plan(2)

    const db = await create({
      schema: {
        name: 'string',
      } as const,
      plugins: [
        {
          name: 'plugin1',
          beforeInsert: async () => {},
          afterInsert: async () => {},
          beforeSearch: async () => {},
          afterSearch: async () => {},
        },
        {
          name: 'plugin2',
          beforeInsert: async () => {},
          afterInsert: async () => {},
          beforeSearch: async () => {},
          afterSearch: async () => {},
        },
        {
          name: 'plugin3',
          beforeInsert: async () => {},
          beforeSearch: async () => {},
        }
      ]
    })

    const beforeInsertPlugins = getAllPluginsByHook(db, 'beforeInsert')
    const afterSearchPlugins = getAllPluginsByHook(db, 'afterSearch')

    t.equal(beforeInsertPlugins.length, 3)
    t.equal(afterSearchPlugins.length, 2)
  })

})