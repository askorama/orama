import { runMultipleHook, runSingleHook } from "../components/hooks.js";
import { trackRemoval } from "../components/sync-blocking-checker.js";
import { createError } from "../errors.js";
import { Lyra, OpaqueDocumentStore, OpaqueIndex, Schema } from "../types.js";

export async function remove<S extends Schema, I extends OpaqueIndex, D extends OpaqueDocumentStore>(
  lyra: Lyra<S, I, D>,
  id: string,
  language?: string,
  skipHooks?: boolean,
): Promise<boolean> {
  let result = true;
  const { index, docs } = lyra.data;

  const doc = await lyra.documentsStore.get(docs, id);
  if (!doc) {
    throw createError("DOCUMENT_DOES_NOT_EXIST", id);
  }

  const docsCount = await lyra.documentsStore.count(docs);

  if (!skipHooks) {
    await runSingleHook(lyra.beforeRemove, lyra, id);
  }

  const indexableProperties = await lyra.index.getSearchableProperties(index);
  const values = await lyra.getDocumentProperties(doc, indexableProperties);

  for (const prop of indexableProperties) {
    const value = values[prop];
    await lyra.index.beforeRemove?.(lyra.data.index, prop, id, value, language, lyra.tokenizer, docsCount);
    if (!(await lyra.index.remove(lyra.data.index, prop, id, value, language, lyra.tokenizer, docsCount))) {
      result = false;
    }
    await lyra.index.afterRemove?.(lyra.data.index, prop, id, value, language, lyra.tokenizer, docsCount);
  }

  if (!skipHooks) {
    await runSingleHook(lyra.afterRemove, lyra, id);
  }

  trackRemoval(lyra);
  return result;
}

export async function removeMultiple<S extends Schema, I extends OpaqueIndex, D extends OpaqueDocumentStore>(
  lyra: Lyra<S, I, D>,
  ids: string[],
  batchSize?: number,
  language?: string,
  skipHooks?: boolean,
): Promise<boolean> {
  let result = true;

  if (!batchSize) {
    batchSize = 1000;
  }

  if (!skipHooks) {
    await runMultipleHook(lyra.beforeMultipleRemove, lyra, ids);
  }

  await new Promise<void>((resolve, reject) => {
    let i = 0;
    async function _insertMultiple() {
      const batch = ids.slice(i * batchSize!, (i + 1) * batchSize!);
      i++;

      if (!batch.length) {
        return resolve();
      }

      for (const doc of batch) {
        try {
          if (!(await remove(lyra, doc, language, skipHooks))) {
            result = false;
          }
        } catch (err) {
          reject(err);
        }
      }

      setTimeout(_insertMultiple, 0);
    }

    setTimeout(_insertMultiple, 0);
  });

  if (!skipHooks) {
    await runMultipleHook(lyra.afterMultipleRemove, lyra, ids);
  }

  return result;
}
