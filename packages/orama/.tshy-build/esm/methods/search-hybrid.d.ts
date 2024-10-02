import type { AnyOrama, TypedDocument, SearchParamsHybrid, Results, TokenScore } from '../types.js'
export declare function hybridSearch<T extends AnyOrama, ResultDocument = TypedDocument<T>>(
  orama: T,
  params: SearchParamsHybrid<T, ResultDocument>,
  language?: string
): Results<ResultDocument> | Promise<Results<ResultDocument>>
export declare function getVectorSearchIDs<T extends AnyOrama, ResultDocument = TypedDocument<T>>(
  orama: T,
  params: SearchParamsHybrid<T, ResultDocument>
): TokenScore[]
