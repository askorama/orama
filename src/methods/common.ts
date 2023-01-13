import * as ERRORS from "../errors.js";
import type { Lyra, PropertiesSchema, ResolveSchema } from "../types.js";
import type { SearchParams } from "./search.js";

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
    if (!(key in schema)) {
      continue;
    }

    const propType = typeof newDoc[key];

    if (propType === "object") {
      recursiveCheckDocSchema(newDoc[key] as ResolveSchema<S>, schema);
    } else if (typeof newDoc[key] !== schema[key]) {
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
