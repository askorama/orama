import type { Schema } from '@orama/orama';
import type { JSONSchema4 } from 'json-schema';

const assertTypeObject = (jsonSchema: JSONSchema4) => {
    if (jsonSchema.type !== 'object') {
        throw new Error('Provided JSON schema must be an object type');
    }
}

const ORAMA_SUPPORTED_TYPES: Set<JSONSchema4['type']> = new Set(['string', 'number', 'boolean'])

const isArraySupportedByOrama = (jsonSchema: JSONSchema4) => {
    if (jsonSchema.type === 'array' && jsonSchema.items && !Array.isArray(jsonSchema.items)) {
        return ORAMA_SUPPORTED_TYPES.has(jsonSchema.items.type);
    }
    return false
}

const isSupportedByOrama = (jsonSchema: JSONSchema4) => {
    return ORAMA_SUPPORTED_TYPES.has(jsonSchema.type) || isArraySupportedByOrama(jsonSchema);
}

const extractOramaType = (jsonSchema: JSONSchema4) => {
    return ORAMA_SUPPORTED_TYPES.has(jsonSchema.type) ? jsonSchema.type : `${(jsonSchema.items as JSONSchema4)!.type}[]`
}

export const schemaFromJson = (jsonSchema: JSONSchema4) => {
    assertTypeObject(jsonSchema)

    const oramaSchema: Schema = {}

    for (const [propertyName, propertyDefinition] of Object.entries(jsonSchema.properties || {})) {
        if (isSupportedByOrama(propertyDefinition)) {
            oramaSchema[propertyName] = extractOramaType(propertyDefinition)
        }
    }

    return oramaSchema;
}