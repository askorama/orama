import type { Lyra, PropertiesSchema } from "../types";
import type { SearchProperties, ResolveSchema } from "../types";
import type { Language } from "../tokenizer/languages";
import { defaultTokenizerConfig } from "../tokenizer";
import { getIndices } from "./common";
import { find as radixFind } from "../radix-tree/radix";
import { getNanosecondsTime, insertSortedValue, sortTokenScorePredicate, intersectTokenScores } from "../utils";

export type TokenScore = [string, number];
type TokenMap = Record<string, TokenScore[]>;
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
  elapsed: bigint;
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

  const { limit = 10, offset = 0, exact = false, term, properties } = params;
  const tokens = lyra.components.tokenizer!.tokenizerFn!(term, language, false, lyra.components.tokenizer!);
  const indices = getIndices(lyra, properties);
  const results: RetrievedDoc<S>[] = Array.from({
    length: limit,
  });

  const timeStart = getNanosecondsTime();
  // uniqueDocsIDs contains unique document IDs for all the tokens in all the indices.
  const uniqueDocsIDs: Map<string, number> = new Map();

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

  const N = Object.keys(lyra.docs).length;

  // Now it's time to loop over all the indices and get the documents IDs for every single term
  const indexesLength = indices.length;
  for (let i = 0; i < indexesLength; i++) {
    const index = indices[i];

    if (!(index in lyra.tokenOccurrencies)) continue;

    const lyraOccurrencies = lyra.tokenOccurrencies[index];
    const lyraFrequencies = lyra.frequencies[index];

    const tokensLength = tokens.length;
    for (let j = 0; j < tokensLength; j++) {
      const term = tokens[j];
      const documentIDs = getDocumentIDsFromSearch(lyra, { ...params, index, term, exact });

      // lyraOccurrencies[term] can be undefined, 0, string, or { [k: string]: number }
      const termOccurrencies = typeof lyraOccurrencies[term] === "number" ? lyraOccurrencies[term] ?? 0 : 0;

      const orderedTFIDFList: TokenScore[] = [];

      // Calculate TF-IDF value for each term, in each document, for each index.
      // Then insert sorted results into orderedTFIDFList.
      const documentIDsLength = documentIDs.length;
      for (let k = 0; k < documentIDsLength; k++) {
        // idf's denominator is shifted by 1 to avoid division by zero
        const idf = Math.log10(N / (1 + termOccurrencies));

        const id = documentIDs[k];
        const tfIdf = idf * (lyraFrequencies?.[id]?.[term] ?? 0);

        // @todo: we're now using binary search to insert the element in the right position.
        // Maybe we can switch to sparse array insertion?
        insertSortedValue(orderedTFIDFList, [id, tfIdf], sortTokenScorePredicate);
      }

      indexMap[index][term].push(...orderedTFIDFList);
    }

    const docIds = indexMap[index];
    const vals = Object.values(docIds);
    docsIntersection[index] = (await intersectTokenScores({ data: vals })).data;

    const uniqueDocs = Object.values(docsIntersection[index]);
    const uniqueDocsLength = uniqueDocs.length;
    for (let i = 0; i < uniqueDocsLength; i++) {
      const [id, tfIdfScore] = uniqueDocs[i];

      if (uniqueDocsIDs.has(id)) {
        const prevScore = uniqueDocsIDs.get(id)!;
        uniqueDocsIDs.set(id, prevScore + tfIdfScore);
      } else {
        uniqueDocsIDs.set(id, tfIdfScore);
      }
    }
  }

  // Get unique doc IDs from uniqueDocsIDs map, sorted by value.
  const uniqueDocsArray = Array.from(uniqueDocsIDs.entries()).sort(sortTokenScorePredicate);
  const resultIDs: Set<string> = new Set();

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

  const hits = results.filter(Boolean);

  return {
    elapsed: getNanosecondsTime() - timeStart,
    hits,
    count: uniqueDocsIDs.size,
  };
}

function getDocumentIDsFromSearch<S extends PropertiesSchema>(
  lyra: Lyra<S>,
  params: SearchParams<S> & { index: string },
): string[] {
  const idx = lyra.index[params.index];
  const searchResult = radixFind(idx, {
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
