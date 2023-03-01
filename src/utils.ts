import { SUPPORTED_PROPERTY_TYPES } from "./constants.js";
import type { PropertiesSchema, ResolveSchema, TokenScore } from "./types/index.js";

const baseId = Date.now().toString().slice(5);
let lastId = 0;

const k = 1024;
const nano = BigInt(1e3);
const milli = BigInt(1e6);
const second = BigInt(1e9);

export const isServer = typeof window === "undefined";

export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) {
    return "0 Bytes";
  }
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function formatNanoseconds(value: number | bigint): string {
  if (typeof value === "number") {
    value = BigInt(value);
  }

  if (value < nano) {
    return `${value}ns`;
  } else if (value < milli) {
    return `${value / nano}μs`;
  } else if (value < second) {
    return `${value / milli}ms`;
  }

  return `${value / second}s`;
}

export function getNanosecondsTime(): bigint {
  if (typeof process !== "undefined" && process.hrtime !== undefined) {
    return process.hrtime.bigint();
  }

  if (typeof performance !== "undefined") {
    return BigInt(Math.floor(performance.now() * 1e6));
  }

  // @todo: fallback to V8 native method to get microtime
  return BigInt(0);
}

export function uniqueId(): string {
  return `${baseId}-${lastId++}`;
}

export function getOwnProperty<T = unknown>(object: Record<string, T>, property: string): T | undefined {
  // Checks if `hasOwn` method is defined avoiding errors with older Node.js versions
  if (Object.hasOwn === undefined) {
    return Object.prototype.hasOwnProperty.call(object, property) ? object[property] : undefined;
  }

  return Object.hasOwn(object, property) ? object[property] : undefined;
}

export function getTokenFrequency(token: string, tokens: string[]): number {
  let count = 0;

  for (const t of tokens) {
    if (t === token) {
      count++;
    }
  }

  return count;
}

export function insertSortedValue(
  arr: TokenScore[],
  el: TokenScore,
  compareFn = sortTokenScorePredicate,
): TokenScore[] {
  let low = 0;
  let high = arr.length;
  let mid;

  while (low < high) {
    mid = (low + high) >>> 1;
    if (compareFn(el, arr[mid]) < 0) {
      high = mid;
    } else {
      low = mid + 1;
    }
  }

  arr.splice(low, 0, el);

  return arr;
}

export function sortTokenScorePredicate(a: TokenScore, b: TokenScore): number {
  return b[1] - a[1];
}

// Intersection function taken from https://github.com/lovasoa/fast_array_intersect.
// MIT Licensed at the time of writing.
export function intersect<T>(arrays: ReadonlyArray<T>[]): T[] {
  if (arrays.length === 0) return [];

  for (let i=1; i<arrays.length; i++) {
    if(arrays[i].length < arrays[0].length) {
      const tmp = arrays[0];
      arrays[0] = arrays[i];
      arrays[i] = tmp;
    }
  }

  const set = new Map();
  for(const elem of arrays[0]) {
    set.set(elem, 1);
  }
  for (let i=1; i<arrays.length; i++) {
    let found = 0;
    for(const elem of arrays[i]) {
      const count = set.get(elem)
      if (count === i) {
        set.set(elem,  count + 1);
        found++;
      }
    }
    if (found === 0) return []; 
  }

  return arrays[0].filter(e => {
    const count = set.get(e);
    if (count !== undefined) set.set(e, 0);
    return count === arrays.length
  });
}

/**
 * Retrieve a deeply nested value from an object using a dot-separated string path.
 *
 * @template T - The expected type of the nested value.
 * @param {Record<string, any>} obj - The object to retrieve the value from.
 * @param {string} path - The dot-separated string path to the nested value.
 * @returns {(T | undefined)} - The nested value, or undefined if the path is invalid.
 */

export function getNested<T = unknown>(
  obj: Record<string, any>,
  path: string
): T | undefined {
  return path.split(".").reduce((o, p) => o && typeof o === "object" ? o[p] : undefined, obj) as T | undefined;
}

/**
 * Flattens an object with deeply nested properties, such that (for example), this:
 * `{ foo: { bar: { baz: 10 } } }` becomes: `{ 'foo.bar.baz': 10 }`
 *
 * @param {object} obj - The object to flatten.
 * @param {string} [prefix=''] - The prefix to use for each key in the flattened object.
 * @returns {object} - The flattened object.
 */

export function flattenObject(obj: object, prefix = ''): object {
  const result: { [key: string]: any } = {};
  for (const key in obj) {
    const objKey = (obj as any)[key];
    if (typeof objKey === 'object' && objKey !== null) {
      Object.assign(result, flattenObject(objKey, prefix + key + '.'));
    } else {
      result[prefix + key] = objKey;
    }
  }
  return result;
}

function isArray(t: object) {
  return Array?.isArray(t) ?? t instanceof Array;
}

function isArrayBuffer(t: object) {
  return t.constructor.name == "ArrayBuffer" || (ArrayBuffer && t instanceof ArrayBuffer);
}

function isArrayBufferView(t: object) {
  // This also applies on TypedArray subclasses like "Int8Array" etc...
  return !!ArrayBuffer?.isView(t);
}

function isMapOrSet(t: object) {
  return (
    (Set ? t.constructor.name == "Set" : t instanceof Set) || (Map ? t.constructor.name == "Map" : t instanceof Map)
  );
}

function isWeakMapOrSet(t: object) {
  return (
    (WeakSet ? t.constructor.name == "WeakSet" : t instanceof WeakSet) ||
    (WeakMap ? t.constructor.name == "WeakMap" : t instanceof WeakMap)
  );
}

function isSharedArrayBuffer(t: object): t is SharedArrayBuffer {
  return t.constructor.name == "SharedArrayBuffer" || (SharedArrayBuffer && t instanceof SharedArrayBuffer);
}

export function isSerializable<S extends PropertiesSchema>(docValue: ResolveSchema<S>[Extract<keyof S, string>]) {
  if (typeof docValue == "object") {
    return !(
      isArray(docValue) ||
      isMapOrSet(docValue) ||
      isWeakMapOrSet(docValue) ||
      isArrayBufferView(docValue) ||
      isArrayBuffer(docValue) ||
      isSharedArrayBuffer(docValue)
    );
  } else {
    return (SUPPORTED_PROPERTY_TYPES as unknown as string[]).includes(typeof docValue);
  }
}
