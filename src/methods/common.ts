import { isSerializable } from "../utils.js";
import * as ERRORS from "../errors.js";
import type { Lyra, PropertiesSchema, ResolveSchema } from "../types/index.js";
import type { SearchParams } from "./search.js";
import { SUPPORTED_PROPERTY_TYPES } from "../constants.js";

export function assertDocSchema<S extends PropertiesSchema>(doc: ResolveSchema<S>, lyraSchema: PropertiesSchema) {
  if (!recursiveCheckDocSchema(doc, lyraSchema)) {
    throw new Error(ERRORS.INVALID_DOC_SCHEMA(lyraSchema, doc));
  }
}

export function recursiveCheckDocSchema<S extends PropertiesSchema>(
  newDoc: ResolveSchema<S>,
  schema: PropertiesSchema,
): boolean {
  for (const key in newDoc) {
    if (!(key in schema) || typeof schema[key] == "undefined") {
      if (!isSerializable(newDoc[key])) {
        return false;
      }

      continue;
    }

    const propType = typeof newDoc[key];
    const schemaType = typeof schema[key] == "object" ? "object" : schema[key];

    if (schemaType == propType) {
      if (propType === "object") {
        return isSerializable(newDoc[key])
          ? recursiveCheckDocSchema(newDoc[key] as ResolveSchema<S>, schema[key] as PropertiesSchema)
          : false;
      } else if (!SUPPORTED_PROPERTY_TYPES.includes(propType) || propType !== schema[key]) {
        return false;
      }
    } else {
      return false;
    }
  }

  return true;
}

export function getIndices<S extends PropertiesSchema>(
  lyra: Lyra<S>,
  indices: SearchParams<S>["properties"],
): string[] {
  const knownIndices = Object.keys(lyra.index);

  if (!indices) {
    return knownIndices;
  }

  if (typeof indices === "string") {
    if (indices !== "*") {
      throw new Error(ERRORS.INVALID_PROPERTY(indices, knownIndices));
    }
    return knownIndices;
  }

  for (const index of indices as string[]) {
    if (!knownIndices.includes(index)) {
      throw new Error(ERRORS.INVALID_PROPERTY(index, knownIndices));
    }
  }

  return indices as string[];
}
