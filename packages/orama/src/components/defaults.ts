import { createError } from '../errors.js'
import { Document, ElapsedTime, Schema, SimpleComponents } from '../types.js'
import { getDocumentProperties, uniqueId, formatNanoseconds } from '../utils.js'

export { getDocumentProperties } from '../utils.js'

export function formatElapsedTime(n: bigint): ElapsedTime {
  return {
    raw: Number(n),
    formatted: formatNanoseconds(n),
  }
}

export function getDocumentIndexId(doc: Document): string {
  if (doc.id) {
    if (typeof doc.id !== 'string') {
      throw createError('DOCUMENT_ID_MUST_BE_STRING', typeof doc.id)
    }

    return doc.id
  }

  return uniqueId()
}

export function validateSchema<S extends Schema = Schema>(doc: Document, schema: S): boolean {
  for (const [prop, type] of Object.entries(schema)) {
    if (typeof type === 'object') {
      if (!doc[prop] || (typeof doc[prop] !== 'object' && Array.isArray(doc[prop]))) {
        return false
      }

      if (!validateSchema(doc[prop] as Document, type)) {
        return false
      }
    }

    if (typeof doc[prop] !== type) {
      return false
    }
  }

  return true
}

export function getDefaultComponents(): SimpleComponents {
  return {
    formatElapsedTime,
    getDocumentIndexId,
    getDocumentProperties,
    validateSchema,
  }
}
