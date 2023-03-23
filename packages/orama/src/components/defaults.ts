import { createError } from '../errors.js'
import { Document, ElapsedTime, Schema, SimpleComponents } from '../types.js'
import { getDocumentProperties, uniqueId, formatNanoseconds } from '../utils.js'

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
