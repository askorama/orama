import { InternalDocumentID } from './internal-document-id-store.js'
export declare function intersectFilteredIDs(
  filtered: InternalDocumentID[],
  lookedUp: [InternalDocumentID, number][]
): [InternalDocumentID, number][]
