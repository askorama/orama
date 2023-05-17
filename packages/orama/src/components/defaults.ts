import { createError } from '../errors.js'
import { ArraySearchableType, Document, ElapsedTime, ScalarSearchableType, Schema, SearchableType } from '../types.js'
import { uniqueId, formatNanoseconds } from '../utils.js'

export { getDocumentProperties } from '../utils.js'

export async function formatElapsedTime(n: bigint): Promise<ElapsedTime> {
  return {
    raw: Number(n),
    formatted: await formatNanoseconds(n),
  }
}

export async function getDocumentIndexId(doc: Document): Promise<string> {
  if (doc.id) {
    if (typeof doc.id !== 'string') {
      throw createError('DOCUMENT_ID_MUST_BE_STRING', typeof doc.id)
    }

    return doc.id
  }

  return await uniqueId()
}

export async function validateSchema<S extends Schema = Schema>(doc: Document, schema: S): Promise<boolean> {
  for (const [prop, type] of Object.entries(schema)) {
    const value = doc[prop]

    if (typeof type === 'string' && isArrayType(type)) {
      if (!Array.isArray(value)) {
        return false
      }
      const expectedType = getInnerType(type as ArraySearchableType)

      const valueLength = value.length
      for (let i = 0; i < valueLength; i++) {
        if (typeof value[i] !== expectedType) {
          return false
        }
      }

      continue
    }

    if (typeof type === 'object') {
      if (!value || typeof value !== 'object') {
        return false
      }

      if (!validateSchema(value as Document, type)) {
        return false
      }
    }

    if (typeof value !== type) {
      return false
    }
  }

  return true
}

const IS_ARRAY_TYPE: Record<SearchableType, boolean> = {
  'string': false,
  'number': false,
  'boolean': false,
  'string[]': true,
  'number[]': true,
  'boolean[]': true,
}
const INNER_TYPE: Record<ArraySearchableType, ScalarSearchableType> = {
  'string[]': 'string',
  'number[]': 'number',
  'boolean[]': 'boolean',
}
export function isArrayType(type: SearchableType) {
  return IS_ARRAY_TYPE[type]
}
export function getInnerType(type: ArraySearchableType): ScalarSearchableType {
  return INNER_TYPE[type]
}
