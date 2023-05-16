import { Language } from './components/tokenizer/languages.js'

export type Nullable<T> = T | null

export type SingleOrArray<T> = T | T[]

export type SyncOrAsyncValue<T = void> = T | Promise<T>

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface OpaqueIndex {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface OpaqueDocumentStore {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Schema extends Record<string, SearchableType | Schema> {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Document extends Record<string, SearchableValue | Document | unknown> {}

export type ScalarSearchableType = 'string' | 'number' | 'boolean'
export type ArraySearchableType = 'string[]' | 'number[]' | 'boolean[]'
export type SearchableType = ScalarSearchableType | ArraySearchableType

export type SearchableValue = string | number | boolean | string[] | number[] | boolean[]

export type BM25Params = {
  k?: number
  b?: number
  d?: number
}

export type FacetSorting = 'asc' | 'desc' | 'ASC' | 'DESC'

export interface StringFacetDefinition {
  limit?: number
  offset?: number
  sort?: FacetSorting
}

export interface NumberFacetDefinition {
  ranges: { from: number; to: number }[]
}

export interface BooleanFacetDefinition {
  true?: boolean
  false?: boolean
}

export type FacetDefinition = StringFacetDefinition | NumberFacetDefinition | BooleanFacetDefinition

export type ComparisonOperator = {
  gt?: number
  gte?: number
  lt?: number
  lte?: number
  eq?: number
  between?: [number, number]
}

export type SearchParams = {
  /**
   * The word to search.
   */
  term?: string
  /**
   * The properties of the document to search in.
   */
  properties?: '*' | string[]
  /**
   * The number of matched documents to return.
   */
  limit?: number
  /**
   * The number of matched documents to skip.
   */
  offset?: number
  /**
   * Whether to match the term exactly.
   */
  exact?: boolean
  /**
   * The maximum [levenshtein distance](https://en.wikipedia.org/wiki/Levenshtein_distance)
   * between the term and the searchable property.
   */
  tolerance?: number
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
   * Full documentation: https://docs.oramasearch.com/usage/search/BM25-algorithm
   *
   * @see https://en.wikipedia.org/wiki/Okapi_BM25
   */
  relevance?: BM25Params
  /**
   * The boost to apply to the properties.
   *
   * The boost is a number that is multiplied to the score of the property.
   * It can be used to give more importance to some properties.
   *
   * Full documentation: https://docs.oramasearch.com/usage/search/fields-boosting
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
  boost?: Record<string, number>
  /**
   * Facets configuration
   * Full documentation: https://docs.oramasearch.com/usage/search/facets
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
  facets?: Record<string, FacetDefinition>

  /**
   * Filter the search results.
   * Full documentation: https://docs.oramasearch.com/usage/search/filters
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
  where?: Record<string, boolean | string | string[] | ComparisonOperator>

  /**
   * Threshold to use for refining the search results.
   * The threshold is a number between 0 and 1 that represents the minimum score of the documents to return.
   * By default, the threshold is 1.
   *
   * Full documentation: https://docs.oramasearch.com/usage/search/threshold
   *
   * @example
   *
   * const result = await search(db, {
   *  term: 'Red Headphones'
   *  threshold: 0
   * });
   *
   * // The result will contain all the documents that contain both 'Red' and 'Headphones' in their properties.
   *
   * const result2 = await search(db, {
   *  term: 'Red Headphones'
   *  threshold: 1
   * });
   *
   * // The result will contain all the documents that contain either 'Red' and 'Headphones' in their properties.
   */
  threshold?: number

  /**
   * Preflight query.
   * Will return just the facets (if needed) and the number of matched documents for the given query.
   *
   * Full documentation: https://docs.oramasearch.com/usage/search/preflight
   *
   * @example
   *
   * const result = await search(db, {
   *  term: 'Red Headphones',
   *  preflight: true
   * });
   *
   * console.log(result);
   *
   * // {
   * //   elapsed: {
   * //     raw: 181208,
   * //     formatted: '181μs'
   * //   },
   * //   count: 100,
   * // }
   */
  preflight?: boolean
}

export type Result = {
  /**
   * The id of the document.
   */
  id: string
  /**
   * The score of the document in the search.
   */
  score: number
  /**
   * The document
   */
  document: Document
}

export type FacetResult = Record<
  string,
  {
    count: number
    values: Record<string, number>
  }
>

export type TokenScore = [string, number]

export type TokenMap = Record<string, TokenScore[]>

export type IndexMap = Record<string, TokenMap>

export type SearchContext = {
  timeStart: bigint
  tokenizer: Tokenizer
  index: IIndex
  documentsStore: IDocumentsStore
  language: string | undefined
  params: SearchParams
  docsCount: number
  uniqueDocsIDs: Record<string, number>
  indexMap: IndexMap
  docsIntersection: TokenMap
}

export type ElapsedTime = {
  raw: number
  formatted: string
}

export type Results = {
  /**
   * The number of all the matched documents.
   */
  count: number
  /**
   * An array of matched documents taking `limit` and `offset` into account.
   */
  hits: Result[]
  /**
   * The time taken to search.
   */
  elapsed: ElapsedTime
  /**
   * The facets results.
   */
  facets?: FacetResult
}

export type SingleCallbackComponent = (orama: Orama, id: string, doc?: Document) => SyncOrAsyncValue

export type MultipleCallbackComponent = (orama: Orama, doc: Document[] | string[]) => SyncOrAsyncValue

export type IIndexInsertOrRemoveHookFunction<I extends OpaqueIndex = OpaqueIndex, R = void> = (
  index: I,
  prop: string,
  id: string,
  value: SearchableValue,
  type: SearchableType,
  language: string | undefined,
  tokenizer: Tokenizer,
  docsCount: number,
) => SyncOrAsyncValue<R>

export interface IIndex<I extends OpaqueIndex = OpaqueIndex> {
  create: (orama: Orama<{ Index: I }>, schema: Schema) => SyncOrAsyncValue<I>

  beforeInsert?: IIndexInsertOrRemoveHookFunction<I>
  insert: (
    implementation: IIndex<I>,
    index: I,
    prop: string,
    id: string,
    value: SearchableValue,
    schemaType: SearchableType,
    language: string | undefined,
    tokenizer: Tokenizer,
    docsCount: number,
  ) => SyncOrAsyncValue
  afterInsert?: IIndexInsertOrRemoveHookFunction<I>

  beforeRemove?: IIndexInsertOrRemoveHookFunction<I>
  remove: (
    implementation: IIndex<I>,
    index: I,
    prop: string,
    id: string,
    value: SearchableValue,
    schemaType: SearchableType,
    language: string | undefined,
    tokenizer: Tokenizer,
    docsCount: number,
  ) => SyncOrAsyncValue<boolean>
  afterRemove?: IIndexInsertOrRemoveHookFunction<I>

  insertDocumentScoreParameters(
    index: I,
    prop: string,
    id: string,
    tokens: string[],
    docsCount: number,
  ): SyncOrAsyncValue
  insertTokenScoreParameters(index: I, prop: string, id: string, tokens: string[], token: string): SyncOrAsyncValue
  removeDocumentScoreParameters(index: I, prop: string, id: string, docsCount: number): SyncOrAsyncValue
  removeTokenScoreParameters(index: I, prop: string, token: string): SyncOrAsyncValue
  calculateResultScores(
    context: SearchContext,
    index: I,
    prop: string,
    term: string,
    ids: string[],
  ): SyncOrAsyncValue<TokenScore[]>

  search(context: SearchContext, index: I, prop: string, term: string): SyncOrAsyncValue<TokenScore[]>
  searchByWhereClause(
    context: SearchContext,
    index: I,
    filters: Record<string, boolean | string | string[] | ComparisonOperator>,
  ): SyncOrAsyncValue<string[]>

  getSearchableProperties(index: I): SyncOrAsyncValue<string[]>
  getSearchablePropertiesWithTypes(index: I): SyncOrAsyncValue<Record<string, SearchableType>>

  load<R = unknown>(raw: R): SyncOrAsyncValue<I>
  save<R = unknown>(index: I): SyncOrAsyncValue<R>
}

export interface IDocumentsStore<D extends OpaqueDocumentStore = OpaqueDocumentStore> {
  create: (orama: Orama<{ DocumentStore: D }>) => SyncOrAsyncValue<D>
  get(store: D, id: string): SyncOrAsyncValue<Document | undefined>
  getMultiple(store: D, ids: string[]): SyncOrAsyncValue<(Document | undefined)[]>
  getAll(store: D): SyncOrAsyncValue<Record<string, Document>>
  store(store: D, id: string, doc: Document): SyncOrAsyncValue<boolean>
  remove(store: D, id: string): SyncOrAsyncValue<boolean>
  count(store: D): SyncOrAsyncValue<number>

  load<R = unknown>(raw: R): SyncOrAsyncValue<D>
  save<R = unknown>(store: D): SyncOrAsyncValue<R>
}

export type Stemmer = (word: string) => string

export type DefaultTokenizerConfig = {
  language?: Language
  stemming?: boolean
  stemmer?: Stemmer
  stemmerSkipProperties?: string | string[]
  stopWords?: boolean | string[] | ((stopWords: string[]) => string[] | Promise<string[]>)
  allowDuplicates?: boolean
}

export interface Tokenizer {
  language: string
  normalizationCache: Map<string, string>
  tokenize: (raw: string, language?: string, prop?: string) => SyncOrAsyncValue<string[]>
}

export interface ObjectComponents {
  tokenizer: Tokenizer | DefaultTokenizerConfig
  index: IIndex
  documentsStore: IDocumentsStore
}

export interface FunctionComponents<S extends Schema = Schema> {
  validateSchema(doc: Document, schema: S): SyncOrAsyncValue<string | undefined>
  getDocumentIndexId(doc: Document): SyncOrAsyncValue<string>
  getDocumentProperties(doc: Document, paths: string[]): SyncOrAsyncValue<Record<string, string | number | boolean>>
  formatElapsedTime(number: bigint): SyncOrAsyncValue<number | string | object | ElapsedTime>
}

export interface SingleOrArrayCallbackComponents {
  beforeInsert: SingleOrArray<SingleCallbackComponent>
  afterInsert: SingleOrArray<SingleCallbackComponent>
  beforeRemove: SingleOrArray<SingleCallbackComponent>
  afterRemove: SingleOrArray<SingleCallbackComponent>
  beforeUpdate: SingleOrArray<SingleCallbackComponent>
  afterUpdate: SingleOrArray<SingleCallbackComponent>
  beforeMultipleInsert: SingleOrArray<MultipleCallbackComponent>
  afterMultipleInsert: SingleOrArray<MultipleCallbackComponent>
  beforeMultipleRemove: SingleOrArray<MultipleCallbackComponent>
  afterMultipleRemove: SingleOrArray<MultipleCallbackComponent>
  beforeMultipleUpdate: SingleOrArray<MultipleCallbackComponent>
  afterMultipleUpdate: SingleOrArray<MultipleCallbackComponent>
}

export interface ArrayCallbackComponents {
  beforeInsert: SingleCallbackComponent[]
  afterInsert: SingleCallbackComponent[]
  beforeRemove: SingleCallbackComponent[]
  afterRemove: SingleCallbackComponent[]
  beforeUpdate: SingleCallbackComponent[]
  afterUpdate: SingleCallbackComponent[]
  beforeMultipleInsert: MultipleCallbackComponent[]
  afterMultipleInsert: MultipleCallbackComponent[]
  beforeMultipleRemove: MultipleCallbackComponent[]
  afterMultipleRemove: MultipleCallbackComponent[]
  beforeMultipleUpdate: MultipleCallbackComponent[]
  afterMultipleUpdate: MultipleCallbackComponent[]
}

export type Components = Partial<ObjectComponents & FunctionComponents & SingleOrArrayCallbackComponents>

export const kInsertions = Symbol('orama.insertions')
export const kRemovals = Symbol('orama.removals')

type ProvidedTypes = Partial<{ Schema: Schema; Index: OpaqueIndex; DocumentStore: OpaqueDocumentStore }>

interface Data<I extends OpaqueIndex, D extends OpaqueDocumentStore> {
  index: I
  docs: D
}

type Internals<S extends Schema, I extends OpaqueIndex, D extends OpaqueDocumentStore> = {
  schema: S
  tokenizer: Tokenizer
  index: IIndex<I>
  documentsStore: IDocumentsStore<D>
  data: Data<I, D>
  caches: Record<string, unknown>
  [kInsertions]: number | undefined
  [kRemovals]: number | undefined
}

type OramaID = {
  id: string
}

export type Orama<
  P extends ProvidedTypes = { Schema: Schema; Index: OpaqueIndex; DocumentStore: OpaqueDocumentStore },
> = FunctionComponents &
  ArrayCallbackComponents &
  Internals<Schema & P['Schema'], OpaqueIndex & P['Index'], OpaqueDocumentStore & P['DocumentStore']> &
  OramaID
