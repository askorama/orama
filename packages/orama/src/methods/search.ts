import { InternalDocumentID, getDocumentIdFromInternalId } from '../components/internal-document-id-store.ts'
import { createError } from '../errors.ts'
import { getNested } from '../utils.ts'
import type {
  AnyOrama,
  BM25Params,
  IndexMap,
  LiteralUnion,
  Result,
  Results,
  SearchContext,
  SearchParams,
  SearchParamsFullText,
  SearchParamsHybrid,
  SearchParamsVector,
  SearchableValue,
  TokenMap,
  Tokenizer,
  TypedDocument
} from '../types.ts'
import { MODE_FULLTEXT_SEARCH, MODE_HYBRID_SEARCH, MODE_VECTOR_SEARCH } from '../constants.ts'
import { fullTextSearch } from './search-fulltext.ts'
import { searchVector } from './search-vector.ts'
import { hybridSearch } from './search-hybrid.ts'

export const defaultBM25Params: BM25Params = {
  k: 1.2,
  b: 0.75,
  d: 0.5
}

export async function createSearchContext<T extends AnyOrama, ResultDocument = TypedDocument<T>>(
  tokenizer: Tokenizer,
  index: T['index'],
  documentsStore: T['documentsStore'],
  language: string | undefined,
  params: SearchParams<T, ResultDocument>,
  properties: string[],
  tokens: string[],
  docsCount: number,
  timeStart: bigint
): Promise<SearchContext<T, ResultDocument>> {
  // If filters are enabled, we need to get the IDs of the documents that match the filters.
  // const hasFilters = Object.keys(params.where ?? {}).length > 0;
  // let whereFiltersIDs: string[] = [];

  // if (hasFilters) {
  //   whereFiltersIDs = getWhereFiltersIDs(params.where!, orama);
  // }

  // indexMap is an object containing all the indexes considered for the current search,
  // and an array of doc IDs for each token in all the indices.
  //
  // Given the search term "quick brown fox" on the "description" index,
  // indexMap will look like this:
  //
  // {
  //   description: {
  //     quick: [doc1, doc2, doc3],
  //     brown: [doc2, doc4],
  //     fox:   [doc2]
  //   }
  // }
  const indexMap: IndexMap = {}

  // After we create the indexMap, we need to calculate the intersection
  // between all the postings lists for each token.
  // Given the example above, docsIntersection will look like this:
  //
  // {
  //   description: [doc2]
  // }
  //
  // as doc2 is the only document present in all the postings lists for the "description" index.
  const docsIntersection: TokenMap = {}

  for (const prop of properties) {
    const tokensMap: TokenMap = {}
    for (const token of tokens) {
      tokensMap[token] = []
    }
    indexMap[prop] = tokensMap
    docsIntersection[prop] = []
  }

  return {
    timeStart,
    tokenizer,
    index,
    documentsStore,
    language,
    params,
    docsCount,
    uniqueDocsIDs: {},
    indexMap,
    docsIntersection
  }
}

export async function search<T extends AnyOrama, ResultDocument = TypedDocument<T>>(
  orama: T,
  params: SearchParams<T, ResultDocument>,
  language?: string
): Promise<Results<ResultDocument>> {
  const mode = params.mode ?? MODE_FULLTEXT_SEARCH

  if (mode === MODE_FULLTEXT_SEARCH) {
    return fullTextSearch(orama, params as SearchParamsFullText<T, ResultDocument>, language)
  }

  if (mode === MODE_VECTOR_SEARCH) {
    return searchVector(orama, params as SearchParamsVector<T, ResultDocument>)
  }

  if (mode === MODE_HYBRID_SEARCH) {
    return hybridSearch(orama, params as SearchParamsHybrid<T, ResultDocument>)
  }

  throw createError('INVALID_SEARCH_MODE', mode)
}

export async function fetchDocumentsWithDistinct<T extends AnyOrama, ResultDocument extends TypedDocument<T>>(
  orama: T,
  uniqueDocsArray: [InternalDocumentID, number][],
  offset: number,
  limit: number,
  distinctOn: LiteralUnion<T['schema']>
): Promise<Result<ResultDocument>[]> {
  const docs = orama.data.docs

  // Keep track which values we already seen
  const values = new Map<SearchableValue, true>()

  // We cannot know how many results we will have in the end,
  // so we need cannot pre-allocate the array.
  const results: Result<ResultDocument>[] = []

  const resultIDs: Set<InternalDocumentID> = new Set()
  const uniqueDocsArrayLength = uniqueDocsArray.length
  let count = 0
  for (let i = 0; i < uniqueDocsArrayLength; i++) {
    const idAndScore = uniqueDocsArray[i]

    // If there are no more results, just break the loop
    if (typeof idAndScore === 'undefined') {
      continue
    }

    const [id, score] = idAndScore

    if (resultIDs.has(id)) {
      continue
    }

    const doc = await orama.documentsStore.get(docs, id)
    const value = await getNested(doc as object, distinctOn)
    if (typeof value === 'undefined' || values.has(value)) {
      continue
    }
    values.set(value, true)

    count++
    // We shouldn't consider the document if it's not in the offset range
    if (count <= offset) {
      continue
    }

    results.push({ id: getDocumentIdFromInternalId(orama.internalDocumentIDStore, id), score, document: doc! })
    resultIDs.add(id)

    // reached the limit, break the loop
    if (count >= offset + limit) {
      break
    }
  }

  return results
}

export async function fetchDocuments<T extends AnyOrama, ResultDocument extends TypedDocument<T>>(
  orama: T,
  uniqueDocsArray: [InternalDocumentID, number][],
  offset: number,
  limit: number
): Promise<Result<ResultDocument>[]> {
  const docs = orama.data.docs

  const results: Result<ResultDocument>[] = Array.from({
    length: limit
  })

  const resultIDs: Set<InternalDocumentID> = new Set()

  // We already have the list of ALL the document IDs containing the search terms.
  // We loop over them starting from a positional value "offset" and ending at "offset + limit"
  // to provide pagination capabilities to the search.
  for (let i = offset; i < limit + offset; i++) {
    const idAndScore = uniqueDocsArray[i]

    // If there are no more results, just break the loop
    if (typeof idAndScore === 'undefined') {
      break
    }

    const [id, score] = idAndScore

    if (!resultIDs.has(id)) {
      // We retrieve the full document only AFTER making sure that we really want it.
      // We never retrieve the full document preventively.
      const fullDoc = await orama.documentsStore.get(docs, id)
      results[i] = { id: getDocumentIdFromInternalId(orama.internalDocumentIDStore, id), score, document: fullDoc! }
      resultIDs.add(id)
    }
  }
  return results
}
