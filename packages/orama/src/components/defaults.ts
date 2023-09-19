import { createError } from '../errors.js'
import {
  AnyDocument,
  AnyOrama,
  ArraySearchableType,
  ElapsedTime,
  ScalarSearchableType,
  SearchableType,
  TypedDocument,
  Vector
} from '../types.js'
import { formatNanoseconds, uniqueId } from '../utils.js'

export { getDocumentProperties } from '../utils.js'

export async function formatElapsedTime(n: bigint): Promise<ElapsedTime> {
  return {
    raw: Number(n),
    formatted: await formatNanoseconds(n),
  }
}

export async function getDocumentIndexId(doc: AnyDocument): Promise<string> {
  if (doc.id) {
    if (typeof doc.id !== 'string') {
      throw createError('DOCUMENT_ID_MUST_BE_STRING', typeof doc.id)
    }

    return doc.id
  }

  return await uniqueId()
}

export async function validateSchema<T extends AnyOrama, ResultDocument extends TypedDocument<T>>(
  doc: ResultDocument,
  schema: T['schema'],
): Promise<string | undefined> {
  for (const [prop, type] of Object.entries(schema)) {
    const value = doc[prop]

    if (typeof value === 'undefined') {
      continue
    }

    if (type === 'enum' && (typeof value === 'string' || typeof value === 'number')) {
      continue
    }
    if (type === 'enum[]' && Array.isArray(value)) {
      const valueLength = value.length
      for (let i = 0; i < valueLength; i++) {
        if (typeof value[i] !== 'string' && typeof value[i] !== 'number') {
          return prop + '.' + i
        }
      }
      continue
    }

    if (isVectorType(type)) {
      const vectorSize = getVectorSize(type)
      if (!Array.isArray(value) || value.length !== vectorSize) {
        throw createError('INVALID_INPUT_VECTOR', prop, vectorSize, value.length)
      }
      continue
    }

    if (isArrayType(type)) {
      if (!Array.isArray(value)) {
        return prop
      }
      const expectedType = getInnerType(type)

      const valueLength = value.length
      for (let i = 0; i < valueLength; i++) {
        if (typeof value[i] !== expectedType) {
          return prop + '.' + i
        }
      }

      continue
    }

    if (typeof type === 'object') {
      if (!value || typeof value !== 'object') {
        return prop
      }

      // using as ResultDocument is not exactly right but trying to be type-safe here is not useful
      const subProp = await validateSchema(value as ResultDocument, type)
      if (subProp) {
        return prop + '.' + subProp
      }
      continue
    }

    if (typeof value !== type) {
      return prop
    }
  }

  return undefined
}

const IS_ARRAY_TYPE: Record<SearchableType, boolean> = {
  string: false,
  number: false,
  boolean: false,
  enum: false,
  'string[]': true,
  'number[]': true,
  'boolean[]': true,
  'enum[]': true,
}

const INNER_TYPE: Record<ArraySearchableType, ScalarSearchableType> = {
  'string[]': 'string',
  'number[]': 'number',
  'boolean[]': 'boolean',
  'enum[]': 'enum',
}

export function isVectorType(type: unknown): type is Vector {
  return typeof type === 'string' && /^vector\[\d+\]$/.test(type)
}

export function isArrayType(type: unknown): type is ArraySearchableType {
  return typeof type === 'string' && IS_ARRAY_TYPE[type]
}

export function getInnerType(type: ArraySearchableType): ScalarSearchableType {
  return INNER_TYPE[type]
}

export function getVectorSize(type: string): number {
  const size = Number(type.slice(7, -1))

  switch (true) {
    case isNaN(size):
      throw createError('INVALID_VECTOR_VALUE', type)
    case size <= 0:
      throw createError('INVALID_VECTOR_SIZE', type)
    default:
      return size
  }
}
