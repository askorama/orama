import { InternalDocumentID } from '../components/internal-document-id-store.js'
interface FindParams {
  term: string
  exact?: boolean
  tolerance?: number
}
type FindResult = Record<string, InternalDocumentID[]>
declare class Node {
  k: string
  s: string
  c: Map<string, Node>
  d: Set<InternalDocumentID>
  e: boolean
  w: string
  constructor(key: string, subWord: string, end: boolean)
  updateParent(parent: Node): void
  addDocument(docID: InternalDocumentID): void
  removeDocument(docID: InternalDocumentID): boolean
  findAllWords(output: FindResult, term: string, exact?: boolean, tolerance?: number): FindResult
  toJSON(): object
  static fromJSON(json: any): Node
}
export declare class RadixTree {
  root: Node
  constructor()
  insert(word: string, docId: InternalDocumentID): void
  private _findLevenshtein
  find({ term, exact, tolerance }: FindParams): FindResult
  contains(term: string): boolean
  removeWord(term: string): boolean
  removeDocumentByWord(term: string, docID: InternalDocumentID, exact?: boolean): boolean
  toJSON(): object
  static fromJSON(json: any): RadixTree
  private static getCommonPrefix
}
export {}
