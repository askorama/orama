import { OpaqueDocumentStore, OpaqueIndex, OpaqueSorter, Orama, Schema } from '../types.js'

export interface RawData {
  index: unknown
  docs: unknown
  sort: unknown
}

export async function load
<S extends Schema, I extends OpaqueIndex, D extends OpaqueDocumentStore, So extends OpaqueSorter>
(orama: Orama<S, I, D, So>, raw: RawData): Promise<void> {
  orama.data.index = await orama.index.load(raw.index)
  orama.data.docs = await orama.documentsStore.load(raw.docs)
  orama.data.sorting = await orama.sorter.load(raw.sort)
}

export async function save
<S extends Schema, I extends OpaqueIndex, D extends OpaqueDocumentStore, So extends OpaqueSorter>
(orama: Orama<S, I, D, So>): Promise<RawData> {
  return {
    index: await orama.index.save(orama.data.index),
    docs: await orama.documentsStore.save(orama.data.docs),
    sort: await orama.sorter.save(orama.data.sorting),
  }
}
