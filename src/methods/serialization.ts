import { Orama, OpaqueDocumentStore, OpaqueIndex, Schema } from "../types.js";

export interface RawData {
  index: unknown;
  docs: unknown;
}

export async function load<S extends Schema, I extends OpaqueIndex, D extends OpaqueDocumentStore>(
  orama: Orama<S, I, D>,
  raw: RawData,
): Promise<void> {
  orama.data.index = await orama.index.load(raw.index);
  orama.data.docs = await orama.documentsStore.load(raw.docs);
}

export async function save<S extends Schema, I extends OpaqueIndex, D extends OpaqueDocumentStore>(
  orama: Orama<S, I, D>,
): Promise<RawData> {
  return {
    index: await orama.index.save(orama.data.index),
    docs: await orama.documentsStore.save(orama.data.docs),
  };
}
