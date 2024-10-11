import t from 'tap'
import { create, insertMultiple, load, save, search } from '@orama/orama'
import {qpsComponents} from '../src/index.js'

t.test('plugin-qps', async t => {
    const db = create({
        schema: {
            name: 'string',
            age: 'number',
            isCool: 'boolean',
            algo: 'string[]',
            preferredNumbers: 'number[]',
        } as const,
        components: {
            ...qpsComponents()
        }
    })

    await insertMultiple(db, [
        { name: 'foo foo foo', age: 33, isCool: true, algo: ['algo1', 'algo2'], preferredNumbers: [20] },
        { name: 'bar bar bar', age: 32, isCool: true, algo: ['algo3'], preferredNumbers: [55] },
        { name: 'baz baz baz', age: 22, isCool: false, algo: ['algo4'], preferredNumbers: [22] }
    ])

    const result = await search(db, {
        term: 'b'
    })

    t.equal(result.count, 2)

    const dump = await save(db)
    const restored = JSON.parse(JSON.stringify(dump))

    const db2 = create({
        schema: {
            name: 'string',
            age: 'number',
            isCool: 'boolean',
            algo: 'string[]',
            preferredNumbers: 'number[]',
        } as const,
        components: {
            ...qpsComponents()
        }
    })
    await load(db2, restored)

    const result2 = await search(db, {
        term: 'b'
    })
    t.equal(result2.count, 2)
})