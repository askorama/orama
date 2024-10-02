import type { AnyOrama, Results, SearchParamsVector, TypedDocument } from '../types.js'
import { Language } from '../index.js'
export declare function searchVector<T extends AnyOrama, ResultDocument = TypedDocument<T>>(
  orama: T,
  params: SearchParamsVector<T, ResultDocument>,
  language?: Language
): Results<ResultDocument> | Promise<Results<ResultDocument>>
