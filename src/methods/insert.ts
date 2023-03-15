import { runMultipleHook, runSingleHook } from "../components/hooks.js";
import { createError } from "../errors.js";
import { trackInsertion } from "../components/sync-blocking-checker.js";
import { Document, Schema, OpaqueIndex, OpaqueDocumentStore, Orama } from "../types.js";

export async function insert<S extends Schema, I extends OpaqueIndex, D extends OpaqueDocumentStore>(
  orama: Orama<S, I, D>,
  doc: Document,
  language?: string,
  skipHooks?: boolean,
): Promise<string> {
  await orama.validateSchema(doc, orama.schema);
  const { index, docs } = orama.data;

  const id = await orama.getDocumentIndexId(doc);

  if (typeof id !== "string") {
    throw createError("DOCUMENT_ID_MUST_BE_STRING", typeof id);
  }

  if (!(await orama.documentsStore.store(docs, id, doc))) {
    throw createError("DOCUMENT_ALREADY_EXISTS", id);
  }

  const docsCount = await orama.documentsStore.count(docs);

  if (!skipHooks) {
    await runSingleHook(orama.beforeInsert, orama, id, doc);
  }

  const indexableProperties = await orama.index.getSearchableProperties(index);
  const indexablePropertiesWithTypes = await orama.index.getSearchablePropertiesWithTypes(index);
  const values = await orama.getDocumentProperties(doc, indexableProperties);

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

    await orama.index.beforeInsert?.(orama.data.index, prop, id, value, language, orama.tokenizer, docsCount);
    await orama.index.insert(orama.data.index, prop, id, value, language, orama.tokenizer, docsCount);
    await orama.index.afterInsert?.(orama.data.index, prop, id, value, language, orama.tokenizer, docsCount);
  }

  if (!skipHooks) {
    await runSingleHook(orama.afterInsert, orama, id, doc);
  }

  trackInsertion(orama);

  return id;
}

export async function insertMultiple<S extends Schema, I extends OpaqueIndex, D extends OpaqueDocumentStore>(
  orama: Orama<S, I, D>,
  docs: Document[],
  batchSize?: number,
  language?: string,
  skipHooks?: boolean,
): Promise<string[]> {
  if (!batchSize) {
    batchSize = 1000;
  }

  if (!skipHooks) {
    await runMultipleHook(orama.beforeMultipleInsert, orama, docs);
  }

  const ids: string[] = [];

  await new Promise<void>((resolve, reject) => {
    let i = 0;
    async function _insertMultiple() {
      const batch = docs.slice(i * batchSize!, (i + 1) * batchSize!);
      i++;

      if (batch.length === 0) {
        return resolve();
      }

      for (const doc of batch) {
        try {
          const id = await insert(orama, doc, language, skipHooks);
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
    await runMultipleHook(orama.afterMultipleInsert, orama, docs);
  }

  return ids;
}
