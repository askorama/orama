import { defaultTokenizerConfig } from "../tokenizer/index.js";
import * as ERRORS from "../errors.js";
import { removeDocumentByWord } from "../radix-tree/radix.js";
import type { Lyra, PropertiesSchema, ResolveSchema } from "../types.js";
import { hookRunner } from "./hooks.js";

/**
 * Removes a document from a database.
 * @param lyra The database to remove the document from.
 * @param docID The id of the document to remove.
 * @example
 * const isDeleted = await remove(db, 'L1tpqQxc0c2djrSN2a6TJ');
 */
export async function remove<S extends PropertiesSchema>(lyra: Lyra<S>, docID: string): Promise<boolean> {
  if (!lyra.components?.tokenizer) {
    lyra.components = {
      ...(lyra.components ?? {}),
      tokenizer: defaultTokenizerConfig(lyra.defaultLanguage),
    };
  }

  if (!(docID in lyra.docs)) {
    throw new Error(ERRORS.DOC_ID_DOES_NOT_EXISTS(docID));
  }

  const document = lyra.docs[docID] || ({} as Record<string, ResolveSchema<S>>);
  const documentKeys = Object.keys(document || {});

  const documentKeysLength = documentKeys.length;
  for (let i = 0; i < documentKeysLength; i++) {
    const key = documentKeys[i];

    const propertyType = lyra.schema[key];

    if (propertyType === "string") {
      const idx = lyra.index[key];
      const tokens: string[] = lyra.components.tokenizer!.tokenizerFn!(
        document[key] as string,
        lyra.defaultLanguage,
        false,
        lyra.components.tokenizer!,
      )!;

      const tokensLength = tokens.length;
      for (let k = 0; k < tokensLength; k++) {
        const token = tokens[k];
        delete lyra.frequencies[key][docID];
        lyra.tokenOccurrencies[key][token]--;
        if (token && !removeDocumentByWord(idx, token, docID)) {
          throw new Error(ERRORS.CANT_DELETE_DOCUMENT(docID, key, token));
        }
      }
    }
  }

  lyra.docs[docID] = undefined;
  lyra.docsCount--;

  if (lyra.hooks.afterRemove) {
    await hookRunner.call(lyra, lyra.hooks.afterRemove, docID);
  }

  return true;
}
