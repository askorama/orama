import t from 'tap';
import { schemaFromJson } from '../src/index.js';

t.test("it should throw for non-object json schema", async t => {
    const jsonSchema = {
        type: 'array',
        items: {
            type: 'string'
        }
    } as const

    t.throws(() => schemaFromJson(jsonSchema), Error, 'Provided JSON schema must be an object type');
})

t.test("it should return empty object for missing properties", async t => {
    const jsonSchema = {
        type: 'object',
    } as const

    const oramaSchema = schemaFromJson(jsonSchema)

    t.same(oramaSchema, {})
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

t.test("it should convert type string[]", async t => {
    const jsonSchema = {
        type: 'object',
        properties: {
            myStringArray: {
                type: 'array',
                items: {
                    type: 'string'
                }
            }
        }
    } as const

    const oramaSchema = schemaFromJson(jsonSchema)

    t.same(oramaSchema, {
        myStringArray: 'string[]'
    })
})

t.test("it should convert type number[]", async t => {
    const jsonSchema = {
        type: 'object',
        properties: {
            myNumberArray: {
                type: 'array',
                items: {
                    type: 'number'
                }
            }
        }
    } as const

    const oramaSchema = schemaFromJson(jsonSchema)

    t.same(oramaSchema, {
        myNumberArray: 'number[]'
    })
})

t.test("it should convert type boolean[]", async t => {
    const jsonSchema = {
        type: 'object',
        properties: {
            myBooleanArray: {
                type: 'array',
                items: {
                    type: 'boolean'
                }
            }
        }
    } as const

    const oramaSchema = schemaFromJson(jsonSchema)

    t.same(oramaSchema, {
        myBooleanArray: 'boolean[]'
    })
})

t.test("it should convert type array", async t => {
    const jsonSchema = {
        type: 'object',
        properties: {
            myStringArray: {
                type: 'array',
                items: {
                    type: 'string'
                }
            },
            myNumberArray: {
                type: 'array',
                items: {
                    type: 'number'
                }
            },
            myBooleanArray: {
                type: 'array',
                items: {
                    type: 'boolean'
                }
            }
        }
    } as const

    const oramaSchema = schemaFromJson(jsonSchema)

    t.same(oramaSchema, {
        myStringArray: 'string[]',
        myNumberArray: 'number[]',
        myBooleanArray: 'boolean[]'
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
            },
            myStringArray: {
                type: 'array',
                items: {
                    type: 'string'
                }
            },
            myNumberArray: {
                type: 'array',
                items: {
                    type: 'number'
                }
            },
            myBooleanArray: {
                type: 'array',
                items: {
                    type: 'boolean'
                }
            }
        }
    } as const

    const oramaSchema = schemaFromJson(jsonSchema)

    t.same(oramaSchema, {
        myString: 'string',
        myNumber: 'number',
        myBoolean: 'boolean',
        myStringArray: 'string[]',
        myNumberArray: 'number[]',
        myBooleanArray: 'boolean[]'
    })
})

t.test("it should skip unknown types", async t => {
    const jsonSchema = {
        type: 'object',
        properties: {
            myBoolean: {
                type: 'boolean'
            },
            myAny: {
                type: 'any'
            }
        }
    } as const

    const oramaSchema = schemaFromJson(jsonSchema)

    t.same(oramaSchema, {
        myBoolean: 'boolean'
    })
})

t.test("it should convert nested objects", async t => {
    const jsonSchema = {
        type: 'object',
        properties: {
            myBoolean: {
                type: 'boolean'
            },
            myObject: {
                type: 'object',
                properties: {
                    myString: {
                        type: 'string'
                    }
                }
            }
        }
    } as const

    const oramaSchema = schemaFromJson(jsonSchema)

    t.same(oramaSchema, {
        myBoolean: 'boolean',
        myObject: {
            myString: 'string'
        }
    })
})