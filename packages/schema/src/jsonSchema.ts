import type { Schema, SearchableType } from '@orama/orama';
import type { JSONSchema4 } from 'json-schema';

const isJsonObject = (jsonSchema: JSONSchema4) => jsonSchema.type === 'object'

const assertTypeObject = (jsonSchema: JSONSchema4) => {
    if (!isJsonObject(jsonSchema)) {
        throw new Error('Provided JSON schema must be an object type');
    }
}

const ORAMA_SUPPORTED_TYPES: Set<JSONSchema4['type']> = new Set(['string', 'number', 'boolean'])

const isArraySupportedByOrama = (jsonSchema: JSONSchema4): boolean => {
    if (jsonSchema.type === 'array' && jsonSchema.items && !Array.isArray(jsonSchema.items)) {
        return ORAMA_SUPPORTED_TYPES.has(jsonSchema.items.type);
    }
    return false
}

const isSupportedByOrama = (jsonSchema: JSONSchema4): boolean => {
    return ORAMA_SUPPORTED_TYPES.has(jsonSchema.type) || isArraySupportedByOrama(jsonSchema);
}

const extractOramaType = (jsonSchema: JSONSchema4): SearchableType => {
    const oramaType = ORAMA_SUPPORTED_TYPES.has(jsonSchema.type) ? jsonSchema.type : `${(jsonSchema.items as JSONSchema4)!.type}[]`

    return oramaType as SearchableType
}

export const schemaFromJson = async (jsonSchema: JSONSchema4): Promise<Schema> => {
    assertTypeObject(jsonSchema)

    const oramaSchema: Schema = {}

    for (const [propertyName, propertyDefinition] of Object.entries(jsonSchema.properties || {})) {
        if (isSupportedByOrama(propertyDefinition)) {
            oramaSchema[propertyName] = extractOramaType(propertyDefinition)
        } else if (isJsonObject(propertyDefinition)) {
            oramaSchema[propertyName] = await schemaFromJson(propertyDefinition)
        }
    }

    return Promise.resolve(oramaSchema);
}