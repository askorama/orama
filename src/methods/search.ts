import type { RadixNode } from "../trees/radix/node.js";
import type { Lyra, PropertiesSchema, ResolveSchema, SearchProperties, TokenMap, TokenScore, BM25Params, BM25OptionalParams, PropertiesBoost, FacetsSearch } from "../types/index.js";
import type { WhereFilter } from "../types/filters.js";
import { defaultTokenizerConfig, Language } from "../tokenizer/index.js";
import { find as radixFind } from "../trees/radix/index.js";
import { formatNanoseconds, getNanosecondsTime, sortTokenScorePredicate } from "../utils.js";
import { getIndices } from "./common.js";
import { prioritizeTokenScores, BM25 } from "../algorithms.js";
import { FacetReturningValue, getFacets } from "../facets.js";
import { getWhereFiltersIDs, intersectFilteredIDs } from "../filters.js";

type IndexMap = Record<string, TokenMap>;

export type RetrievedDoc<S extends PropertiesSchema> = {
  /**
   * The id of the document.
   */
  id: string;
  /**
   * The score of the document in the search.
   */
  score: number;
  /**
   * The document
   */
  document: ResolveSchema<S>;
};

export type SearchParams<S extends PropertiesSchema> = {
  /**
   * The word to search.
   */
  term: string;
  /**
   * The properties of the document to search in.
   */
  properties?: "*" | SearchProperties<S>[];
  /**
   * The number of matched documents to return.
   */
  limit?: number;
  /**
   * The number of matched documents to skip.
   */
  offset?: number;
  /**
   * Whether to match the term exactly.
   */
  exact?: boolean;
  /**
   * The maximum [levenshtein distance](https://en.wikipedia.org/wiki/Levenshtein_distance)
   * between the term and the searchable property.
   */
  tolerance?: number;
  /**
   * The BM25 parameters to use.
   * 
   * k: Term frequency saturation parameter.
   * The higher the value, the more important the term frequency becomes.
   * The default value is 1.2. It should be set to a value between 1.2 and 2.0.
   * 
   * b: Document length saturation impact. The higher the value, the more
   * important the document length becomes. The default value is 0.75.
   * 
   * d: Frequency normalization lower bound. Default value is 0.5.
   * 
   * @see https://en.wikipedia.org/wiki/Okapi_BM25
   */
  relevance?: BM25OptionalParams;
  /**
   * The boost to apply to the properties.
   * 
   * The boost is a number that is multiplied to the score of the property.
   * It can be used to give more importance to some properties. 
   * 
   * @example
   * // Give more importance to the 'title' property.
   * const result = await search(db, {
   *  term: 'Michael',
   *  properties: ['title', 'author'],
   *  boost: {
   *   title: 2
   *  }
   * });
   * 
   * // In that case, the score of the 'title' property will be multiplied by 2.
   */
  boost?: PropertiesBoost<S>;
  /**
   * Facets configuration
   * 
   * A facet is a feature that allows users to narrow down their search results by specific
   * attributes or characteristics, such as category, price, or location.
   * This can help users find more relevant and specific results for their search query.
   * 
   * @example
   * 
   * const results = await search(db, {
   *  term: 'Personal Computer',
   *  properties: ['title', 'description', 'category.primary', 'category.secondary'],
   *  facets: {
   *    'category.primary': {
   *      size: 10,
   *      sort: 'ASC',
   *    }
   *  }
   * });
   */
  facets?: FacetsSearch<S>;

  /**
   * Filter the search results.
   * 
   * @example
   * // Search for documents that contain 'Headphones' in the 'description' and 'title' fields and
   * // have a price less than 100.
   * 
   * const result = await search(db, {
   *  term: 'Headphones',
   *  properties: ['description', 'title'],
   *  where: {
   *    price: {
   *      lt: 100
   *    }
   *  }
   * });
   */
  where?: WhereFilter<S>;
};

export type SearchResult<S extends PropertiesSchema> = {
  /**
   * The number of all the matched documents.
   */
  count: number;
  /**
   * An array of matched documents taking `limit` and `offset` into account.
   */
  hits: RetrievedDoc<S>[];
  /**
   * The time taken to search.
   */
  elapsed: bigint | string;
  /**
   * The facets results.
   */
  facets?: FacetReturningValue;
};

/**
 * Searches for documents in a database.
 * @param lyra The database to search.
 * @param params The search query.
 * @param language Optional parameter to override the default language analyzer.
 * @example
 * // Search for documents that contain 'Michael' in the 'author' field.
 * const result = await search(db, {
 *   term: 'Michael',
 *   properties: ['author']
 * });
 */
export async function search<S extends PropertiesSchema>(
  lyra: Lyra<S>,
  params: SearchParams<S>,
  language?: Language,
): Promise<SearchResult<S>> {
  if (!language) {
    language = lyra.defaultLanguage;
  }

  if (!lyra.components?.tokenizer) {
    lyra.components = {
      ...(lyra.components ?? {}),
      tokenizer: defaultTokenizerConfig(language),
    };
  }

  params.relevance = getBM25Parameters(params.relevance);

  const shouldCalculateFacets = params.facets && Object.keys(params.facets).length > 0;
  const { limit = 10, offset = 0, exact = false, term, properties } = params;
  const tokens = lyra.components.tokenizer!.tokenizerFn!(term, language, false, lyra.components.tokenizer!);
  const indices = getIndices(lyra, properties);
  const results: RetrievedDoc<S>[] = Array.from({
    length: limit,
  });
  const N = lyra.docsCount;

  const timeStart = getNanosecondsTime();

  // If filters are enabled, we need to get the IDs of the documents that match the filters.
  const hasFilters = Object.keys(params.where ?? {}).length > 0;
  let whereFiltersIDs: string[] = [];

  if (hasFilters) {
    whereFiltersIDs = getWhereFiltersIDs(params.where!, lyra);
  }

  // uniqueDocsIDs contains unique document IDs for all the tokens in all the indices.
  const uniqueDocsIDs: Record<string, number> = {};

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
  const indexMap: IndexMap = {};
  // After we create the indexMap, we need to calculate the intersection
  // between all the postings lists for each token.
  // Given the example above, docsIntersection will look like this:
  //
  // {
  //   description: [doc2]
  // }
  //
  // as doc2 is the only document present in all the postings lists for the "description" index.
  const docsIntersection: TokenMap = {};

  for (const index of indices) {
    const tokensMap: TokenMap = {};
    for (const token of tokens) {
      tokensMap[token] = [];
    }
    indexMap[index] = tokensMap;
    docsIntersection[index] = [];
  }

  // Now it's time to loop over all the indices and get the documents IDs for every single term
  const indexesLength = indices.length;
  for (let i = 0; i < indexesLength; i++) {
    const index = indices[i];
    const avgFieldLength = lyra.avgFieldLength[index];
    const fieldLengths = lyra.fieldLengths[index];

    if (!(index in lyra.tokenOccurrencies)) continue;

    const lyraOccurrencies = lyra.tokenOccurrencies[index];
    const lyraFrequencies = lyra.frequencies[index];

    const tokensLength = tokens.length;
    for (let j = 0; j < tokensLength; j++) {
      const term = tokens[j];

      // Here we get a TypeScript error: Type instantiation is excessively deep and possibly infinite.
      // Type definition is correct, but TypeScript is not able to infer the type recursively.
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const documentIDs = getDocumentIDsFromSearch(lyra, { ...params, index, term, exact });

      // lyraOccurrencies[term] can be undefined, 0, string, or { [k: string]: number }
      const termOccurrencies = typeof lyraOccurrencies[term] === "number" ? lyraOccurrencies[term] ?? 0 : 0;

      const scoreList: TokenScore[] = [];

      // Calculate TF-IDF value for each term, in each document, for each index.
      // Then insert sorted results into orderedTFIDFList.
      const documentIDsLength = documentIDs.length;
      for (let k = 0; k < documentIDsLength; k++) {
        const id = documentIDs[k];
        const tf = lyraFrequencies?.[id]?.[term] ?? 0;

        const bm25 = BM25(
          tf,
          termOccurrencies,
          N,
          fieldLengths[id],
          avgFieldLength,
          params.relevance as BM25Params,
        );

        scoreList.push([id, bm25]);
      }

      indexMap[index][term].push(...scoreList);
    }

    const docIds = indexMap[index];
    const vals = Object.values(docIds);
    docsIntersection[index] = prioritizeTokenScores(vals, params?.boost?.[index] ?? 1);
    const uniqueDocs = docsIntersection[index];

    const uniqueDocsLength = uniqueDocs.length;
    for (let i = 0; i < uniqueDocsLength; i++) {
      const [id, tfIdfScore] = uniqueDocs[i];

      const prevScore = uniqueDocsIDs[id];
      if (prevScore) {
        uniqueDocsIDs[id] = prevScore + tfIdfScore + 0.5;
      } else {
        uniqueDocsIDs[id] = tfIdfScore;
      }
    }
  }

  // Get unique doc IDs from uniqueDocsIDs map, sorted by value.
  let uniqueDocsArray = Object.entries(uniqueDocsIDs).sort(sortTokenScorePredicate);
  
  // If filters are enabled, we need to remove the IDs of the documents that don't match the filters.
  if (hasFilters) {
    uniqueDocsArray = intersectFilteredIDs(whereFiltersIDs, uniqueDocsArray);
  }

  const resultIDs: Set<string> = new Set();
  // Populate facets if needed
  const facets = shouldCalculateFacets ? getFacets(lyra.schema, lyra.docs, uniqueDocsArray, params.facets!) : {};

  // We already have the list of ALL the document IDs containing the search terms.
  // We loop over them starting from a positional value "offset" and ending at "offset + limit"
  // to provide pagination capabilities to the search.
  for (let i = offset; i < limit + offset; i++) {
    const idAndScore = uniqueDocsArray[i];

    // If there are no more results, just break the loop
    if (typeof idAndScore === "undefined") {
      break;
    }

    const [id, score] = idAndScore;

    if (!resultIDs.has(id)) {
      // We retrieve the full document only AFTER making sure that we really want it.
      // We never retrieve the full document preventively.
      const fullDoc = lyra.docs[id]!;
      results[i] = { id, score, document: fullDoc };
      resultIDs.add(id);
    }
  }

  let elapsed: bigint | string = getNanosecondsTime() - timeStart;

  if (lyra.components.elapsed?.format === "human") {
    elapsed = formatNanoseconds(elapsed);
  }

  const searchResult: SearchResult<S> = {
    elapsed,
    hits: results.filter(Boolean),
    count: uniqueDocsArray.length,
  };

  if (shouldCalculateFacets) {
    searchResult.facets = facets;
  }

  return searchResult;
}

function getDocumentIDsFromSearch<S extends PropertiesSchema>(
  lyra: Lyra<S>,
  params: SearchParams<S> & { index: string },
): string[] {
  const idx = lyra.index[params.index];
  const searchResult = radixFind(idx as RadixNode, {
    term: params.term,
    exact: params.exact,
    tolerance: params.tolerance,
  });

  const ids = new Set<string>();

  for (const key in searchResult) {
    for (const id of searchResult[key]) {
      ids.add(id);
    }
  }

  return Array.from(ids);
}

const defaultBM25Params: BM25Params = {
  k: 1.2,
  b: 0.75,
  d: 0.5
}

function getBM25Parameters(params: BM25OptionalParams = defaultBM25Params): BM25Params {
  return Object.assign({}, defaultBM25Params, params);
}
