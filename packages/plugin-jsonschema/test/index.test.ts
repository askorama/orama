import * as t from 'tap'
import { fromJsonSchema } from '../src/index.js'

t.test('convert sample schema', t => {
  t.plan(1)
  const jsonschema = {
    type: 'object',
    properties: {
      resource_kind: { type: 'string' },
      resource_uri: { type: 'string' },
      resource_id: { type: 'string' },
      data: {
        type: 'object',
        properties: {
          filed: { type: 'boolean' },
          barcode: { type: 'string' },
          category: { type: 'string' },
          date: { type: 'string' },
          description: { type: 'string' },
          description_values: {
            type: 'object',
            properties: {
              made_up_date: { type: 'string' },
            },
          },
          links: {
            type: 'object',
            properties: {
              document_metadata: { type: 'string' },
              self: { type: 'string' },
            },
          },
          pages: { type: 'number' },
          transaction_id: { type: 'string' },
          type: { type: 'string' },
        },
      },
      event: {
        type: 'object',
        properties: {
          fields_changed: {
            type: 'array',
            items: { type: 'string' },
          },
          published_at: { type: 'string' },
          type: { type: 'string' },
        },
      },
    },
  }

  const oramaSchema = fromJsonSchema(jsonschema)

  const expected = {
    resource_kind: 'string',
    resource_uri: 'string',
    resource_id: 'string',
    data: {
      filed: 'boolean',
      barcode: 'string',
      category: 'string',
      date: 'string',
      description: 'string',
      description_values: {
        made_up_date: 'string',
      },
      links: {
        document_metadata: 'string',
        self: 'string',
      },
      pages: 'number',
      transaction_id: 'string',
      type: 'string',
    },
    event: {
      fields_changed: 'string[]',
      published_at: 'string',
      type: 'string',
    },
  }

  t.same(oramaSchema, expected)
})

t.test('should throw errors on invalid schemas', t => {
  t.plan(4)

  t.test('throw error for nested arrays', t => {
    t.plan(1)
    const jsonschema = {
      type: 'object',
      properties: {
        coOrdinates: {
          type: 'array',
          items: { type: 'array', items: { type: 'number' } },
        },
      },
    }
    t.throws(() => fromJsonSchema(jsonschema), Error)
  })
  t.test('throw error for array of objects', t => {
    t.plan(1)
    const jsonschema = {
      type: 'object',
      properties: {
        coOrdinates: {
          type: 'array',
          items: { type: 'object', properties: { x: { type: 'number' }, y: { type: 'number' } } },
        },
      },
    }
    t.throws(() => fromJsonSchema(jsonschema), Error)
  })
  t.test('throw error for non-object at top level', t => {
    t.plan(1)
    const jsonschema = {
      type: 'string',
    }
    t.throws(() => fromJsonSchema(jsonschema), Error)
  })
  t.test('throw error for unknown type', t => {
    t.plan(1)
    const jsonschema = {
      type: 'object',
      properties: {
        value: { type: 'unknown' },
      },
    }
    t.throws(() => fromJsonSchema(jsonschema), Error)
  })
})
