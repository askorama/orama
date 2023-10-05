import { DocumentsStore } from './components/documents-store.js'
import { Index } from './components/index.js'
import { DocumentID, InternalDocumentID, InternalDocumentIDStore } from './components/internal-document-id-store.js'
import { Sorter } from './components/sorter.js'
import { Language } from './components/tokenizer/languages.js'

export type Nullable<T> = T | null

export type SingleOrArray<T> = T | T[]

export type SyncOrAsyncValue<T = void> = T | PromiseLike<T>

// Given a type T, return a new type with:
// - the concatenation of nested properties as key
// - the type of the nested property as value
export type Flatten<T extends object> = object extends T
  ? object
  : {
      [K in keyof T]-?: (
        x: NonNullable<T[K]> extends infer V
          ? V extends object
            ? V extends readonly any[]
              ? Pick<T, K>
              : Flatten<V> extends infer FV
              ? {
                  [P in keyof FV as `${Extract<K, string | number>}.${Extract<P, string | number>}`]: FV[P]
                }
              : never
            : Pick<T, K>
          : never,
      ) => void
    } extends Record<keyof T, (y: infer O) => void>
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ? O extends infer U
    ? { [K in keyof O]: O[K] }
    : never
  : never


export type SchemaTypes<Value> = Value extends 'string'
  ? string
  : Value extends 'string[]'
  ? string[]
  : Value extends 'boolean'
  ? boolean
  : Value extends 'boolean[]'
  ? boolean[]
  : Value extends 'number'
  ? number
  : Value extends 'number[]'
  ? number[]
  : Value extends 'enum'
  ? string | number
  : Value extends 'enum[]'
  ? (string | number)[]
  : // eslint-disable-next-line @typescript-eslint/no-unused-vars
  Value extends `vector[${number}]`
  ? number[]
  : Value extends object
  ? { [Key in keyof Value]: SchemaTypes<Value[Key]> } & {
      [otherKeys: PropertyKey]: any
    }
  : never

export type Schema<TSchema> = TSchema extends AnySchema
  ? InternalTypedDocument<{
      -readonly [Key in keyof TSchema]: SchemaTypes<TSchema[Key]>
    }>
  : never

export type AnyDocument = InternalTypedDocument<any>

export type InternalTypedDocument<TSchema extends object> = { id: DocumentID } & TSchema & {
    [otherKeys: PropertyKey]: any
  }
export type TypedDocument<T extends AnyOrama> = T['typeSchema']

export type AnySchema = {
  [key: PropertyKey]: SearchableType | AnySchema
}

export type PartialSchemaDeepObject<T> = T extends object
  ? {
      [K in keyof T]?: T[K]
    }
  : T

export type PartialSchemaDeep<T> = {
  [K in keyof T]?: PartialSchemaDeepObject<T[K]>
}

/**
 * @deprecated
 */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface Document extends Record<string, SearchableValue | Document | unknown> {}

export type Magnitude = number
export type Vector = `vector[${number}]`
export type VectorType = Float32Array

export type ScalarSearchableType = 'string' | 'number' | 'boolean' | 'enum'
export type ArraySearchableType = 'string[]' | 'number[]' | 'boolean[]' | 'enum[]' | Vector

export type SearchableType = ScalarSearchableType | ArraySearchableType

export type ScalarSearchableValue = string | number | boolean
export type ArraySearchableValue = string[] | number[] | boolean[] | VectorType
export type SearchableValue = ScalarSearchableValue | ArraySearchableValue

export type SortType = 'string' | 'number' | 'boolean'
export type SortValue = string | number | boolean

export type VectorIndex = {
  size: number
  vectors: {
    [docID: string]: [Magnitude, VectorType]
  }
}

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

export type FacetsParams<T extends AnyOrama> = Partial<Record<LiteralUnion<T['schema']>, FacetDefinition>>

export type FacetDefinition = StringFacetDefinition | NumberFacetDefinition | BooleanFacetDefinition

export type ReduceFunction<T, R> = (values: ScalarSearchableValue[], acc: T, value: R, index: number) => T
export type Reduce<T, R = AnyDocument> = {
  reducer: ReduceFunction<T, R>
  getInitialValue: (elementCount: number) => T
}

export type GroupByParams<T extends AnyOrama, ResultDocument> = {
  properties: LiteralUnion<T['schema']>[]
  maxResult?: number
  reduce?: Reduce<ResultDocument>
}

export type ComparisonOperator = {
  gt?: number
  gte?: number
  lt?: number
  lte?: number
  eq?: number
  between?: [number, number]
}

export type EnumComparisonOperator = {
  eq?: string | number | boolean
  in?: (string | number | boolean)[]
  nin?: (string | number | boolean)[]
}

export type EnumArrComparisonOperator = {
  containsAll ?: (string | number | boolean)[]
}

export type Operator<Value> = Value extends 'string'
  ? (string | string[])
  : Value extends 'string[]'
  ? (string | string[])
  : Value extends 'boolean'
  ? boolean
  : Value extends 'boolean[]'
  ? boolean
  : Value extends 'number'
  ? ComparisonOperator
  : Value extends 'number[]'
  ? ComparisonOperator
  : Value extends 'enum'
  ? EnumComparisonOperator
  : Value extends 'enum[]'
  ? EnumArrComparisonOperator
  : never
export type WhereCondition<TSchema> = {
  [key in keyof TSchema]?: Operator<TSchema[key]>
}

/**
 * A custom sorter function item as [id, score, document].
 */
export type CustomSorterFunctionItem<ResultDocument> = [InternalDocumentID, number, ResultDocument]

export type CustomSorterFunction<ResultDocument> = (
  a: CustomSorterFunctionItem<ResultDocument>,
  b: CustomSorterFunctionItem<ResultDocument>,
) => number
// thanks to https://github.com/sindresorhus/type-fest/blob/main/source/literal-union.d.ts
export type LiteralUnion<T> = (keyof T extends string ? keyof T : never) | (string & Record<never, never>)
/**
 * Define which properties to sort for.
 */
export type SorterParams<T extends AnyOrama> = {
  /**
   * The key of the document used to sort the result.
   */
  property: LiteralUnion<T['schema']>;
  /**
   * Whether to sort the result in ascending or descending order.
   */
  order?: 'ASC' | 'DESC'
}


export type FlattenSchema<T extends AnyOrama> = Flatten<T['schema']>
export type FlattenSchemaProperty<T extends AnyOrama> = keyof FlattenSchema<T>

export type SortByParams<T extends AnyOrama, ResultDocument> = SorterParams<T> | CustomSorterFunction<ResultDocument>

export type SearchParams<T extends AnyOrama, ResultDocument = TypedDocument<T>> = {
  /**
   * The word to search.
   */
  term?: string
  /**
   * The properties of the document to search in.
   */
  properties?: '*' | FlattenSchemaProperty<T>[]
  /**
   * The number of matched documents to return.
   */
  limit?: number
  /**
   * The number of matched documents to skip.
   */
  offset?: number
  /**
   * The key of the document used to sort the result.
   */
  sortBy?: SortByParams<T, ResultDocument>
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
  boost?: Partial<Record<LiteralUnion<T['schema']>, number>>
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
  facets?: FacetsParams<T>

  /**
   * Distinct configuration
   * Full documentation: https://docs.oramasearch.com/usage/search/introduction#distinct
   *
   * @example
   * const results = await search(db, {
   *  term: 'Headphones',
   *  distinctOn: 'category.primary',
   * })
   */
  distinctOn?: LiteralUnion<T['schema']>

  /**
   * Groups configuration
   * Full documentation: https://docs.oramasearch.com/usage/search/grouping
   *
   * @example
   * const results = await search(db, {
   *  term: 'Headphones',
   *  groupBy: {
   *   properties: ['category.primary'],
   *   maxResult: 10,
   *  }
   * })
   */
  groupBy?: GroupByParams<T, ResultDocument>

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
  where?: Partial<WhereCondition<T['schema']>>

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

export type Result<Document> = {
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

export type GroupResult<Document> =
  | {
      values: ScalarSearchableValue[]
      result: Result<Document>[]
    }[]

export type TokenScore = [InternalDocumentID, number]

export type TokenMap = Record<string, TokenScore[]>

export type IndexMap = Record<string, TokenMap>

export type SearchContext<T extends AnyOrama, ResultDocument = TypedDocument<T>> = {
  timeStart: bigint
  tokenizer: Tokenizer
  index: T['index']
  documentsStore: T['documentsStore']
  language: string | undefined
  params: SearchParams<T, ResultDocument>
  docsCount: number
  uniqueDocsIDs: Record<number, number>
  indexMap: IndexMap
  docsIntersection: TokenMap
}

export type ElapsedTime = {
  raw: number
  formatted: string
}

export type Results<Document> = {
  /**
   * The number of all the matched documents.
   */
  count: number
  /**
   * An array of matched documents taking `limit` and `offset` into account.
   */
  hits: Result<Document>[]
  /**
   * The time taken to search.
   */
  elapsed: ElapsedTime
  /**
   * The facets results.
   */
  facets?: FacetResult

  groups?: GroupResult<Document>
}

/**
 * Sometimes {@link doc} will not have the correct type; in these cases,
 * you can simply create a new variable and convert it to the correct type like:
 *
 * @example```ts
 * const fixedType = doc as MyType;
 * ```
 */
export type SingleCallbackComponent<T extends AnyOrama> = (
  orama: T,
  id: string,
  doc?: TypedDocument<T>,
) => SyncOrAsyncValue

/**
 * Sometimes {@link doc} will not have the correct type; in these cases,
 * you can simply create a new variable and convert it to the correct type like:
 *
 * @example```ts
 * const fixedType = doc as MyType;
 * ```
 */
export type MultipleCallbackComponent<T extends AnyOrama> = (
  orama: T,
  doc: TypedDocument<T>[] | string[],
) => SyncOrAsyncValue

/**
 * Sometimes {@link results} will not have the correct type; in these cases,
 * you can simply create a new variable and convert it to the correct type like:
 *
 * @example```ts
 * const fixedType = results as Results<MyType>;
 * ```
 */
export type AfterSearch<T extends AnyOrama, ResultDocument extends TypedDocument<T> = TypedDocument<T>> = (
  db: T,
  params: SearchParams<T, ResultDocument>,
  language: string | undefined,
  results: Results<ResultDocument>,
) => SyncOrAsyncValue

export type IIndexInsertOrRemoveHookFunction = <R = void>(
  index: AnyIndexStore,
  prop: string,
  id: string,
  value: SearchableValue,
  type: SearchableType,
  language: string | undefined,
  tokenizer: Tokenizer,
  docsCount: number,
) => SyncOrAsyncValue<R>

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AnyIndexStore {
  vectorIndexes: Record<string, VectorIndex>
}
export type AnyIndex = IIndex<AnyIndexStore>

export interface IIndex<I extends AnyIndexStore> {
  create<T extends AnyOrama>(
    orama: T,
    sharedInternalDocumentStore: T['internalDocumentIDStore'],
    schema: T['schema'],
  ): SyncOrAsyncValue<I>

  beforeInsert?: IIndexInsertOrRemoveHookFunction
  insert: <T extends I>(
    implementation: IIndex<T>,
    index: T,
    prop: string,
    id: DocumentID,
    value: SearchableValue,
    schemaType: SearchableType,
    language: string | undefined,
    tokenizer: Tokenizer,
    docsCount: number,
  ) => SyncOrAsyncValue
  afterInsert?: IIndexInsertOrRemoveHookFunction

  beforeRemove?: IIndexInsertOrRemoveHookFunction
  remove: <T extends I>(
    implementation: IIndex<T>,
    index: T,
    prop: string,
    id: DocumentID,
    value: SearchableValue,
    schemaType: SearchableType,
    language: string | undefined,
    tokenizer: Tokenizer,
    docsCount: number,
  ) => SyncOrAsyncValue<boolean>
  afterRemove?: IIndexInsertOrRemoveHookFunction

  insertDocumentScoreParameters(
    index: I,
    prop: string,
    id: DocumentID,
    tokens: string[],
    docsCount: number,
  ): SyncOrAsyncValue
  insertTokenScoreParameters(index: I, prop: string, id: DocumentID, tokens: string[], token: string): SyncOrAsyncValue
  removeDocumentScoreParameters(index: I, prop: string, id: DocumentID, docsCount: number): SyncOrAsyncValue
  removeTokenScoreParameters(index: I, prop: string, token: string): SyncOrAsyncValue
  calculateResultScores<T extends AnyOrama, ResultDocument = TypedDocument<T>>(
    context: SearchContext<T, ResultDocument>,
    index: I,
    prop: string,
    term: string,
    ids: DocumentID[],
  ): SyncOrAsyncValue<TokenScore[]>

  search<T extends AnyOrama, ResultDocument = TypedDocument<T>>(
    context: SearchContext<T, ResultDocument>,
    index: I,
    prop: string,
    term: string,
  ): SyncOrAsyncValue<TokenScore[]>
  searchByWhereClause<T extends AnyOrama, ResultDocument = TypedDocument<T>>(
    context: SearchContext<T, ResultDocument>,
    index: I,
    filters: Partial<WhereCondition<T['schema']>>,
  ): SyncOrAsyncValue<InternalDocumentID[]>

  getSearchableProperties(index: I): SyncOrAsyncValue<string[]>
  getSearchablePropertiesWithTypes(index: I): SyncOrAsyncValue<Record<string, SearchableType>>

  load<R = unknown>(sharedInternalDocumentStore: InternalDocumentIDStore, raw: R): SyncOrAsyncValue<I>
  save<R = unknown>(index: I): SyncOrAsyncValue<R>
}

export interface AnyDocumentStore {
  docs: Record<InternalDocumentID, AnyDocument>
}

export interface IDocumentsStore<D extends AnyDocumentStore = AnyDocumentStore> {
  create<T extends AnyOrama>(orama: T, sharedInternalDocumentStore: InternalDocumentIDStore): SyncOrAsyncValue<D>
  get(store: D, id: DocumentID): SyncOrAsyncValue<AnyDocument | undefined>
  getMultiple(store: D, ids: DocumentID[]): SyncOrAsyncValue<(AnyDocument | undefined)[]>
  getAll(store: D): SyncOrAsyncValue<Record<InternalDocumentID, AnyDocument>>
  store(store: D, id: DocumentID, doc: AnyDocument): SyncOrAsyncValue<boolean>
  remove(store: D, id: DocumentID): SyncOrAsyncValue<boolean>
  count(store: D): SyncOrAsyncValue<number>

  load<R = unknown>(sharedInternalDocumentStore: InternalDocumentIDStore, raw: R): SyncOrAsyncValue<D>
  save<R = unknown>(store: D): SyncOrAsyncValue<R>
}

export interface SorterConfig {
  enabled?: boolean
  unsortableProperties?: string[]
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AnySorterStore {}
export type AnySorter = ISorter<AnySorterStore>

export interface ISorter<So extends AnySorterStore> {
  create<T extends AnyOrama>(
    orama: T,
    sharedInternalDocumentStore: InternalDocumentIDStore,
    schema: T['schema'],
    sorterConfig?: SorterConfig,
  ): SyncOrAsyncValue<So>
  insert: <T extends So>(
    sorter: T,
    prop: string,
    id: DocumentID,
    value: SortValue,
    schemaType: SortType,
    language: string | undefined,
  ) => SyncOrAsyncValue
  remove: <T extends So>(sorter: T, prop: string, id: DocumentID) => SyncOrAsyncValue

  load<R = unknown>(sharedInternalDocumentStore: InternalDocumentIDStore, raw: R): SyncOrAsyncValue<So>
  save<R = unknown>(sorter: So): SyncOrAsyncValue<R>

  sortBy<T extends AnyOrama>(
    sorter: So,
    docIds: [DocumentID, number][],
    by: SorterParams<T>,
  ): Promise<[DocumentID, number][]>

  getSortableProperties(sorter: So): SyncOrAsyncValue<string[]>
  getSortablePropertiesWithTypes(sorter: So): SyncOrAsyncValue<Record<string, SortType>>
}

export type Stemmer = (word: string) => string

export type DefaultTokenizerConfig = {
  language?: Language
  stemming?: boolean
  stemmer?: Stemmer
  stemmerSkipProperties?: string | string[]
  tokenizeSkipProperties?: string | string[]
  stopWords?: boolean | string[] | ((stopWords: string[]) => string[] | Promise<string[]>)
  allowDuplicates?: boolean
}

export interface Tokenizer {
  language: string
  normalizationCache: Map<string, string>
  tokenize: (raw: string, language?: string, prop?: string) => SyncOrAsyncValue<string[]>
}

export interface ObjectComponents<I, D, So> {
  tokenizer: Tokenizer | DefaultTokenizerConfig
  index: I
  documentsStore: D
  sorter: So
}

export interface FunctionComponents<S> {
  validateSchema(doc: AnyDocument, schema: S): SyncOrAsyncValue<string | undefined>
  getDocumentIndexId(doc: AnyDocument): SyncOrAsyncValue<string>
  getDocumentProperties(doc: AnyDocument, paths: string[]): SyncOrAsyncValue<Record<string, string | number | boolean>>
  formatElapsedTime(number: bigint): SyncOrAsyncValue<number | string | object | ElapsedTime>
}

export interface SingleOrArrayCallbackComponents<T extends AnyOrama> {
  /**
   * More details {@link SingleCallbackComponent}
   */
  beforeInsert: SingleOrArray<SingleCallbackComponent<T>>
  /**
   * More details {@link SingleCallbackComponent}
   */
  afterInsert: SingleOrArray<SingleCallbackComponent<T>>
  /**
   * More details {@link SingleCallbackComponent}
   */
  beforeRemove: SingleOrArray<SingleCallbackComponent<T>>
  /**
   * More details {@link SingleCallbackComponent}
   */
  afterRemove: SingleOrArray<SingleCallbackComponent<T>>
  /**
   * More details {@link SingleCallbackComponent}
   */
  beforeUpdate: SingleOrArray<SingleCallbackComponent<T>>
  /**
   * More details {@link SingleCallbackComponent}
   */
  afterUpdate: SingleOrArray<SingleCallbackComponent<T>>
  /**
   * More details {@link AfterSearch}
   */
  afterSearch: SingleOrArray<AfterSearch<T>>
  /**
   * More details {@link MultipleCallbackComponent}
   */
  beforeMultipleInsert: SingleOrArray<MultipleCallbackComponent<T>>
  /**
   * More details {@link MultipleCallbackComponent}
   */
  afterMultipleInsert: SingleOrArray<MultipleCallbackComponent<T>>
  /**
   * More details {@link MultipleCallbackComponent}
   */
  beforeMultipleRemove: SingleOrArray<MultipleCallbackComponent<T>>
  /**
   * More details {@link MultipleCallbackComponent}
   */
  afterMultipleRemove: SingleOrArray<MultipleCallbackComponent<T>>
  /**
   * More details {@link MultipleCallbackComponent}
   */
  beforeMultipleUpdate: SingleOrArray<MultipleCallbackComponent<T>>
  /**
   * More details {@link MultipleCallbackComponent}
   */
  afterMultipleUpdate: SingleOrArray<MultipleCallbackComponent<T>>
}

export interface ArrayCallbackComponents<T extends AnyOrama> {
  /**
   * More details {@link SingleCallbackComponent}
   */
  beforeInsert: SingleCallbackComponent<T>[]
  /**
   * More details {@link SingleCallbackComponent}
   */
  afterInsert: SingleCallbackComponent<T>[]
  /**
   * More details {@link SingleCallbackComponent}
   */
  beforeRemove: SingleCallbackComponent<T>[]
  /**
   * More details {@link SingleCallbackComponent}
   */
  afterRemove: SingleCallbackComponent<T>[]
  /**
   * More details {@link SingleCallbackComponent}
   */
  beforeUpdate: SingleCallbackComponent<T>[]
  /**
   * More details {@link SingleCallbackComponent}
   */
  afterUpdate: SingleCallbackComponent<T>[]
  /**
   * More details {@link AfterSearch}
   */
  afterSearch: AfterSearch<T>[]
  /**
   * More details {@link MultipleCallbackComponent}
   */
  beforeMultipleInsert: MultipleCallbackComponent<T>[]
  /**
   * More details {@link MultipleCallbackComponent}
   */
  afterMultipleInsert: MultipleCallbackComponent<T>[]
  /**
   * More details {@link MultipleCallbackComponent}
   */
  beforeMultipleRemove: MultipleCallbackComponent<T>[]
  /**
   * More details {@link MultipleCallbackComponent}
   */
  afterMultipleRemove: MultipleCallbackComponent<T>[]
  /**
   * More details {@link MultipleCallbackComponent}
   */
  beforeMultipleUpdate: MultipleCallbackComponent<T>[]
  /**
   * More details {@link MultipleCallbackComponent}
   */
  afterMultipleUpdate: MultipleCallbackComponent<T>[]
}

export type Components<T extends AnyOrama, TSchema, TIndex, TDocumentStore, TSorter> = Partial<
  ObjectComponents<TIndex, TDocumentStore, TSorter> & FunctionComponents<TSchema> & SingleOrArrayCallbackComponents<T>
>

export const kInsertions = Symbol('orama.insertions')
export const kRemovals = Symbol('orama.removals')

export type PickIfExtends<T, TExtends, TDefault> = T extends TExtends ? T : TDefault

type Internals<
  TSchema,
  TIndex extends AnyIndexStore,
  TDocumentStore extends AnyDocumentStore,
  TSorter extends AnySorterStore,
> = {
  schema: TSchema
  typeSchema: Schema<TSchema>
  tokenizer: Tokenizer
  index: IIndex<TIndex>
  documentsStore: IDocumentsStore<TDocumentStore>
  sorter: ISorter<TSorter>
  data: {
    index: TIndex
    docs: TDocumentStore
    sorting: TSorter
  }
  internalDocumentIDStore: InternalDocumentIDStore
  caches: Record<string, unknown>
  [kInsertions]: number | undefined
  [kRemovals]: number | undefined
}

type OramaID = {
  id: string
}

export type ExtractSchema<T> = T extends { schema: infer RawSchema } ? Schema<RawSchema> : never

export type AnyGeneric<T> = T[]
export type AnyGenericIndex<T> = T extends IIndex<infer TStore>
  ? TStore extends AnyIndexStore
    ? TStore
    : never
  : AnyIndexStore
export type AnyGenericDocumentStore<T> = T extends IDocumentsStore<infer TStore>
  ? TStore extends AnyDocumentStore
    ? TStore
    : never
  : AnyDocumentStore
export type AnyGenericSorter<T> = T extends ISorter<infer TSorter>
  ? TSorter extends AnySorterStore
    ? TSorter
    : never
  : AnySorterStore

export type PickInferGeneric<T, Default> = T extends AnyGeneric<infer Generic>
  ? Generic extends Default
    ? Generic
    : never
  : never

export type Orama<TSchema, TIndex = IIndex<Index>, TDocumentStore = IDocumentsStore<DocumentsStore>, TSorter = ISorter<Sorter>> = FunctionComponents<TSchema> &
  Internals<TSchema, AnyGenericIndex<TIndex>, AnyGenericDocumentStore<TDocumentStore>, AnyGenericSorter<TSorter>> &
  ArrayCallbackComponents<any> &
  OramaID

export type AnyOrama<TSchema = any> = FunctionComponents<TSchema> &
  Internals<TSchema, AnyIndexStore, AnyDocumentStore, AnySorterStore> &
  ArrayCallbackComponents<any> &
  OramaID
