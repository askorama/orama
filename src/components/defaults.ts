import { createError } from "../errors.js";
import { Document, Schema, SimpleComponents } from "../types.js";
import { getDocumentProperties, uniqueId } from "../utils.js";

function validateSchema<S extends Schema>(doc: Document, schema: S): boolean {
  for (const [prop, type] of Object.entries(schema)) {
    if (typeof type === "object") {
      if (!doc[prop] || (typeof doc[prop] !== "object" && Array.isArray(doc[prop]))) {
        return false;
      }

      if (!validateSchema(doc[prop] as Document, type)) {
        return false;
      }
    }

    if (typeof doc[prop] !== type) {
      return false;
    }
  }

  return true;
}

export function getDefaultComponents(): SimpleComponents {
  return {
    validateSchema,
    getDocumentIndexId(doc: Document): string {
      if (doc.id) {
        if (typeof doc.id !== "string") {
          throw createError("DOCUMENT_ID_MUST_BE_STRING", typeof doc.id);
        }

        return doc.id;
      }

      return uniqueId();
    },
    getDocumentProperties,
    formatElapsedTime(n: bigint): bigint {
      return n;
    },
  };
}
