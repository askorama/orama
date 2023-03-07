export type Nullable<T> = T | null;

export type CallbackComponentReturnValue<T = void> = T | Promise<T>;

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface OpaqueIndex {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface OpaqueDocumentStore {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Schema extends Record<string, SearchableType | Schema> {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Document extends Record<string, SearchableValue | Document> {}

export type SearchableType = "string" | "number" | "boolean";

export type SearchableValue = string | number | boolean;

export type BM25Params = {
  k?: number;
  b?: number;
  d?: number;
};

export type FacetSorting = "asc" | "desc" | "ASC" | "DESC";

export interface StringFacetDefinition {
  limit?: number;
  offset?: number;
  sort?: FacetSorting;
}

export interface NumberFacetDefinition {
  ranges: { from: number; to: number }[];
}

export interface BooleanFacetDefinition {
  true?: boolean;
  false?: boolean;
}

export type FacetDefinition = StringFacetDefinition | NumberFacetDefinition | BooleanFacetDefinition;

export type ComparisonOperator = {
  gt?: number;
  gte?: number;
  lt?: number;
  lte?: number;
  eq?: number;
  between?: [number, number];
};

export type SearchParams = {
  /**
   * The word to search.
   */
  term: string;
  /**
   * The properties of the document to search in.
   */
  properties?: "*" | string[];
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
  relevance?: BM25Params;
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
  boost?: Record<string, number>;
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
  facets?: Record<string, FacetDefinition>;

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
  where?: Record<string, boolean | ComparisonOperator>;
};

export type Result = {
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
  document: Document;
};

export type FacetResult = Record<
  string,
  {
    count: number;
    values: Record<string, number>;
  }
>;

export type TokenScore = [string, number];

export type TokenMap = Record<string, TokenScore[]>;

export type IndexMap = Record<string, TokenMap>;

export type SearchContext = {
  timeStart: bigint;
  params: SearchParams;
  docsCount: number;
  uniqueDocsIDs: Record<string, number>;
  indexMap: IndexMap;
  docsIntersection: TokenMap;
};

export type Results = {
  /**
   * The number of all the matched documents.
   */
  count: number;
  /**
   * An array of matched documents taking `limit` and `offset` into account.
   */
  hits: Result[];
  /**
   * The time taken to search.
   */
  elapsed: bigint | string;
  /**
   * The facets results.
   */
  facets?: FacetResult;
};

export type SingleCallbackComponent<S extends Schema, I extends OpaqueIndex, D extends OpaqueDocumentStore> = (
  lyra: Lyra<S, I, D>,
  id: string,
  doc?: Document,
) => CallbackComponentReturnValue;

export type MultipleCallbackComponent<S extends Schema, I extends OpaqueIndex, D extends OpaqueDocumentStore> = (
  lyra: Lyra<S, I, D>,
  doc: Document[] | string[],
) => CallbackComponentReturnValue;

export type IIndexInsertOrRemoveFunction<I> = (
  index: I,
  id: string,
  prop: string,
  value: SearchableValue,
  language: string | undefined,
  tokenizer: Tokenizer,
  docsCount: number,
) => CallbackComponentReturnValue;

export type IIndexRemoveFunction<I> = (index: I, id: string, prop: string) => CallbackComponentReturnValue;

export interface IIndex<S extends Schema, I extends OpaqueIndex, D extends OpaqueDocumentStore> {
  create: (lyra: Lyra<S, I, D>, schema: Schema) => I;

  beforeInsert?: IIndexInsertOrRemoveFunction<I>;
  insert: IIndexInsertOrRemoveFunction<I>;
  afterInsert?: IIndexInsertOrRemoveFunction<I>;

  beforeRemove?: IIndexInsertOrRemoveFunction<I>;
  remove: IIndexInsertOrRemoveFunction<I>;
  afterRemove?: IIndexInsertOrRemoveFunction<I>;

  search(index: I, prop: string, terms: string, context: SearchContext): CallbackComponentReturnValue<TokenScore[]>;
  searchByWhereClause(index: I, filters: Record<string, boolean | ComparisonOperator>): string[];

  getSearchableProperties(index: I): CallbackComponentReturnValue<string[]>;
  getSearchablePropertiesWithTypes(index: I): CallbackComponentReturnValue<Record<string, SearchableType>>;

  load(raw: unknown): I | Promise<I>;
  save(index: I): unknown | Promise<object>;
}

export interface IDocumentsStore<S extends Schema, I extends OpaqueIndex, D extends OpaqueDocumentStore> {
  create: (lyra: Lyra<S, I, D>) => D;
  get(store: D, id: string): CallbackComponentReturnValue<Document | undefined>;
  getMultiple(store: D, ids: string[]): CallbackComponentReturnValue<(Document | undefined)[]>;
  store(store: D, id: string, doc: Document): CallbackComponentReturnValue<boolean>;
  remove(store: D, id: string): CallbackComponentReturnValue<boolean>;
  count(store: D): CallbackComponentReturnValue<number>;

  load(raw: unknown): D | Promise<D>;
  save(store: D): unknown | Promise<object>;
}

export interface Tokenizer {
  tokenize: (raw: string, language?: string) => string[];
}

export interface ComplexComponent<S extends Schema, I extends OpaqueIndex, D extends OpaqueDocumentStore> {
  tokenizer: Tokenizer;
  index: IIndex<S, I, D>;
  documentsStore: IDocumentsStore<S, I, D>;
}

export interface SimpleComponents {
  validateSchema(doc: Document, schema: Schema): CallbackComponentReturnValue<boolean>;
  getDocumentIndexId(doc: Document): CallbackComponentReturnValue<string>;
  getDocumentProperties(
    doc: Document,
    paths: string[],
  ): CallbackComponentReturnValue<Record<string, string | number | boolean>>;
  formatElapsedTime(number: bigint): CallbackComponentReturnValue<bigint> | CallbackComponentReturnValue<string>;
}

export interface SimpleOrArrayCallbackComponents<
  S extends Schema,
  I extends OpaqueIndex,
  D extends OpaqueDocumentStore,
> {
  beforeInsert: SingleCallbackComponent<S, I, D> | SingleCallbackComponent<S, I, D>[];
  afterInsert: SingleCallbackComponent<S, I, D> | SingleCallbackComponent<S, I, D>[];
  beforeRemove: SingleCallbackComponent<S, I, D> | SingleCallbackComponent<S, I, D>[];
  afterRemove: SingleCallbackComponent<S, I, D> | SingleCallbackComponent<S, I, D>[];
  beforeMultipleInsert: MultipleCallbackComponent<S, I, D> | MultipleCallbackComponent<S, I, D>[];
  afterMultipleInsert: MultipleCallbackComponent<S, I, D> | MultipleCallbackComponent<S, I, D>[];
  beforeMultipleRemove: MultipleCallbackComponent<S, I, D> | MultipleCallbackComponent<S, I, D>[];
  afterMultipleRemove: MultipleCallbackComponent<S, I, D> | MultipleCallbackComponent<S, I, D>[];
}

export interface ArrayCallbackComponents<S extends Schema, I extends OpaqueIndex, D extends OpaqueDocumentStore> {
  beforeInsert: SingleCallbackComponent<S, I, D>[];
  afterInsert: SingleCallbackComponent<S, I, D>[];
  beforeRemove: SingleCallbackComponent<S, I, D>[];
  afterRemove: SingleCallbackComponent<S, I, D>[];
  beforeMultipleInsert: MultipleCallbackComponent<S, I, D>[];
  afterMultipleInsert: MultipleCallbackComponent<S, I, D>[];
  beforeMultipleRemove: MultipleCallbackComponent<S, I, D>[];
  afterMultipleRemove: MultipleCallbackComponent<S, I, D>[];
}

export type Components<S extends Schema, I extends OpaqueIndex, D extends OpaqueDocumentStore> = Partial<
  ComplexComponent<S, I, D> & SimpleComponents & SimpleOrArrayCallbackComponents<S, I, D>
>;

export const kInsertions = Symbol("lyra.insertions");
export const kRemovals = Symbol("lyra.removals");

export type Lyra<S extends Schema, I extends OpaqueIndex, D extends OpaqueDocumentStore> = SimpleComponents &
  ArrayCallbackComponents<S, I, D> & {
    schema: S;
    tokenizer: Tokenizer;
    index: IIndex<S, I, D>;
    documentsStore: IDocumentsStore<S, I, D>;
    data: {
      index: I;
      docs: D;
    };
    [kInsertions]: number | undefined;
    [kRemovals]: number | undefined;
  };
