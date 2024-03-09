import t from 'tap'
import {
  OramaPlugin,
  create,
  search,
  insert,
  insertMultiple,
  remove,
  update,
  removeMultiple,
  updateMultiple
} from '../src/index.ts'
import { getAllPluginsByHook } from '../src/components/plugins.ts'

t.test('getAllPluginsByHook', async (t) => {
  t.plan(1)

  t.test('should return all the plugins that includes a given hook name', async (t) => {
    t.plan(2)

    function plugin1() {
      return {
        name: 'plugin1',
        beforeInsert: async () => {},
        afterInsert: async () => {},
        beforeSearch: async () => {},
        afterSearch: async () => {}
      }
    }

    function plugin2() {
      return {
        name: 'plugin2',
        beforeInsert: async () => {},
        afterInsert: async () => {},
        beforeSearch: async () => {},
        afterSearch: async () => {}
      }
    }

    function plugin3() {
      return {
        name: 'plugin3',
        beforeInsert: async () => {},
        beforeSearch: async () => {}
      }
    }

    const db = await create({
      schema: {
        name: 'string'
      } as const,
      plugins: [plugin1(), plugin2(), plugin3()]
    })

    const beforeInsertPlugins = await getAllPluginsByHook(db, 'beforeInsert')
    const afterSearchPlugins = await getAllPluginsByHook(db, 'afterSearch')

    t.equal(beforeInsertPlugins.length, 3)
    t.equal(afterSearchPlugins.length, 2)
  })
})

t.only('plugin', async (t) => {
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
      },
      beforeInsertMultiple: async (orama, docs) => {
        data.push(`[Logger] beforeInsertMultiple: ${JSON.stringify(docs)}`)
      },
      afterInsertMultiple: async (orama, docs) => {
        data.push(`[Logger] afterInsertMultiple: ${JSON.stringify(docs)}`)
      },
      beforeRemove: async (orama, id) => {
        data.push(`[Logger] beforeRemove: ${id}`)
      },
      afterRemove: async (orama, id) => {
        data.push(`[Logger] afterRemove: ${id}`)
      },
      beforeUpdate(orama, id) {
        data.push(`[Logger] beforeUpdate: ${id}`)
      },
      afterUpdate() {
        data.push(`[Logger] afterUpdate`)
      },
      beforeRemoveMultiple(orama, ids) {
        data.push(`[Logger] beforeRemoveMultiple: ${ids}`)
      },
      afterRemoveMultiple(orama, ids) {
        data.push(`[Logger] afterRemoveMultiple: ${ids}`)
      },
      beforeUpdateMultiple(orama, ids) {
        data.push(`[Logger] beforeUpdateMultiple: ${ids}`)
      },
      afterUpdateMultiple() {
        data.push(`[Logger] afterUpdateMultiple`)
      }
    }
  }

  t.only('should run all the hooks of a plugin', async (t) => {
    const db = await create({
      id: 'orama-1',
      schema: {
        id: 'string',
        name: 'string'
      } as const,
      plugins: [loggerPlugin()]
    })

    await insert(db, {
      id: '1',
      name: 'John Doe'
    })

    await search(db, { term: 'john' })

    await insertMultiple(db, [
      {
        id: '2',
        name: 'Jane Doe'
      },
      {
        id: '3',
        name: 'Jim Doe'
      }
    ])

    await remove(db, '1')
    await update(db, '2', { name: 'Jasmine Doe' })

    await removeMultiple(db, ['2', '3'])

    await insertMultiple(db, [
      { id: '4', name: 'Foo Bar' },
      { id: '5', name: 'Bar Baz' }
    ])

    await updateMultiple(db, ['4', '5'], [{ name: 'Foo Bar Baz' }, { name: 'Bar Baz Foo' }])

    t.equal(data[0], '[Logger] beforeInsert: 1 - {"id":"1","name":"John Doe"}')
    t.equal(data[1], '[Logger] afterInsert: 1 - {"id":"1","name":"John Doe"}')
    t.equal(data[2], '[Logger] beforeSearch: {"term":"john"}')
    t.equal(data[3], '[Logger] afterSearch: {"term":"john","relevance":{"k":1.2,"b":0.75,"d":0.5}} - undefined')
    t.equal(data[4], '[Logger] beforeInsertMultiple: [{"id":"2","name":"Jane Doe"},{"id":"3","name":"Jim Doe"}]')
    t.equal(data[9], '[Logger] afterInsertMultiple: [{"id":"2","name":"Jane Doe"},{"id":"3","name":"Jim Doe"}]')
    t.equal(data[10], '[Logger] beforeRemove: 1')
    t.equal(data[11], '[Logger] afterRemove: 1')
    t.equal(data[12], '[Logger] beforeUpdate: 2')
    t.equal(data[17], '[Logger] afterUpdate')
    t.equal(data[18], '[Logger] beforeRemoveMultiple: 2,3')
    t.equal(data[21], '[Logger] afterRemoveMultiple: 2,3')
    t.equal(data[22], '[Logger] beforeInsertMultiple: [{"id":"4","name":"Foo Bar"},{"id":"5","name":"Bar Baz"}]')
    t.equal(data[29], '[Logger] beforeRemoveMultiple: 4,5')
    t.equal(data[40], '[Logger] afterUpdateMultiple')

    t.end()
  })

  t.end()
})
