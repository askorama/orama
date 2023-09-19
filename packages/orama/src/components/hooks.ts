import {
  AfterSearch,
  AnyOrama,
  MultipleCallbackComponent,
  Results,
  SearchParams,
  SingleCallbackComponent,
  TypedDocument
} from '../types.js';

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

export async function runSingleHook<T extends AnyOrama, ResultDocument extends TypedDocument<T>>(
  hooks: SingleCallbackComponent<T>[],
  orama: T,
  id: string,
  doc?: ResultDocument,
): Promise<void> {
  const hooksLength = hooks.length
  for (let i = 0; i < hooksLength; i++) {
    await hooks[i](orama, id, doc)
  }
}

export async function runMultipleHook<T extends AnyOrama, ResultDocument extends TypedDocument<T>>(
  hooks: MultipleCallbackComponent<T>[],
  orama: T,
  docsOrIds: ResultDocument[] | string[],
): Promise<void> {
  const hooksLength = hooks.length
  for (let i = 0; i < hooksLength; i++) {
    await hooks[i](orama, docsOrIds)
  }
}

export async function runAfterSearch<T extends AnyOrama, ResultDocument extends TypedDocument<T>>(
  hooks: AfterSearch<T, ResultDocument>[],
  db: T,
  params: SearchParams<T, ResultDocument>,
  language: string | undefined,
  results: Results<ResultDocument>,
): Promise<void> {
  const hooksLength = hooks.length
  for (let i = 0; i < hooksLength; i++) {
    await hooks[i](db, params, language, results)
  }
}
