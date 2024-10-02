import { Language } from '../index.js'
import { AnyOrama } from '../types.js'
export interface RawData {
  internalDocumentIDStore: unknown
  index: unknown
  docs: unknown
  sorting: unknown
  language: Language
}
export declare function load<T extends AnyOrama>(orama: T, raw: RawData): void
export declare function save<T extends AnyOrama>(orama: T): RawData
