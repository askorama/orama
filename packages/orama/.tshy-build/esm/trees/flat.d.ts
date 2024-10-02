import { InternalDocumentID } from '../components/internal-document-id-store.js'
import { EnumArrComparisonOperator, EnumComparisonOperator, Nullable, ScalarSearchableValue } from '../types.js'
export interface FlatTree {
  numberToDocumentId: Map<ScalarSearchableValue, InternalDocumentID[]>
}
export declare function create(): FlatTree
export declare function insert(root: FlatTree, key: ScalarSearchableValue, value: InternalDocumentID): FlatTree
export declare function find(root: FlatTree, key: ScalarSearchableValue): Nullable<InternalDocumentID[]>
export declare function remove(root: Nullable<FlatTree>, key: ScalarSearchableValue): Nullable<FlatTree>
export declare function removeDocument(root: FlatTree, id: InternalDocumentID, key: ScalarSearchableValue): void
export declare function contains(node: FlatTree, key: ScalarSearchableValue): boolean
export declare function getSize(root: Nullable<FlatTree>): number
export declare function filter(root: FlatTree, operation: EnumComparisonOperator): InternalDocumentID[]
export declare function filterArr(root: FlatTree, operation: EnumArrComparisonOperator): InternalDocumentID[]
