import {
  AfterSearch,
  Document,
  MultipleCallbackComponent,
  Orama,
  ProvidedTypes,
  Results,
  SearchParams,
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
  'afterSearch',
  'beforeMultipleInsert',
  'afterMultipleInsert',
  'beforeMultipleRemove',
  'afterMultipleRemove',
  'beforeMultipleUpdate',
  'afterMultipleUpdate',
]

export async function runSingleHook<P extends ProvidedTypes>(
  hooks: SingleCallbackComponent<P>[],
  orama: Orama<P>,
  id: string,
  doc?: Document,
): Promise<void> {
  const hooksLength = hooks.length
  for (let i = 0; i < hooksLength; i++) {
    await hooks[i](orama, id, doc)
  }
}

export async function runMultipleHook<P extends ProvidedTypes>(
  hooks: MultipleCallbackComponent<P>[],
  orama: Orama<P>,
  docsOrIds: Document[] | string[],
): Promise<void> {
  const hooksLength = hooks.length
  for (let i = 0; i < hooksLength; i++) {
    await hooks[i](orama, docsOrIds)
  }
}

export async function runAfterSearch<P extends ProvidedTypes, AggValue>(
  hooks: AfterSearch<P>[],
  db: Orama<P>,
  params: SearchParams<AggValue>,
  language: string | undefined,
  results: Results<AggValue>,
): Promise<void> {
  const hooksLength = hooks.length
  for (let i = 0; i < hooksLength; i++) {
    await hooks[i](db, params, language, results)
  }
}
