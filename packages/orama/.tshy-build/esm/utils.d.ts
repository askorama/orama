import type { AnyDocument, GeosearchDistanceUnit, Optional, Results, SearchableValue, TokenScore } from './types.js'
export declare const isServer: boolean
/**
 * This value can be increased up to 100_000
 * But i don't know if this value change from nodejs to nodejs
 * So I will keep a safer value here.
 */
export declare const MAX_ARGUMENT_FOR_STACK = 65535
/**
 * This method is needed to used because of issues like: https://github.com/askorama/orama/issues/301
 * that issue is caused because the array that is pushed is huge (>100k)
 *
 * @example
 * ```ts
 * safeArrayPush(myArray, [1, 2])
 * ```
 */
export declare function safeArrayPush<T>(arr: T[], newArr: T[]): void
export declare function sprintf(template: string, ...args: Array<string | number>): string
export declare function formatBytes(bytes: number, decimals?: number): string
export declare function isInsideWebWorker(): boolean
export declare function isInsideNode(): boolean
export declare function getNanosecondTimeViaPerformance(): bigint
export declare function formatNanoseconds(value: number | bigint): string
export declare function getNanosecondsTime(): bigint
export declare function uniqueId(): string
export declare function getOwnProperty<T = unknown>(object: Record<string, T>, property: string): T | undefined
export declare function getTokenFrequency(token: string, tokens: string[]): number
export declare function insertSortedValue(
  arr: TokenScore[],
  el: TokenScore,
  compareFn?: typeof sortTokenScorePredicate
): TokenScore[]
export declare function sortTokenScorePredicate(a: TokenScore, b: TokenScore): number
export declare function intersect<T>(arrays: Array<readonly T[]>): T[]
export declare function getDocumentProperties(doc: AnyDocument, paths: string[]): Record<string, SearchableValue>
export declare function getNested<T = SearchableValue>(obj: object, path: string): Optional<T>
export declare function flattenObject(obj: object, prefix?: string): AnyDocument
export declare function convertDistanceToMeters(distance: number, unit: GeosearchDistanceUnit): number
export declare function removeVectorsFromHits(searchResult: Results<AnyDocument>, vectorProperties: string[]): void
export declare function isPromise(obj: any): obj is Promise<unknown>
export declare function isAsyncFunction(func: any): boolean
