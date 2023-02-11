import type { TokenScore } from "./types/index.js";

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

export function getNested<T = unknown>(
  obj: Record<string, any>,
  path: string
): T | undefined {
  return path.split(".").reduce((o, p) => o && typeof o === "object" ? o[p] : undefined, obj) as T | undefined;
}

export function intersect<T>(...arrays: T[][]): T[] {
  let smallestArrayIndex = 0;
  let smallestArrayLength = arrays[0].length;

  for (let i = 1; i < arrays.length; i++) {
    if (arrays[i].length < smallestArrayLength) {
      smallestArrayIndex = i;
      smallestArrayLength = arrays[i].length;
    }
  }

  if (smallestArrayIndex !== 0) {
    [arrays[0], arrays[smallestArrayIndex]] = [arrays[smallestArrayIndex], arrays[0]];
  }

  const hashTable = new Map<T, number>();
  arrays[0].forEach((element) => {
    hashTable.set(element, 1);
  });

  const result: T[] = [];

  for (let i = 1; i < arrays.length; i++) {
    const currentArray = arrays[i];
    let hasCommonElements = false;

    for (let j = 0; j < currentArray.length; j++) {
      const currentElement = currentArray[j];

      if (hashTable.has(currentElement)) {
        hasCommonElements = true;
        const count = hashTable.get(currentElement)! - 1;

        if (count === 0) {
          hashTable.delete(currentElement);
        } else {
          hashTable.set(currentElement, count);
        }

        result.push(currentElement);
      }
    }

    if (!hasCommonElements) {
      return result;
    }
  }

  return result;
}
