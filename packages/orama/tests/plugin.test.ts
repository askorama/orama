import t from 'tap'
import { OramaPlugin, create, search, insert } from '../src/index.js'
import { getAllPluginsByHook } from '../src/components/plugins.js'

t.test('getAllPluginsByHook', async t => {
  t.plan(1)

  t.test('should return all the plugins that includes a given hook name', async t => {
    t.plan(2)

    function plugin1 () {
      return {
        name: 'plugin1',
        beforeInsert: async () => {},
        afterInsert: async () => {},
        beforeSearch: async () => {},
        afterSearch: async () => {},
      }
    }

    function plugin2 () {
      return {
        name: 'plugin2',
        beforeInsert: async () => {},
        afterInsert: async () => {},
        beforeSearch: async () => {},
        afterSearch: async () => {},
      }
    }

    function plugin3 () {
      return {
        name: 'plugin3',
        beforeInsert: async () => {},
        beforeSearch: async () => {},
      }
    }

    const db = await create({
      schema: {
        name: 'string',
      } as const,
      plugins: [
        plugin1(),
        plugin2(),
        plugin3()
      ]
    })

    const beforeInsertPlugins = getAllPluginsByHook(db, 'beforeInsert')
    const afterSearchPlugins = getAllPluginsByHook(db, 'afterSearch')

    t.equal(beforeInsertPlugins.length, 3)
    t.equal(afterSearchPlugins.length, 2)
  })

})

t.test('plugin', async t => {

  const data: string[] = []

  function loggerPlugin(): OramaPlugin {
    return {
      name: 'Logger',
      beforeInsert: async (orama, id, doc) => {
        data.push(`[Logger] beforeInsert: ${id} - ${JSON.stringify(doc)}`)
      },
      afterInsert: async (orama, id, doc) => {
        data.push(`[Logger] afterInsert: ${id} - ${JSON.stringify(doc)}`)
      },
      beforeSearch: async (orama, query) => {
        data.push(`[Logger] beforeSearch: ${JSON.stringify(query)}`)
      },
      afterSearch: async (orama, query, result) => {
        data.push(`[Logger] afterSearch: ${JSON.stringify(query)} - ${JSON.stringify(result)}`)
      }
    }
  }

  t.test('should run all the hooks of a plugin', async t => {

    const db = await create({
      id: 'orama-1',
      schema: {
        id: 'string',
        name: 'string',
      } as const,
      plugins: [
        loggerPlugin()
      ]
    })

    await insert(db, {
      id: '1',
      name: 'John Doe'
    })

    await search(db, { term: 'john' })

    t.equal(data[0], '[Logger] beforeInsert: 1 - {"id":"1","name":"John Doe"}')
    t.equal(data[1], '[Logger] afterInsert: 1 - {"id":"1","name":"John Doe"}')
    t.equal(data[2], '[Logger] beforeSearch: {"term":"john","relevance":{"k":1.2,"b":0.75,"d":0.5}}')
    t.equal(data[3], '[Logger] afterSearch: {"term":"john","relevance":{"k":1.2,"b":0.75,"d":0.5}} - undefined')

    console.log(data)
    t.end()
  })

  t.end()
})