import type { Optional } from '../types.js'
import { Point } from '../trees/bkd.js'
import {
  AnyDocument,
  AnyOrama,
  ArraySearchableType,
  ElapsedTime,
  ScalarSearchableType,
  TypedDocument,
  Vector
} from '../types.js'
export { getDocumentProperties } from '../utils.js'
export declare function formatElapsedTime(n: bigint): ElapsedTime
export declare function getDocumentIndexId(doc: AnyDocument): string
export declare function validateSchema<T extends AnyOrama, ResultDocument extends TypedDocument<T>>(
  doc: ResultDocument,
  schema: T['schema']
): Optional<string>
export declare function isGeoPointType(type: unknown): type is Point
export declare function isVectorType(type: unknown): type is Vector
export declare function isArrayType(type: unknown): type is ArraySearchableType
export declare function getInnerType(type: ArraySearchableType): ScalarSearchableType
export declare function getVectorSize(type: string): number
