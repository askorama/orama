import { createError } from '../errors.js'
import { Document, ElapsedTime, Schema } from '../types.js'
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

    if (typeof type === 'string' && type.endsWith('[]')) {
      if (!Array.isArray(value)) {
        return false
      }
      const expectedType = type.slice(0, -2)

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
