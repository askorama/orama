import {
  Document,
  MultipleCallbackComponent,
  OpaqueDocumentStore,
  OpaqueIndex,
  OpaqueSorter,
  Orama,
  Schema,
  SingleCallbackComponent,
} from '../types.js'

export const OBJECT_COMPONENTS = ['tokenizer', 'index', 'documentsStore', 'sorter']

export const FUNCTION_COMPONENTS = [
  'validateSchema',
  'getDocumentIndexId',
  'getDocumentProperties',
  'formatElapsedTime',
]

export const SINGLE_OR_ARRAY_COMPONENTS = [
  'beforeInsert',
  'afterInsert',
  'beforeRemove',
  'afterRemove',
  'beforeUpdate',
  'afterUpdate',
  'beforeMultipleInsert',
  'afterMultipleInsert',
  'beforeMultipleRemove',
  'afterMultipleRemove',
  'beforeMultipleUpdate',
  'afterMultipleUpdate',
]

export async function runSingleHook<
  S extends Schema,
  I extends OpaqueIndex,
  D extends OpaqueDocumentStore,
  So extends OpaqueSorter,
>(
  hooks: SingleCallbackComponent<{ Schema: S; Index: I; DocumentStore: D; Sorter: So }>[],
  orama: Orama<{ Schema: S; Index: I; DocumentStore: D; Sorter: So }>,
  id: string,
  doc?: Document,
): Promise<void> {
  for (let i = 0; i < hooks.length; i++) {
    await hooks[i](orama, id, doc)
  }
}

export async function runMultipleHook<
  S extends Schema,
  I extends OpaqueIndex,
  D extends OpaqueDocumentStore,
  So extends OpaqueSorter,
>(
  hooks: MultipleCallbackComponent<{ Schema: S; Index: I; DocumentStore: D; Sorter: So }>[],
  orama: Orama<{ Schema: S; Index: I; DocumentStore: D; Sorter: So }>,
  docsOrIds: Document[] | string[],
): Promise<void> {
  for (let i = 0; i < hooks.length; i++) {
    await hooks[i](orama, docsOrIds)
  }
}
