import type { AnyOrama, Results, SearchParamsFullText, TypedDocument } from '../types.js'
export declare function fullTextSearch<T extends AnyOrama, ResultDocument = TypedDocument<T>>(
  orama: T,
  params: SearchParamsFullText<T, ResultDocument>,
  language?: string
): Results<ResultDocument> | Promise<Results<ResultDocument>>
