import { runMultipleHook, runSingleHook } from "../components/hooks.js";
import { createError } from "../errors.js";
import { trackInsertion } from "../components/sync-blocking-checker.js";
import { Document, Schema, OpaqueIndex, OpaqueDocumentStore, Lyra } from "../types.js";

export async function insert<S extends Schema, I extends OpaqueIndex, D extends OpaqueDocumentStore>(
  lyra: Lyra<S, I, D>,
  doc: Document,
  language?: string,
  skipHooks?: boolean,
): Promise<string> {
  await lyra.validateSchema(doc, lyra.schema);
  const { index, docs } = lyra.data;

  const id = await lyra.getDocumentIndexId(doc);

  if (typeof id !== "string") {
    throw createError("DOCUMENT_ID_MUST_BE_STRING", typeof id);
  }

  if (!(await lyra.documentsStore.store(docs, id, doc))) {
    throw createError("DOCUMENT_ALREADY_EXISTS", id);
  }

  const docsCount = await lyra.documentsStore.count(docs);

  if (!skipHooks) {
    await runSingleHook(lyra.beforeInsert, lyra, id, doc);
  }

  const indexableProperties = await lyra.index.getSearchableProperties(index);
  const indexablePropertiesWithTypes = await lyra.index.getSearchablePropertiesWithTypes(index);
  const values = await lyra.getDocumentProperties(doc, indexableProperties);

  for (const [key, value] of Object.entries(values)) {
    if (typeof value === "undefined") {
      continue;
    }

    const actualType = typeof value;
    const expectedType = indexablePropertiesWithTypes[key];

    if (actualType !== expectedType) {
      throw createError("INVALID_DOCUMENT_PROPERTY", key, expectedType, actualType);
    }
  }

  for (const prop of indexableProperties) {
    const value = values[prop];

    if (typeof value === "undefined") {
      continue;
    }

    await lyra.index.beforeInsert?.(lyra.data.index, prop, id, value, language, lyra.tokenizer, docsCount);
    await lyra.index.insert(lyra.data.index, prop, id, value, language, lyra.tokenizer, docsCount);
    await lyra.index.afterInsert?.(lyra.data.index, prop, id, value, language, lyra.tokenizer, docsCount);
  }

  if (!skipHooks) {
    await runSingleHook(lyra.afterInsert, lyra, id, doc);
  }

  trackInsertion(lyra);

  return id;
}

export async function insertMultiple<S extends Schema, I extends OpaqueIndex, D extends OpaqueDocumentStore>(
  lyra: Lyra<S, I, D>,
  docs: Document[],
  batchSize?: number,
  language?: string,
  skipHooks?: boolean,
): Promise<string[]> {
  if (!batchSize) {
    batchSize = 1000;
  }

  if (!skipHooks) {
    await runMultipleHook(lyra.beforeMultipleInsert, lyra, docs);
  }

  const ids: string[] = [];

  await new Promise<void>((resolve, reject) => {
    let i = 0;
    async function _insertMultiple() {
      const batch = docs.slice(i * batchSize!, (i + 1) * batchSize!);
      i++;

      if (!batch.length) {
        return resolve();
      }

      for (const doc of batch) {
        try {
          const id = await insert(lyra, doc, language, skipHooks);
          ids.push(id);
        } catch (err) {
          reject(err);
        }
      }

      setTimeout(_insertMultiple, 0);
    }

    setTimeout(_insertMultiple, 0);
  });

  if (!skipHooks) {
    await runMultipleHook(lyra.afterMultipleInsert, lyra, docs);
  }

  return ids;
}
