import type {
  boundedLevenshtein as esmBoundedLevenshtein,
  formatBytes as esmFormatBytes,
  formatNanoseconds as esmFormatNanoseconds,
  getNanosecondsTime as esmGetNanosecondsTime,
  uniqueId as esmUniqueId,
  safeArrayPush as esmSafeArrayPush,
  convertDistanceToMeters as esmConvertDistanceToMeters,
  BM25 as esmBM25
} from '../internals.ts'

let _esmBoundedLevenshtein: typeof esmBoundedLevenshtein
let _esmFormatBytes: typeof esmFormatBytes
let _esmFormatNanoseconds: typeof esmFormatNanoseconds
let _esmGetNanosecondsTime: typeof esmGetNanosecondsTime
let _esmUniqueId: typeof esmUniqueId
let _esmSafeArrayPush: typeof esmSafeArrayPush
let _esmConvertDistanceToMeters: typeof esmConvertDistanceToMeters
let _esmBM25: typeof esmBM25

export async function boundedLevenshtein(
  ...args: Parameters<typeof esmBoundedLevenshtein>
): ReturnType<typeof esmBoundedLevenshtein> {
  if (!_esmBoundedLevenshtein) {
    const imported = await import('../internals.ts')
    _esmBoundedLevenshtein = imported.boundedLevenshtein
  }

  return _esmBoundedLevenshtein(...args)
}

export async function formatBytes(...args: Parameters<typeof esmFormatBytes>): ReturnType<typeof esmFormatBytes> {
  if (!_esmFormatBytes) {
    const imported = await import('../internals.ts')
    _esmFormatBytes = imported.formatBytes
  }

  return _esmFormatBytes(...args)
}

export async function formatNanoseconds(
  ...args: Parameters<typeof esmFormatNanoseconds>
): ReturnType<typeof esmFormatNanoseconds> {
  if (!_esmFormatNanoseconds) {
    const imported = await import('../internals.ts')
    _esmFormatNanoseconds = imported.formatNanoseconds
  }

  return _esmFormatNanoseconds(...args)
}

export async function getNanosecondsTime(
  ...args: Parameters<typeof esmGetNanosecondsTime>
): ReturnType<typeof esmGetNanosecondsTime> {
  if (!_esmGetNanosecondsTime) {
    const imported = await import('../internals.ts')
    _esmGetNanosecondsTime = imported.getNanosecondsTime
  }

  return _esmGetNanosecondsTime(...args)
}

export async function uniqueId(...args: Parameters<typeof esmUniqueId>): ReturnType<typeof esmUniqueId> {
  if (!_esmUniqueId) {
    const imported = await import('../internals.ts')
    _esmUniqueId = imported.uniqueId
  }

  return _esmUniqueId(...args)
}

export async function safeArrayPush(...args: Parameters<typeof esmSafeArrayPush>): Promise<void> {
  if (!_esmSafeArrayPush) {
    const imported = await import('../internals.ts')
    _esmSafeArrayPush = imported.safeArrayPush
  }

  return _esmSafeArrayPush(...args)
}

export async function convertDistanceToMeters(...args: Parameters<typeof esmConvertDistanceToMeters>): Promise<number> {
  if (!_esmConvertDistanceToMeters) {
    const imported = await import('../internals.ts')
    _esmConvertDistanceToMeters = imported.convertDistanceToMeters
  }

  return _esmConvertDistanceToMeters(...args)
}

export async function BM25(...args: Parameters<typeof esmBM25>): Promise<number> {
  if (!_esmBM25) {
    const imported = await import('../internals.ts')
    _esmBM25 = imported.BM25
  }

  return _esmBM25(...args)
}
