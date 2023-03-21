import type {
  boundedLevenshtein as esmBoundedLevenshtein,
  sprintf as esmSprintf,
  formatBytes as esmFormatBytes,
  formatNanoseconds as esmFormatNanoseconds,
  getNanosecondsTime as esmGetNanosecondsTime,
  uniqueId as esmUniqueId,
} from '../internals.js'

export interface OramaInternals {
  boundedLevenshtein: typeof esmBoundedLevenshtein
  sprintf: typeof esmSprintf
  formatBytes: typeof esmFormatBytes
  formatNanoseconds: typeof esmFormatNanoseconds
  getNanosecondsTime: typeof esmGetNanosecondsTime
  uniqueId: typeof esmUniqueId
}

export type RequireCallback = (err: Error | undefined, orama?: OramaInternals) => void

export function requireOramaInternals(callback: RequireCallback): void {
  import('../internals.js')
    .then((loaded: OramaInternals) => setTimeout(() => callback(undefined, loaded), 1))
    .catch((error: Error) => setTimeout(() => callback(error), 1))
}
