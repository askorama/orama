import type { AnyOrama, PartialSchemaDeep, TypedDocument } from '../types.js'
export declare function update<T extends AnyOrama>(
  orama: T,
  id: string,
  doc: PartialSchemaDeep<TypedDocument<T>>,
  language?: string,
  skipHooks?: boolean
): Promise<string> | string
export declare function updateMultiple<T extends AnyOrama>(
  orama: T,
  ids: string[],
  docs: PartialSchemaDeep<TypedDocument<T>>[],
  batchSize?: number,
  language?: string,
  skipHooks?: boolean
): Promise<string[]> | string[]
