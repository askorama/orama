import t from 'tap'
import { schemaFromJson } from '../src/index.js'

t.test("it should throw for non-object json schema", async t => {
    const jsonSchema = {
        type: 'array',
        items: {
            type: 'string'
        }
    } as const

    t.throws(() => schemaFromJson(jsonSchema), Error, 'Provided JSON schema must be an object type');
})

t.test("it should convert type string", async t => {
    const jsonSchema = {
        type: 'object',
        properties: {
            myString: {
                type: 'string'
            }
        }
    } as const

    const oramaSchema = schemaFromJson(jsonSchema)

    t.same(oramaSchema, {
        myString: 'string'
    })
})

t.test("it should convert type number", async t => {
    const jsonSchema = {
        type: 'object',
        properties: {
            myNumber: {
                type: 'number'
            }
        }
    } as const

    const oramaSchema = schemaFromJson(jsonSchema)

    t.same(oramaSchema, {
        myNumber: 'number'
    })
})


t.test("it should convert type boolean", async t => {
    const jsonSchema = {
        type: 'object',
        properties: {
            myBoolean: {
                type: 'boolean'
            }
        }
    } as const

    const oramaSchema = schemaFromJson(jsonSchema)

    t.same(oramaSchema, {
        myBoolean: 'boolean'
    })
})

t.test("it should convert all types", async t => {
    const jsonSchema = {
        type: 'object',
        properties: {
            myString: {
                type: 'string'
            },
            myNumber: {
                type: 'number'
            },
            myBoolean: {
                type: 'boolean'
            }
        }
    } as const

    const oramaSchema = schemaFromJson(jsonSchema)

    t.same(oramaSchema, {
        myString: 'string',
        myNumber: 'number',
        myBoolean: 'boolean'
    })
})