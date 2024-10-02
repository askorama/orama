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
export declare const OBJECT_COMPONENTS: string[]
export declare const FUNCTION_COMPONENTS: string[]
export declare const SINGLE_OR_ARRAY_COMPONENTS: never[]
export declare function runSingleHook<T extends AnyOrama, ResultDocument extends TypedDocument<T>>(
  hooks: SingleCallbackComponent<T>[],
  orama: T,
  id: string,
  doc?: ResultDocument
): Promise<void> | void
export declare function runMultipleHook<T extends AnyOrama, ResultDocument extends TypedDocument<T>>(
  hooks: MultipleCallbackComponent<T>[],
  orama: T,
  docsOrIds: ResultDocument[] | string[]
): Promise<void> | void
export declare function runAfterSearch<T extends AnyOrama, ResultDocument extends TypedDocument<T>>(
  hooks: AfterSearch<T, ResultDocument>[],
  db: T,
  params: SearchParams<T, ResultDocument>,
  language: string | undefined,
  results: Results<ResultDocument>
): Promise<void> | void
export declare function runBeforeSearch<T extends AnyOrama>(
  hooks: BeforeSearch<T>[],
  db: T,
  params: SearchParams<T, TypedDocument<any>>,
  language: string | undefined
): Promise<void> | void
export declare function runAfterCreate<T extends AnyOrama>(hooks: AfterCreate<T>[], db: T): Promise<void> | void
