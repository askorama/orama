import { createError } from '../errors.js'
import { formatNanoseconds, uniqueId } from '../utils.js'
export { getDocumentProperties } from '../utils.js'
export function formatElapsedTime(n) {
  return {
    raw: Number(n),
    formatted: formatNanoseconds(n)
  }
}
export function getDocumentIndexId(doc) {
  if (doc.id) {
    if (typeof doc.id !== 'string') {
      throw createError('DOCUMENT_ID_MUST_BE_STRING', typeof doc.id)
    }
    return doc.id
  }
  return uniqueId()
}
export function validateSchema(doc, schema) {
  for (const [prop, type] of Object.entries(schema)) {
    const value = doc[prop]
    if (typeof value === 'undefined') {
      continue
    }
    if (
      type === 'geopoint' &&
      typeof value === 'object' &&
      typeof value.lon === 'number' &&
      typeof value.lat === 'number'
    ) {
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
      const subProp = validateSchema(value, type)
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
const IS_ARRAY_TYPE = {
  string: false,
  number: false,
  boolean: false,
  enum: false,
  geopoint: false,
  'string[]': true,
  'number[]': true,
  'boolean[]': true,
  'enum[]': true
}
const INNER_TYPE = {
  'string[]': 'string',
  'number[]': 'number',
  'boolean[]': 'boolean',
  'enum[]': 'enum'
}
export function isGeoPointType(type) {
  return type === 'geopoint'
}
export function isVectorType(type) {
  return typeof type === 'string' && /^vector\[\d+\]$/.test(type)
}
export function isArrayType(type) {
  return typeof type === 'string' && IS_ARRAY_TYPE[type]
}
export function getInnerType(type) {
  return INNER_TYPE[type]
}
export function getVectorSize(type) {
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
//# sourceMappingURL=defaults.js.map
