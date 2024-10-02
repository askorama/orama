import { getDocumentIdFromInternalId } from '../components/internal-document-id-store.js'
import { createError } from '../errors.js'
import { getNested } from '../utils.js'
import { MODE_FULLTEXT_SEARCH, MODE_HYBRID_SEARCH, MODE_VECTOR_SEARCH } from '../constants.js'
import { fullTextSearch } from './search-fulltext.js'
import { searchVector } from './search-vector.js'
import { hybridSearch } from './search-hybrid.js'
export const defaultBM25Params = {
  k: 1.2,
  b: 0.75,
  d: 0.5
}
export function createSearchContext(
  tokenizer,
  index,
  documentsStore,
  language,
  params,
  properties,
  tokens,
  docsCount,
  timeStart
) {
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
  const indexMap = {}
  // After we create the indexMap, we need to calculate the intersection
  // between all the postings lists for each token.
  // Given the example above, docsIntersection will look like this:
  //
  // {
  //   description: [doc2]
  // }
  //
  // as doc2 is the only document present in all the postings lists for the "description" index.
  const docsIntersection = {}
  for (const prop of properties) {
    const tokensMap = {}
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
export function search(orama, params, language) {
  const mode = params.mode ?? MODE_FULLTEXT_SEARCH
  if (mode === MODE_FULLTEXT_SEARCH) {
    return fullTextSearch(orama, params, language)
  }
  if (mode === MODE_VECTOR_SEARCH) {
    return searchVector(orama, params)
  }
  if (mode === MODE_HYBRID_SEARCH) {
    return hybridSearch(orama, params)
  }
  throw createError('INVALID_SEARCH_MODE', mode)
}
export function fetchDocumentsWithDistinct(orama, uniqueDocsArray, offset, limit, distinctOn) {
  const docs = orama.data.docs
  // Keep track which values we already seen
  const values = new Map()
  // We cannot know how many results we will have in the end,
  // so we need cannot pre-allocate the array.
  const results = []
  const resultIDs = new Set()
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
    const doc = orama.documentsStore.get(docs, id)
    const value = getNested(doc, distinctOn)
    if (typeof value === 'undefined' || values.has(value)) {
      continue
    }
    values.set(value, true)
    count++
    // We shouldn't consider the document if it's not in the offset range
    if (count <= offset) {
      continue
    }
    results.push({ id: getDocumentIdFromInternalId(orama.internalDocumentIDStore, id), score, document: doc })
    resultIDs.add(id)
    // reached the limit, break the loop
    if (count >= offset + limit) {
      break
    }
  }
  return results
}
export function fetchDocuments(orama, uniqueDocsArray, offset, limit) {
  const docs = orama.data.docs
  const results = Array.from({
    length: limit
  })
  const resultIDs = new Set()
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
      const fullDoc = orama.documentsStore.get(docs, id)
      results[i] = { id: getDocumentIdFromInternalId(orama.internalDocumentIDStore, id), score, document: fullDoc }
      resultIDs.add(id)
    }
  }
  return results
}
//# sourceMappingURL=search.js.map
