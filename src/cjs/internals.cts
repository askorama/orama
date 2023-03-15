import type { BoundedMetric } from "../components/levenshtein.js";

export interface OramaInternals {
  boundedLevenshtein(a: string, b: string, tolerance: number): BoundedMetric;
  formatNanoseconds(value: number | bigint): string;
  getNanosecondsTime(): bigint;
}

export type RequireCallback = (err: Error | undefined, orama?: OramaInternals) => void;

export function requireOramaInternals(callback: RequireCallback): void {
  import("../internals.js")
    .then((loaded: OramaInternals) => setTimeout(() => callback(undefined, loaded), 1))
    .catch((error: Error) => setTimeout(() => callback(error), 1));
}
