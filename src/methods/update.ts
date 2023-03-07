import { Document, Schema, OpaqueIndex, OpaqueDocumentStore, Lyra } from "../types.js";
import { insert, insertMultiple } from "./insert.js";
import { remove, removeMultiple } from "./remove.js";

export async function update<S extends Schema, I extends OpaqueIndex, D extends OpaqueDocumentStore>(
  lyra: Lyra<S, I, D>,
  id: string,
  doc: Document,
  language?: string,
  skipHooks?: boolean,
): Promise<string> {
  await remove(lyra, id, language, skipHooks);
  return insert(lyra, doc, language, skipHooks);
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

  await removeMultiple(lyra, ids, batchSize, language, skipHooks);
  return insertMultiple(lyra, docs, batchSize, language, skipHooks);
}
