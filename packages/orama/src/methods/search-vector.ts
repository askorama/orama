import type { AnyOrama, Results, SearchParamsVector, TypedDocument } from '../types.js'
import { searchVector as searchVectorFn } from './search.js'

export type SearchVectorParams = {
  vector: number[] | Float32Array
  property: string
  similarity?: number
  limit?: number
  offset?: number
  includeVectors?: boolean
}

export async function searchVector<T extends AnyOrama, ResultDocument = TypedDocument<T>>(orama: T, params: SearchParamsVector<T, ResultDocument>): Promise<Results<ResultDocument>> {
  console.warn(`"searchVector" function is now part of "search" function, and will be deprecated soon. Please use "search" instead.`)
  console.warn('Read more at https://docs.oramasearch.com/open-source/usage/search/vector-search.html')
  return searchVectorFn(orama, params)
}
