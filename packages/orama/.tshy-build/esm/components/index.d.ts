import type {
  AnyIndexStore,
  AnyOrama,
  IIndex,
  SearchableType,
  SearchableValue,
  SearchContext,
  SearchParamsFullText,
  Tokenizer,
  TokenScore,
  TypedDocument,
  VectorIndex,
  WhereCondition
} from '../types.js'
import type { InsertOptions } from '../methods/insert.js'
import { RootNode as AVLRootNode } from '../trees/avl.js'
import { FlatTree } from '../trees/flat.js'
import { Node as RadixNode } from '../trees/radix.js'
import { RootNode as BKDNode } from '../trees/bkd.js'
import { DocumentID, InternalDocumentID, InternalDocumentIDStore } from './internal-document-id-store.js'
export type FrequencyMap = {
  [property: string]: {
    [documentID: InternalDocumentID]:
      | {
          [token: string]: number
        }
      | undefined
  }
}
export type BooleanIndex = {
  true: InternalDocumentID[]
  false: InternalDocumentID[]
}
export type TreeType = 'AVL' | 'Radix' | 'Bool' | 'Flat' | 'BKD'
export type TTree<T = TreeType, N = unknown> = {
  type: T
  node: N
  isArray: boolean
}
export type Tree =
  | TTree<'Radix', RadixNode>
  | TTree<'AVL', AVLRootNode<number, InternalDocumentID[]>>
  | TTree<'Bool', BooleanIndex>
  | TTree<'Flat', FlatTree>
  | TTree<'BKD', BKDNode>
export interface Index extends AnyIndexStore {
  sharedInternalDocumentStore: InternalDocumentIDStore
  indexes: Record<string, Tree>
  vectorIndexes: Record<string, VectorIndex>
  searchableProperties: string[]
  searchablePropertiesWithTypes: Record<string, SearchableType>
  frequencies: FrequencyMap
  tokenOccurrences: Record<string, Record<string, number>>
  avgFieldLength: Record<string, number>
  fieldLengths: Record<string, Record<InternalDocumentID, number | undefined>>
}
export declare function insertDocumentScoreParameters(
  index: Index,
  prop: string,
  id: DocumentID,
  tokens: string[],
  docsCount: number
): void
export declare function insertTokenScoreParameters(
  index: Index,
  prop: string,
  id: DocumentID,
  tokens: string[],
  token: string
): void
export declare function removeDocumentScoreParameters(
  index: Index,
  prop: string,
  id: DocumentID,
  docsCount: number
): void
export declare function removeTokenScoreParameters(index: Index, prop: string, token: string): void
export declare function calculateResultScores<T extends AnyOrama, ResultDocument = TypedDocument<T>>(
  context: SearchContext<T, ResultDocument, SearchParamsFullText<T, ResultDocument>>,
  index: Index,
  prop: string,
  term: string,
  ids: DocumentID[]
): TokenScore[]
export declare function create<T extends AnyOrama, TSchema extends T['schema']>(
  orama: T,
  sharedInternalDocumentStore: T['internalDocumentIDStore'],
  schema: TSchema,
  index?: Index,
  prefix?: string
): Index
export declare function insert(
  implementation: IIndex<Index>,
  index: Index,
  prop: string,
  id: DocumentID,
  value: SearchableValue,
  schemaType: SearchableType,
  language: string | undefined,
  tokenizer: Tokenizer,
  docsCount: number,
  options?: InsertOptions
): void
export declare function remove(
  implementation: IIndex<Index>,
  index: Index,
  prop: string,
  id: DocumentID,
  value: SearchableValue,
  schemaType: SearchableType,
  language: string | undefined,
  tokenizer: Tokenizer,
  docsCount: number
): boolean
export declare function search<T extends AnyOrama, ResultDocument = TypedDocument<T>>(
  context: SearchContext<T, ResultDocument, SearchParamsFullText<T, ResultDocument>>,
  index: Index,
  prop: string,
  term: string
): TokenScore[]
export declare function searchByWhereClause<T extends AnyOrama, ResultDocument = TypedDocument<T>>(
  context: SearchContext<T, ResultDocument>,
  index: Index,
  filters: Partial<WhereCondition<T['schema']>>
): number[]
export declare function getSearchableProperties(index: Index): string[]
export declare function getSearchablePropertiesWithTypes(index: Index): Record<string, SearchableType>
export declare function load<R = unknown>(sharedInternalDocumentStore: InternalDocumentIDStore, raw: R): Index
export declare function save<R = unknown>(index: Index): R
export declare function createIndex(): IIndex<Index>
