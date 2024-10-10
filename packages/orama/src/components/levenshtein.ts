export type BoundedMetric = {
  isBounded: boolean
  distance: number
}

/**
 * Inspired by:
 * https://github.com/Yomguithereal/talisman/blob/86ae55cbd040ff021d05e282e0e6c71f2dde21f8/src/metrics/levenshtein.js#L218-L340
 */
function _boundedLevenshtein(a: string, b: string, tolerance: number): number {
  // Handle base cases
  if (tolerance < 0) return -1
  if (a === b) return 0

  const m = a.length
  const n = b.length

  // Special case for empty strings
  if (m === 0) return n <= tolerance ? n : -1
  if (n === 0) return m <= tolerance ? m : -1

  a = a.toLowerCase()
  b = b.toLowerCase()

  // Special case for prefixes
  if (b.startsWith(a) || a.startsWith(b)) return 0

  // If the length difference is greater than the tolerance, return early
  if (Math.abs(m - n) > tolerance) return -1

  // Initialize the matrix
  const matrix: number[][] = []
  for (let i = 0; i <= m; i++) {
    matrix[i] = [i]
    for (let j = 1; j <= n; j++) {
      matrix[i][j] = i === 0 ? j : 0
    }
  }

  // Fill the matrix
  for (let i = 1; i <= m; i++) {
    let rowMin = Infinity
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1, // deletion
          matrix[i][j - 1] + 1, // insertion
          matrix[i - 1][j - 1] + 1 // substitution
        )
      }
      rowMin = Math.min(rowMin, matrix[i][j])
    }

    // Early termination if all values in this row exceed tolerance
    if (rowMin > tolerance) {
      return -1
    }
  }

  return matrix[m][n] <= tolerance ? matrix[m][n] : -1
}

/**
 * Computes the Levenshtein distance between two strings (a, b), returning early with -1 if the distance
 * is greater than the given tolerance.
 * It assumes that:
 * - tolerance >= ||a| - |b|| >= 0
 */
export function boundedLevenshtein(a: string, b: string, tolerance: number): BoundedMetric {
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
