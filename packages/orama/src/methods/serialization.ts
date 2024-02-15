import { Language } from '../index.ts'
import { AnyOrama } from '../types.ts'

export interface RawData {
  internalDocumentIDStore: unknown
  index: unknown
  docs: unknown
  sorting: unknown
  language: Language
}

export async function load<T extends AnyOrama>(orama: T, raw: RawData): Promise<void> {
  orama.internalDocumentIDStore.load(orama, raw.internalDocumentIDStore)
  orama.data.index = await orama.index.load(orama.internalDocumentIDStore, raw.index)
  orama.data.docs = await orama.documentsStore.load(orama.internalDocumentIDStore, raw.docs)
  orama.data.sorting = await orama.sorter.load(orama.internalDocumentIDStore, raw.sorting)
  orama.tokenizer.language = raw.language
}

export async function save<T extends AnyOrama>(orama: T): Promise<RawData> {
  return {
    internalDocumentIDStore: orama.internalDocumentIDStore.save(orama.internalDocumentIDStore),
    index: await orama.index.save(orama.data.index),
    docs: await orama.documentsStore.save(orama.data.docs),
    sorting: await orama.sorter.save(orama.data.sorting),
    language: orama.tokenizer.language
  }
}
