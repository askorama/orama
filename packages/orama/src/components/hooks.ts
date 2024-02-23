import {
  BeforeSearch,
  AfterSearch,
  AnyOrama,
  MultipleCallbackComponent,
  Results,
  SearchParams,
  SingleCallbackComponent,
  TypedDocument,
  AfterCreate
} from '../types.js'

export const OBJECT_COMPONENTS = ['tokenizer', 'index', 'documentsStore', 'sorter']

export const FUNCTION_COMPONENTS = [
  'validateSchema',
  'getDocumentIndexId',
  'getDocumentProperties',
  'formatElapsedTime'
]

export const SINGLE_OR_ARRAY_COMPONENTS = [
  /* deprecated with v2.0.0-beta.5 */
]

export async function runSingleHook<T extends AnyOrama, ResultDocument extends TypedDocument<T>>(
  hooks: SingleCallbackComponent<T>[],
  orama: T,
  id: string,
  doc?: ResultDocument
): Promise<void> {
  const hooksLength = hooks.length
  for (let i = 0; i < hooksLength; i++) {
    await hooks[i](orama, id, doc)
  }
}

export async function runMultipleHook<T extends AnyOrama, ResultDocument extends TypedDocument<T>>(
  hooks: MultipleCallbackComponent<T>[],
  orama: T,
  docsOrIds: ResultDocument[] | string[]
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
  results: Results<ResultDocument>
): Promise<void> {
  const hooksLength = hooks.length
  for (let i = 0; i < hooksLength; i++) {
    await hooks[i](db, params, language, results)
  }
}

export async function runBeforeSearch<T extends AnyOrama>(
  hooks: BeforeSearch<T>[],
  db: T,
  params: SearchParams<T, TypedDocument<any>>,
  language: string | undefined
): Promise<void> {
  const hooksLength = hooks.length
  for (let i = 0; i < hooksLength; i++) {
    await hooks[i](db, params, language)
  }
}

export async function runAfterCreate<T extends AnyOrama>(
  hooks: AfterCreate<T>[],
  db: T,
): Promise<void> {
  const hooksLength = hooks.length
  for (let i = 0; i < hooksLength; i++) {
    await hooks[i](db)
  }
}
