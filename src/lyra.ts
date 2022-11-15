import { stemmer } from "../stemmer/lib/en";
import * as ERRORS from "./errors";
import { trackInsertion } from "./insertion-checker";
import { create as createNode, Node } from "./radix-tree/node";
import { find as trieFind, insert as trieInsert, Nodes, removeDocumentByWord } from "./radix-tree/radix";
import { tokenize, Tokenizer } from "./tokenizer";
import { Language, SUPPORTED_LANGUAGES } from "./tokenizer/languages";
import { availableStopWords, stopWords } from "./tokenizer/stop-words";
import type { ResolveSchema, SearchProperties } from "./types";
import {
  getNanosecondsTime,
  includes,
  insertSortedValue,
  intersectTokenScores,
  sortTokenScorePredicate,
  uniqueId,
} from "./utils";

export type TokenScore = [string, number];
type Index = Record<string, Node>;
type TokenMap = Record<string, TokenScore[]>;
type IndexMap = Record<string, TokenMap>;
type FrequencyMap = {
  [property: string]: {
    [documentID: string]: {
      [token: string]: number;
    };
  };
};
type TokenOccurrency = {
  [property: string]: {
    [token: string]: number;
  };
};

export { tokenize } from "./tokenizer";
export { formatNanoseconds } from "./utils";

export type PropertyType = "string" | "number" | "boolean";

export type PropertiesSchema = {
  [key: string]: PropertyType | PropertiesSchema;
};

export interface AfterInsertHook {
  <S extends PropertiesSchema = PropertiesSchema>(this: Lyra<S>, id: string): Promise<void> | void;
}

const SUPPORTED_HOOKS = ["afterInsert"];

type Hooks = {
  afterInsert?: AfterInsertHook | AfterInsertHook[];
};

export type Stemmer = (word: string) => string;

export type TokenizerConfig = {
  enableStemming?: boolean;
  enableStopWords?: boolean;
  customStopWords?: ((stopWords: string[]) => string[]) | string[];
  stemmingFn?: Stemmer;
  tokenizerFn?: Tokenizer;
};

export type TokenizerConfigExec = {
  enableStemming: boolean;
  enableStopWords: boolean;
  customStopWords: string[];
  stemmingFn?: Stemmer;
  tokenizerFn: Tokenizer;
};

export type Configuration<S extends PropertiesSchema> = {
  /**
   * The structure of the document to be inserted into the database.
   */
  schema: S;
  /**
   * The default language analyzer to use.
   */
  defaultLanguage?: Language;
  edge?: boolean;
  hooks?: Hooks;
  tokenizer?: TokenizerConfig;
};

export type Data<S extends PropertiesSchema> = {
  docs: Record<string, ResolveSchema<S> | undefined>;
  index: Index;
  nodes: Nodes;
  schema: S;
  frequencies: FrequencyMap;
  tokenOccurrencies: TokenOccurrency;
};

export interface Lyra<S extends PropertiesSchema> extends Data<S> {
  defaultLanguage: Language;
  schema: S;
  edge: boolean;
  hooks: Hooks;
  tokenizer?: TokenizerConfig;
  frequencies: FrequencyMap;
}

export type InsertConfig = {
  language: Language;
};

export type InsertBatchConfig = InsertConfig & {
  batchSize?: number;
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

function validateHooks(hooks?: Hooks): void | never {
  if (hooks) {
    if (typeof hooks !== "object") {
      throw new Error(ERRORS.INVALID_HOOKS_OBJECT());
    }

    const invalidHooks = Object.keys(hooks).filter(hook => !includes(SUPPORTED_HOOKS, hook));
    if (invalidHooks.length) {
      throw new Error(ERRORS.NON_SUPPORTED_HOOKS(invalidHooks));
    }
  }
}

async function hookRunner<S extends PropertiesSchema>(
  this: Lyra<S>,
  // eslint-disable-next-line @typescript-eslint/ban-types
  funcs: Function | Function[],
  ...args: unknown[]
): Promise<void> {
  const hooks = Array.isArray(funcs) ? funcs : [funcs];
  for (let i = 0; i < hooks.length; i++) {
    await hooks[i].apply(this, args);
  }
}

function buildIndex<S extends PropertiesSchema>(lyra: Lyra<S>, schema: S, prefix = "") {
  for (const prop of Object.keys(schema)) {
    const propType = typeof prop;
    const isNested = typeof schema[prop] === "object";

    if (propType !== "string") throw new Error(ERRORS.INVALID_SCHEMA_TYPE(propType));

    const propName = `${prefix}${prop}`;

    if (isNested) {
      buildIndex(lyra, schema[prop] as S, `${propName}.`);
    } else {
      lyra.index[propName] = createNode();
    }
  }
}

function recursiveCheckDocSchema<S extends PropertiesSchema>(
  newDoc: ResolveSchema<S>,
  schema: PropertiesSchema,
): boolean {
  for (const key in newDoc) {
    if (!(key in schema)) {
      continue;
    }

    const propType = typeof newDoc[key];

    if (propType === "object") {
      recursiveCheckDocSchema(newDoc[key] as ResolveSchema<S>, schema);
    } else if (typeof newDoc[key] !== schema[key]) {
      return false;
    }
  }

  return true;
}

function recursiveTrieInsertion<S extends PropertiesSchema>(
  lyra: Lyra<S>,
  doc: ResolveSchema<S>,
  id: string,
  config: InsertConfig,
  prefix = "",
  tokenizerConfig: TokenizerConfigExec,
  schema: PropertiesSchema = lyra.schema,
) {
  const { index, frequencies, tokenOccurrencies } = lyra;

  for (const key of Object.keys(doc)) {
    const isNested = typeof doc[key] === "object";
    const isSchemaNested = typeof schema[key] == "object";
    const propName = `${prefix}${key}`;
    if (isNested && key in schema && isSchemaNested) {
      recursiveTrieInsertion(
        lyra,
        doc[key] as ResolveSchema<S>,
        id,
        config,
        propName + ".",
        tokenizerConfig,
        schema[key] as PropertiesSchema,
      );
    }

    if (typeof doc[key] === "string" && key in schema && !isSchemaNested) {
      // Use propName here because if doc is a nested object
      // We will get the wrong index
      const requestedTrie = index[propName];
      const tokens = tokenizerConfig.tokenizerFn(doc[key] as string, config.language, false, tokenizerConfig);

      if (!(propName in frequencies)) {
        frequencies[propName] = {};
      }

      if (!(propName in tokenOccurrencies)) {
        tokenOccurrencies[propName] = {};
      }

      if (!(id in frequencies[propName])) {
        frequencies[propName][id] = {};
      }

      for (const token of tokens) {
        let tokenFrequency = 0;

        for (const t of tokens) {
          if (t === token) {
            tokenFrequency++;
          }
        }

        const tf = tokenFrequency / tokens.length;

        frequencies[propName][id][token] = tf;

        if (!(token in tokenOccurrencies[propName])) {
          tokenOccurrencies[propName][token] = 0;
        }

        tokenOccurrencies[propName][token]++;

        trieInsert(requestedTrie, token, id);
      }
    }
  }
}

function getIndices<S extends PropertiesSchema>(lyra: Lyra<S>, indices: SearchParams<S>["properties"]): string[] {
  const knownIndices = Object.keys(lyra.index);

  if (!indices) {
    return knownIndices;
  }

  if (typeof indices === "string") {
    if (indices !== "*") {
      throw new Error(ERRORS.INVALID_PROPERTY(indices, knownIndices));
    }
    return knownIndices;
  }

  for (const index of indices as string[]) {
    if (!includes(knownIndices, index)) {
      throw new Error(ERRORS.INVALID_PROPERTY(index, knownIndices));
    }
  }

  return indices as string[];
}

function getDocumentIDsFromSearch<S extends PropertiesSchema>(
  lyra: Lyra<S>,
  params: SearchParams<S> & { index: string },
): string[] {
  const idx = lyra.index[params.index];
  const searchResult = trieFind(idx, {
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

function assertSupportedLanguage(language: string) {
  if (!includes(SUPPORTED_LANGUAGES, language)) {
    throw new Error(ERRORS.LANGUAGE_NOT_SUPPORTED(language));
  }
}

function assertDocSchema<S extends PropertiesSchema>(doc: ResolveSchema<S>, lyraSchema: PropertiesSchema) {
  if (!recursiveCheckDocSchema(doc, lyraSchema)) {
    throw new Error(ERRORS.INVALID_DOC_SCHEMA(lyraSchema, doc));
  }
}

/**
 * Creates a new database.
 * @param properties Options to initialize the database with.
 * @example
 * // Create a database that stores documents containing 'author' and 'quote' fields.
 * const db = create({
 *   schema: {
 *     author: 'string',
 *     quote: 'string'
 *   },
 *   hooks: {
 *     afterInsert: [afterInsertHook],
 *   }
 * });
 */
export function create<S extends PropertiesSchema>(properties: Configuration<S>): Lyra<S> {
  const defaultLanguage = (properties?.defaultLanguage?.toLowerCase() as Language) ?? "english";

  assertSupportedLanguage(defaultLanguage);

  validateHooks(properties.hooks);

  const instance: Lyra<S> = {
    defaultLanguage,
    schema: properties.schema,
    docs: {},
    nodes: {},
    index: {},
    hooks: properties.hooks || {},
    edge: properties.edge ?? false,
    tokenizer: defaultTokenizerConfig(defaultLanguage, properties.tokenizer!),
    frequencies: {},
    tokenOccurrencies: {},
  };

  buildIndex(instance, properties.schema);
  return instance;
}

/**
 * Inserts a document into a database.
 * @param lyra The database to insert document into.
 * @param doc The document to insert.
 * @param config Optional parameter for overriding default configuration.
 * @returns An object containing id of the inserted document.
 * @example
 * const { id } = insert(db, {
 *   quote: 'You miss 100% of the shots you don\'t take',
 *   author: 'Wayne Gretzky - Michael Scott'
 * });
 */
export function insert<S extends PropertiesSchema>(
  lyra: Lyra<S>,
  doc: ResolveSchema<S>,
  config?: InsertConfig,
): { id: string } {
  config = { language: lyra.defaultLanguage, ...config };
  const id = uniqueId();

  assertSupportedLanguage(config.language);

  assertDocSchema(doc, lyra.schema);

  lyra.docs[id] = doc;
  recursiveTrieInsertion(lyra, doc, id, config, undefined, lyra.tokenizer as TokenizerConfigExec);
  trackInsertion(lyra);

  return { id };
}

/**
 * Inserts a document into a database.
 * @param lyra The database to insert document into.
 * @param doc The document to insert.
 * @param config Optional parameter for overriding default configuration.
 * @returns A Promise object containing id of the inserted document.
 * @example
 * const { id } = insert(db, {
 *   quote: 'You miss 100% of the shots you don\'t take',
 *   author: 'Wayne Gretzky - Michael Scott'
 * });
 */
export async function insertWithHooks<S extends PropertiesSchema>(
  lyra: Lyra<S>,
  doc: ResolveSchema<S>,
  config?: InsertConfig,
): Promise<{ id: string }> {
  config = { language: lyra.defaultLanguage, ...config };
  const id = uniqueId();

  assertSupportedLanguage(config.language);

  assertDocSchema(doc, lyra.schema);

  lyra.docs[id] = doc;
  recursiveTrieInsertion(lyra, doc, id, config, undefined, lyra.tokenizer as TokenizerConfigExec);
  trackInsertion(lyra);
  if (lyra.hooks.afterInsert) {
    await hookRunner.call(lyra, lyra.hooks.afterInsert, id);
  }

  return { id };
}

/**
 * Inserts a large array of documents into a database without blocking the event loop.
 * @param lyra The database to insert document into.
 * @param docs Array of documents to insert.
 * @param config Optional parameter for overriding default configuration.
 * @returns Promise<void>.
 * @example
 * insertBatch(db, [
 *   {
 *     quote: 'You miss 100% of the shots you don\'t take',
 *     author: 'Wayne Gretzky - Michael Scott'
 *   },
 *   {
 *     quote: 'What I cannot createm I do not understand',
 *     author: 'Richard Feynman'
 *   }
 * ]);
 */

export async function insertBatch<S extends PropertiesSchema>(
  lyra: Lyra<S>,
  docs: ResolveSchema<S>[],
  config?: InsertBatchConfig,
): Promise<void> {
  const batchSize = config?.batchSize ?? 1000;

  return new Promise((resolve, reject) => {
    let i = 0;
    async function insertBatch() {
      const batch = docs.slice(i * batchSize, (i + 1) * batchSize);
      i++;

      if (!batch.length) {
        return resolve();
      }

      for (const line of batch) {
        try {
          await insertWithHooks(lyra, line, config);
        } catch (err) {
          reject(err);
        }
      }

      setTimeout(insertBatch, 0);
    }

    setTimeout(insertBatch, 0);
  });
}

/**
 * Removes a document from a database.
 * @param lyra The database to remove the document from.
 * @param docID The id of the document to remove.
 * @example
 * const isDeleted = remove(db, 'L1tpqQxc0c2djrSN2a6TJ');
 */
export function remove<S extends PropertiesSchema>(lyra: Lyra<S>, docID: string): boolean {
  if (!lyra.tokenizer) {
    lyra.tokenizer = defaultTokenizerConfig(lyra.defaultLanguage);
  }

  if (!(docID in lyra.docs)) {
    throw new Error(ERRORS.DOC_ID_DOES_NOT_EXISTS(docID));
  }

  const document = lyra.docs[docID] || ({} as Record<string, ResolveSchema<S>>);
  const documentKeys = Object.keys(document || {});

  const documentKeysLength = documentKeys.length;
  for (let i = 0; i < documentKeysLength; i++) {
    const key = documentKeys[i];

    const propertyType = lyra.schema[key];

    if (propertyType === "string") {
      const idx = lyra.index[key];
      const tokens: string[] = lyra.tokenizer.tokenizerFn!(
        document[key] as string,
        lyra.defaultLanguage,
        false,
        lyra.tokenizer!,
      )!;

      const tokensLength = tokens.length;
      for (let k = 0; k < tokensLength; k++) {
        const token = tokens[k];
        delete lyra.frequencies[key][docID];
        lyra.tokenOccurrencies[key][token]--;
        if (token && !removeDocumentByWord(idx, token, docID)) {
          throw new Error(ERRORS.CANT_DELETE_DOCUMENT(docID, key, token));
        }
      }
    }
  }

  lyra.docs[docID] = undefined;

  return true;
}

/**
 * Searches for documents in a database.
 * @param lyra The database to search.
 * @param params The search query.
 * @param language Optional parameter to override the default language analyzer.
 * @example
 * // Search for documents that contain 'Michael' in the 'author' field.
 * const result = search(db, {
 *   term: 'Michael',
 *   properties: ['author']
 * });
 */
export function search<S extends PropertiesSchema>(
  lyra: Lyra<S>,
  params: SearchParams<S>,
  language?: Language,
): SearchResult<S> {
  if (!language) {
    language = lyra.defaultLanguage;
  }

  if (!lyra.tokenizer) {
    lyra.tokenizer = defaultTokenizerConfig(language);
  }

  const { limit = 10, offset = 0, exact = false, term, properties } = params;
  const tokens = lyra.tokenizer.tokenizerFn!(term, language, false, lyra.tokenizer);
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
      const termOccurrencies = lyraOccurrencies[term];
      const orderedTFIDFList: TokenScore[] = [];

      // Calculate TF-IDF value for each term, in each document, for each index.
      // Then insert sorted results into orderedTFIDFList.
      const documentIDsLength = documentIDs.length;
      for (let k = 0; k < documentIDsLength; k++) {
        const id = documentIDs[k];
        const idf = Math.log10(N / termOccurrencies);
        const tfIdf = idf * (lyraFrequencies?.[id]?.[term] ?? 0);

        // @todo: we're now using binary search to insert the element in the right position.
        // Maybe we can switch to sparse array insertion?
        insertSortedValue(orderedTFIDFList, [id, tfIdf], sortTokenScorePredicate);
      }

      indexMap[index][term].push(...orderedTFIDFList);
    }

    const docIds = indexMap[index];
    const vals = Object.values(docIds);
    docsIntersection[index] = intersectTokenScores(vals);

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

export function save<S extends PropertiesSchema>(lyra: Lyra<S>): Data<S> {
  return {
    index: lyra.index,
    docs: lyra.docs,
    nodes: lyra.nodes,
    schema: lyra.schema,
    frequencies: lyra.frequencies,
    tokenOccurrencies: lyra.tokenOccurrencies,
  };
}

export function load<S extends PropertiesSchema>(
  lyra: Lyra<S>,
  { index, docs, nodes, schema, frequencies, tokenOccurrencies }: Data<S>,
) {
  if (!lyra.edge) {
    throw new Error(ERRORS.GETTER_SETTER_WORKS_ON_EDGE_ONLY("load"));
  }

  lyra.index = index;
  lyra.docs = docs;
  lyra.nodes = nodes;
  lyra.schema = schema;
  lyra.frequencies = frequencies;
  lyra.tokenOccurrencies = tokenOccurrencies;
}

export function defaultTokenizerConfig(language: Language, tokenizerConfig: TokenizerConfig = {}): TokenizerConfigExec {
  let defaultStopWords: string[] = [];
  let customStopWords: string[] = [];
  let defaultStemmingFn: Stemmer | undefined;
  let defaultTokenizerFn: Tokenizer = tokenize;

  // Enable custom tokenizer function
  if (tokenizerConfig?.tokenizerFn) {
    if (typeof tokenizerConfig.tokenizerFn !== "function") {
      throw Error(ERRORS.INVALID_TOKENIZER_FUNCTION());
    }
    defaultTokenizerFn = tokenizerConfig.tokenizerFn;

    // If there's no custom tokenizer, we can proceed setting custom
    // stemming functions and stop-words.
  } else {
    // Enable custom stemming function
    if (tokenizerConfig?.stemmingFn) {
      if (typeof tokenizerConfig.stemmingFn !== "function") {
        throw Error(ERRORS.INVALID_STEMMER_FUNCTION_TYPE());
      }
      defaultStemmingFn = tokenizerConfig.stemmingFn;
    } else {
      defaultStemmingFn = stemmer;
    }

    // Enable default stop-words

    if (includes(availableStopWords, language)) {
      defaultStopWords = stopWords[language] ?? [];
    }

    if (tokenizerConfig?.customStopWords) {
      switch (typeof tokenizerConfig.customStopWords) {
        // Execute the custom step-words function.
        // This will pass the default step-words for a given language as a first parameter.
        case "function":
          customStopWords = tokenizerConfig.customStopWords(defaultStopWords);
          break;

        // Check if the custom step-words is an array.
        // If it's an object, throw an exception. If the array contains any non-string value, throw an exception.
        case "object":
          if (!Array.isArray(tokenizerConfig.customStopWords)) {
            throw Error(ERRORS.CUSTOM_STOP_WORDS_MUST_BE_FUNCTION_OR_ARRAY());
          }
          customStopWords = tokenizerConfig.customStopWords as string[];
          if (customStopWords.some(x => typeof x !== "string")) {
            throw Error(ERRORS.CUSTOM_STOP_WORDS_ARRAY_MUST_BE_STRING_ARRAY());
          }
          break;

        // By default, throw an exception, as this is a misconfiguration.
        default:
          throw Error(ERRORS.CUSTOM_STOP_WORDS_MUST_BE_FUNCTION_OR_ARRAY());
      }
    }
  }

  return {
    enableStopWords: tokenizerConfig?.enableStopWords ?? true,
    enableStemming: tokenizerConfig?.enableStemming ?? true,
    stemmingFn: defaultStemmingFn,
    customStopWords: customStopWords ?? defaultStopWords,
    tokenizerFn: defaultTokenizerFn,
  };
}
