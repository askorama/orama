import { Orama, OpaqueDocumentStore, OpaqueIndex, Schema } from "../types.js";

export interface RawData {
  index: unknown;
  docs: unknown;
}

export async function load<S extends Schema, I extends OpaqueIndex, D extends OpaqueDocumentStore>(
  lyra: Orama<S, I, D>,
  raw: RawData,
): Promise<void> {
  lyra.data.index = await lyra.index.load(raw.index);
  lyra.data.docs = await lyra.documentsStore.load(raw.docs);
}

export async function save<S extends Schema, I extends OpaqueIndex, D extends OpaqueDocumentStore>(
  lyra: Orama<S, I, D>,
): Promise<RawData> {
  return {
    index: await lyra.index.save(lyra.data.index),
    docs: await lyra.documentsStore.save(lyra.data.docs),
  };
}
