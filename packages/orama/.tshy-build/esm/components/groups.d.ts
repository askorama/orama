import type { AnyOrama, GroupByParams, GroupResult, TokenScore, TypedDocument } from '../types.js'
export declare function getGroups<T extends AnyOrama, ResultDocument = TypedDocument<T>>(
  orama: T,
  results: TokenScore[],
  groupBy: GroupByParams<T, ResultDocument>
): GroupResult<ResultDocument>
