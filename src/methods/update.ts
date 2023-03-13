import { runMultipleHook, runSingleHook } from "../components/hooks.js";
import { Document, Lyra, OpaqueDocumentStore, OpaqueIndex, Schema } from "../types.js";
import { insert, insertMultiple } from "./insert.js";
import { remove, removeMultiple } from "./remove.js";

export async function update<S extends Schema, I extends OpaqueIndex, D extends OpaqueDocumentStore>(
  lyra: Lyra<S, I, D>,
  id: string,
  doc: Document,
  language?: string,
  skipHooks?: boolean,
): Promise<string> {
  if (!skipHooks) {
    await runSingleHook(lyra.beforeUpdate, lyra, id);
  }

  await remove(lyra, id, language, skipHooks);
  const newId = await insert(lyra, doc, language, skipHooks);

  if (!skipHooks) {
    await runSingleHook(lyra.afterUpdate, lyra, newId);
  }

  return newId;
}

export async function updateMultiple<S extends Schema, I extends OpaqueIndex, D extends OpaqueDocumentStore>(
  lyra: Lyra<S, I, D>,
  ids: string[],
  docs: Document[],
  batchSize?: number,
  language?: string,
  skipHooks?: boolean,
): Promise<string[]> {
  if (!batchSize) {
    batchSize = 1000;
  }

  if (!skipHooks) {
    await runMultipleHook(lyra.beforeMultipleUpdate, lyra, ids);
  }

  await removeMultiple(lyra, ids, batchSize, language, skipHooks);
  const newIds = await insertMultiple(lyra, docs, batchSize, language, skipHooks);

  if (!skipHooks) {
    await runMultipleHook(lyra.afterMultipleUpdate, lyra, newIds);
  }

  return newIds;
}
