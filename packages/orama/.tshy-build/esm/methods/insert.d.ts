import type { AnyOrama, PartialSchemaDeep, TypedDocument } from '../types.js'
export type InsertOptions = {
  avlRebalanceThreshold?: number
}
export declare function insert<T extends AnyOrama>(
  orama: T,
  doc: PartialSchemaDeep<TypedDocument<T>>,
  language?: string,
  skipHooks?: boolean,
  options?: InsertOptions
): string | Promise<string>
export declare function insertMultiple<T extends AnyOrama>(
  orama: T,
  docs: PartialSchemaDeep<TypedDocument<T>>[],
  batchSize?: number,
  language?: string,
  skipHooks?: boolean,
  timeout?: number
): Promise<string[]> | string[]
export declare function innerInsertMultiple<T extends AnyOrama>(
  orama: T,
  docs: PartialSchemaDeep<TypedDocument<T>>[],
  batchSize?: number,
  language?: string,
  skipHooks?: boolean,
  timeout?: number
): Promise<string[]> | string[]
