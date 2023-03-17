import { runMultipleHook, runSingleHook } from "../components/hooks.js";
import { Document, Orama } from "../types.js";
import { insert, insertMultiple } from "./insert.js";
import { remove, removeMultiple } from "./remove.js";

export async function update(
  orama: Orama,
  id: string,
  doc: Document,
  language?: string,
  skipHooks?: boolean,
): Promise<string> {
  if (!skipHooks) {
    await runSingleHook(orama.beforeUpdate, orama, id);
  }

  await remove(orama, id, language, skipHooks);
  const newId = await insert(orama, doc, language, skipHooks);

  if (!skipHooks) {
    await runSingleHook(orama.afterUpdate, orama, newId);
  }

  return newId;
}

export async function updateMultiple(
  orama: Orama,
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
    await runMultipleHook(orama.beforeMultipleUpdate, orama, ids);
  }

  await removeMultiple(orama, ids, batchSize, language, skipHooks);
  const newIds = await insertMultiple(orama, docs, batchSize, language, skipHooks);

  if (!skipHooks) {
    await runMultipleHook(orama.afterMultipleUpdate, orama, newIds);
  }

  return newIds;
}
