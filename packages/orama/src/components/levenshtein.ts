export type BoundedMetric = {
  isBounded: boolean
  distance: number
}

/**
 * Inspired by:
 * https://github.com/Yomguithereal/talisman/blob/86ae55cbd040ff021d05e282e0e6c71f2dde21f8/src/metrics/levenshtein.js#L218-L340
 */
function _boundedLevenshtein(a: string, b: string, tolerance: number): number {
  // the strings are the same
  if (a === b) {
    return 0
  }

  // a should be the shortest string
  const swap = a
  if (a.length > b.length) {
    a = b
    b = swap
  }

  let lenA = a.length
  let lenB = b.length

  // ignore common prefix
  let startIdx = 0
  while (startIdx < lenA && a.charCodeAt(startIdx) === b.charCodeAt(startIdx)) {
    startIdx++
  }

  // if string A is subfix of B, we consider the distance 0
  // because we search for prefix!
  // fix https://github.com/askorama/orama/issues/544
  if (startIdx === lenA) {
    return 0
  }

  // ignore common suffix
  // note: `~-` decreases by a unit in a bitwise fashion
  while (lenA > 0 && a.charCodeAt(~-lenA) === b.charCodeAt(~-lenB)) {
    lenA--
    lenB--
  }

  // early return when the smallest string is empty
  if (!lenA) {
    return lenB > tolerance ? -1 : lenB
  }

  lenA -= startIdx
  lenB -= startIdx

  // If both strings are smaller than the tolerance, we accept any distance
  // Probably the result distance is wrong, but we don't care:
  // It is always less then the tolerance!
  if (lenA <= tolerance && lenB <= tolerance) {
    return lenA > lenB ? lenA : lenB
  }

  const delta = lenB - lenA

  if (tolerance > lenB) {
    tolerance = lenB
  } else if (delta > tolerance) {
    return -1
  }

  let i = 0
  const row: number[] = []
  const characterCodeCache: number[] = []

  while (i < tolerance) {
    characterCodeCache[i] = b.charCodeAt(startIdx + i)
    row[i] = ++i
  }

  while (i < lenB) {
    characterCodeCache[i] = b.charCodeAt(startIdx + i)
    row[i++] = tolerance + 1
  }

  const offset = tolerance - delta
  const haveMax = tolerance < lenB

  let jStart = 0
  let jEnd = tolerance

  let current = 0
  let left = 0
  let above = 0
  let charA = 0
  let j = 0

  // Starting the nested loops
  for (i = 0; i < lenA; i++) {
    left = i
    current = i + 1

    charA = a.charCodeAt(startIdx + i)
    jStart += i > offset ? 1 : 0
    jEnd += jEnd < lenB ? 1 : 0

    for (j = jStart; j < jEnd; j++) {
      above = current

      current = left
      left = row[j]

      if (charA !== characterCodeCache[j]) {
        // insert current
        if (left < current) {
          current = left
        }

        // delete current
        if (above < current) {
          current = above
        }

        current++
      }

      row[j] = current
    }

    if (haveMax && row[i + delta] > tolerance) {
      return -1
    }
  }

  return current <= tolerance ? current : -1
}

/**
 * Computes the Levenshtein distance between two strings (a, b), returning early with -1 if the distance
 * is greater than the given tolerance.
 * It assumes that:
 * - tolerance >= ||a| - |b|| >= 0
 */
export async function boundedLevenshtein(a: string, b: string, tolerance: number): Promise<BoundedMetric> {
  const distance = _boundedLevenshtein(a, b, tolerance)
  return {
    distance,
    isBounded: distance >= 0
  }
}

// This is only used internally, keep in sync with the previous one
export function syncBoundedLevenshtein(a: string, b: string, tolerance: number): BoundedMetric {
  const distance = _boundedLevenshtein(a, b, tolerance)
  return {
    distance,
    isBounded: distance >= 0
  }
}

export function levenshtein(a: string, b: string): number {
  /* c8 ignore next 3 */
  if (!a.length) {
    return b.length
  }

  /* c8 ignore next 3 */
  if (!b.length) {
    return a.length
  }

  const swap = a
  if (a.length > b.length) {
    a = b
    b = swap
  }

  const row = Array.from({ length: a.length + 1 }, (_, i) => i)
  let val = 0

  for (let i = 1; i <= b.length; i++) {
    let prev = i

    for (let j = 1; j <= a.length; j++) {
      if (b[i - 1] === a[j - 1]) {
        val = row[j - 1]
      } else {
        val = Math.min(row[j - 1] + 1, Math.min(prev + 1, row[j] + 1))
      }

      row[j - 1] = prev
      prev = val
    }
    row[a.length] = prev
  }

  return row[a.length]
}
