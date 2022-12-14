import type { TokenScore } from "./lyra";

export type Runtime = typeof knownRuntimes[number];

export type IIntersectTokenScores = (options: { data: TokenScore[][] }) => { data: TokenScore[] };

const baseId = Date.now().toString().slice(5);
let lastId = 0;

const k = 1024;
const nano = BigInt(1e3);
const milli = BigInt(1e6);
const second = BigInt(1e9);

export const knownRuntimes = ["deno", "node", "browser", "unknown"] as const;

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

// Adapted from https://github.com/lovasoa/fast_array_intersect
// MIT Licensed (https://github.com/lovasoa/fast_array_intersect/blob/master/LICENSE)
// while on tag https://github.com/lovasoa/fast_array_intersect/tree/v1.1.0
export function intersectTokenScores({ data: arrays }: { data: TokenScore[][] }): { data: TokenScore[] } {
  if (arrays.length === 0) return { data: [] };

  for (let i = 1; i < arrays.length; i++) {
    if (arrays[i].length < arrays[0].length) {
      const tmp = arrays[0];
      arrays[0] = arrays[i];
      arrays[i] = tmp;
    }
  }

  const set: Map<string, [number, number]> = new Map();
  for (const elem of arrays[0]) {
    set.set(elem[0], [1, elem[1]]);
  }

  const arrLength = arrays.length;
  for (let i = 1; i < arrLength; i++) {
    let found = 0;
    for (const elem of arrays[i]) {
      const [count, score] = set.get(elem[0] ?? "") ?? [0, 0];
      if (count === i) {
        set.set(elem[0] ?? "", [count + 1, score + elem[1]]);
        found++;
      }
    }

    if (found === 0) {
      return { data: [] };
    }
  }

  const result: TokenScore[] = [];

  for (const [token, [count, score]] of set) {
    if (count === arrLength) {
      result.push([token, score]);
    }
  }

  return { data: result };
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

export function includes<T>(array: T[] | readonly T[], element: T): boolean {
  for (let i = 0; i < array.length; i++) {
    if (array[i] === element) {
      return true;
    }
  }
  return false;
}

export function sortTokenScorePredicate(a: TokenScore, b: TokenScore): number {
  return b[1] - a[1];
}

export let currentRuntime = getCurrentRuntime();

export function getCurrentRuntime(): Runtime {
  if (currentRuntime) {
    return currentRuntime;
  }

  if (typeof process !== "undefined" && process.versions !== undefined) {
    currentRuntime = "node";
    return currentRuntime;
  }

  // @ts-expect-error "Deno" global variable is defined in Deno only
  if (typeof Deno !== "undefined") {
    currentRuntime = "deno";
    return currentRuntime;
  }

  if (typeof window !== "undefined") {
    currentRuntime = "browser";
    return currentRuntime;
  }

  return "unknown";
}

export function isRuntime(runtime: Runtime): boolean {
  return getCurrentRuntime() === runtime;
}
