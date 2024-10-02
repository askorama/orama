import type { Nullable, GenericSorting } from '../types.js'
import type { InternalDocumentID } from '../components/internal-document-id-store.js'
export interface Point {
  lon: number
  lat: number
}
export interface Node {
  point: Point
  docIDs?: InternalDocumentID[]
  left?: Node
  right?: Node
  parent?: Node
}
export interface RootNode {
  root: Nullable<Node>
}
export interface GeoSearchResult {
  point: Point
  docIDs: InternalDocumentID[]
}
export type SortGeoPoints = Nullable<GenericSorting>
export declare function create(): RootNode
export declare function insert(tree: RootNode, point: Point, docIDs: InternalDocumentID[]): void
export declare function contains(tree: RootNode, point: Point): boolean
export declare function removeDocByID(tree: RootNode, point: Point, docID: InternalDocumentID): void
export declare function getDocIDsByCoordinates(tree: RootNode, point: Point): Nullable<InternalDocumentID[]>
export declare function searchByRadius(
  node: Nullable<Node>,
  center: Point,
  radius: number,
  inclusive?: boolean,
  sort?: SortGeoPoints,
  highPrecision?: boolean
): GeoSearchResult[]
export declare function searchByPolygon(
  root: Nullable<Node>,
  polygon: Point[],
  inclusive?: boolean,
  sort?: SortGeoPoints,
  highPrecision?: boolean
): GeoSearchResult[]
