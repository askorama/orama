import type { AnyOrama } from '../types.js'
import { DocumentID } from '../components/internal-document-id-store.js'
export declare function remove<T extends AnyOrama>(
  orama: T,
  id: DocumentID,
  language?: string,
  skipHooks?: boolean
): Promise<boolean> | boolean
export declare function removeMultiple<T extends AnyOrama>(
  orama: T,
  ids: DocumentID[],
  batchSize?: number,
  language?: string,
  skipHooks?: boolean
): Promise<number> | number
