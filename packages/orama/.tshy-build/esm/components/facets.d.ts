import type { AnyOrama, FacetResult, FacetsParams, TokenScore } from '../types.js'
export declare function getFacets<T extends AnyOrama>(
  orama: T,
  results: TokenScore[],
  facetsConfig: FacetsParams<T>
): FacetResult
