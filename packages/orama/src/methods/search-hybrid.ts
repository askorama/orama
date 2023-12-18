import type { AnyOrama, SearchParamsHybrid, TypedDocument, Results } from '../types.js'
import { getNanosecondsTime } from '../utils.js'

export async function hybridSearch<T extends AnyOrama, ResultDocument = TypedDocument<T>>(orama: T, params: SearchParamsHybrid<T, ResultDocument>, language?: string): Promise<Results<ResultDocument>> {
  const timeStart = await getNanosecondsTime()

  
}