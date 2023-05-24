import { Orama } from '../types.js'

export interface RawData {
  index: unknown
  docs: unknown
  sorting: unknown
}

export async function load(orama: Orama, raw: RawData): Promise<void> {
  orama.data.index = await orama.index.load(raw.index)
  orama.data.docs = await orama.documentsStore.load(raw.docs)
  orama.data.sorting = await orama.sorter.load(raw.sorting)
}

export async function save(orama: Orama): Promise<RawData> {
  return {
    index: await orama.index.save(orama.data.index),
    docs: await orama.documentsStore.save(orama.data.docs),
    sorting: await orama.sorter.save(orama.data.sorting),
  }
}
