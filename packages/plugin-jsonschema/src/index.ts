type ScalarType = 'string' | 'number' | 'boolean'
type ValueType = ScalarType | `${ScalarType}[]` | TransformedSchema
interface TransformedSchema {
  [key: string]: ValueType
}

function getOramaType(jsonSchema): ValueType {
  switch (jsonSchema.type) {
    case 'string':
    case 'date':
      return 'string'
    case 'number':
    case 'integer':
      return 'number'
    case 'boolean':
      return 'boolean'
    case 'array':
      if (jsonSchema.items.type === 'object') throw new Error("Can't convert arrays of objects")
      if (jsonSchema.items.type === 'array') throw new Error("Can't convert arrays of arrays")
      return `${getOramaType(jsonSchema.items)}[]` as `${ScalarType}[]`
    case 'object': {
      const transformedSchema: TransformedSchema = {}
      for (const key in jsonSchema.properties) {
        transformedSchema[key] = getOramaType(jsonSchema.properties[key])
      }
      return transformedSchema
    }
    default:
      throw new Error("Can't convert type " + jsonSchema.type)
  }
}

export function fromJsonSchema(schema): TransformedSchema {
  if (!schema || typeof schema !== 'object' || schema.type !== 'object') {
    throw new Error('JSON schema must have top level type object')
  }
  return getOramaType(schema) as TransformedSchema
}
