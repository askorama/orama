import { InternalDocumentID } from '../components/internal-document-id-store.js'
import type {
  AnyOrama,
  BM25Params,
  LiteralUnion,
  Result,
  Results,
  SearchContext,
  SearchParams,
  Tokenizer,
  TypedDocument
} from '../types.js'
export declare const defaultBM25Params: BM25Params
export declare function createSearchContext<T extends AnyOrama, ResultDocument = TypedDocument<T>>(
  tokenizer: Tokenizer,
  index: T['index'],
  documentsStore: T['documentsStore'],
  language: string | undefined,
  params: SearchParams<T, ResultDocument>,
  properties: string[],
  tokens: string[],
  docsCount: number,
  timeStart: bigint
): SearchContext<T, ResultDocument>
export declare function search<T extends AnyOrama, ResultDocument = TypedDocument<T>>(
  orama: T,
  params: SearchParams<T, ResultDocument>,
  language?: string
): Results<ResultDocument> | Promise<Results<ResultDocument>>
export declare function fetchDocumentsWithDistinct<T extends AnyOrama, ResultDocument extends TypedDocument<T>>(
  orama: T,
  uniqueDocsArray: [InternalDocumentID, number][],
  offset: number,
  limit: number,
  distinctOn: LiteralUnion<T['schema']>
): Result<ResultDocument>[]
export declare function fetchDocuments<T extends AnyOrama, ResultDocument extends TypedDocument<T>>(
  orama: T,
  uniqueDocsArray: [InternalDocumentID, number][],
  offset: number,
  limit: number
): Result<ResultDocument>[]
