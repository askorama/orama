import t from 'tap'
import { create, insertMultiple, search } from '@orama/orama'

t.test('plugin-qps', async t => {
    const db = create({
        schema: {
            name: 'string',
            age: 'number',
            isCool: 'boolean',
            algo: 'string[]',
            preferredNumbers: 'number[]',
        } as const
    })

    insertMultiple(db, [
        { name: 'foo', age: 33, isCool: true, algo: ['algo1', 'algo2'], preferredNumbers: [20] },
        { name: 'bar', age: 32, isCool: true, algo: ['algo3'], preferredNumbers: [55] },
        { name: 'baz', age: 22, isCool: false, algo: ['algo4'], preferredNumbers: [22] }
    ])

    const result = search(db, {
        term: 'b'
    })
    console.log(result)
})