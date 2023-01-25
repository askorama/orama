import type { BoundedMetric } from "../levenshtein.js";

export interface LyraInternals {
  boundedLevenshtein(a: string, b: string, tolerance: number): BoundedMetric;
  formatNanoseconds(value: number | bigint): string;
  getNanosecondsTime(): bigint;
}

export type RequireCallback = (err: Error | undefined, lyra?: LyraInternals) => void;

export function requireLyraInternals(callback: RequireCallback): void {
  import("../internals.js")
    .then((loaded: LyraInternals) => setTimeout(() => callback(undefined, loaded), 1))
    .catch((error: Error) => setTimeout(() => callback(error), 1));
}
