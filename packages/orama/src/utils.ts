import type { Document, SearchableValue, TokenScore } from './types.js'

const baseId = Date.now().toString().slice(5)
let lastId = 0

const k = 1024
const nano = BigInt(1e3)
const milli = BigInt(1e6)
const second = BigInt(1e9)

export const isServer = typeof window === 'undefined'

export function sprintf(template: string, ...args: (string | number)[]): string {
  return template.replace(
    /%(?:(?<position>\d+)\$)?(?<width>-?\d*\.?\d*)(?<type>[dfs])/g,
    function (...replaceArgs: Array<string | number | Record<string, string>>): string {
      const groups = replaceArgs[replaceArgs.length - 1] as Record<string, string>
      const { width: rawWidth, type, position } = groups

      const replacement = position ? args[Number.parseInt(position) - 1]! : args.shift()!
      const width = rawWidth === '' ? 0 : Number.parseInt(rawWidth)

      switch (type) {
        case 'd':
          return replacement.toString().padStart(width, '0')
        case 'f': {
          let value = replacement
          const [padding, precision] = rawWidth.split('.').map(w => Number.parseFloat(w))

          if (typeof precision === 'number' && precision >= 0) {
            value = (value as number).toFixed(precision)
          }

          return typeof padding === 'number' && padding >= 0 ? value.toString().padStart(width, '0') : value.toString()
        }
        case 's':
          return width < 0
            ? (replacement as string).toString().padEnd(-width, ' ')
            : (replacement as string).toString().padStart(width, ' ')

        default:
          return replacement as string
      }
    },
  )
}

export async function formatBytes(bytes: number, decimals = 2): Promise<string> {
  if (bytes === 0) {
    return '0 Bytes'
  }
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

export async function formatNanoseconds(value: number | bigint): Promise<string> {
  if (typeof value === 'number') {
    value = BigInt(value)
  }

  if (value < nano) {
    return `${value}ns`
  } else if (value < milli) {
    return `${value / nano}μs`
  } else if (value < second) {
    return `${value / milli}ms`
  }

  return `${value / second}s`
}

export async function getNanosecondsTime(): Promise<bigint> {
  if (typeof process !== 'undefined' && process.hrtime !== undefined) {
    return process.hrtime.bigint()
  }

  if (typeof performance !== 'undefined') {
    return BigInt(Math.floor(performance.now() * 1e6))
  }

  // @todo: fallback to V8 native method to get microtime
  return BigInt(0)
}

export async function uniqueId(): Promise<string> {
  return `${baseId}-${lastId++}`
}

export function getOwnProperty<T = unknown>(object: Record<string, T>, property: string): T | undefined {
  // Checks if `hasOwn` method is defined avoiding errors with older Node.js versions
  if (Object.hasOwn === undefined) {
    return Object.prototype.hasOwnProperty.call(object, property) ? object[property] : undefined
  }

  return Object.hasOwn(object, property) ? object[property] : undefined
}

export function getTokenFrequency(token: string, tokens: string[]): number {
  let count = 0

  for (const t of tokens) {
    if (t === token) {
      count++
    }
  }

  return count
}

export function insertSortedValue(
  arr: TokenScore[],
  el: TokenScore,
  compareFn = sortTokenScorePredicate,
): TokenScore[] {
  let low = 0
  let high = arr.length
  let mid

  while (low < high) {
    mid = (low + high) >>> 1
    if (compareFn(el, arr[mid]) < 0) {
      high = mid
    } else {
      low = mid + 1
    }
  }

  arr.splice(low, 0, el)

  return arr
}

export function sortTokenScorePredicate(a: TokenScore, b: TokenScore): number {
  if (b[1] === a[1]) {
    return a[0] - b[0]
  }

  return b[1] - a[1]
}

// Intersection function taken from https://github.com/lovasoa/fast_array_intersect.
// MIT Licensed at the time of writing.
export function intersect<T>(arrays: ReadonlyArray<T>[]): T[] {
  if (arrays.length === 0) {
    return []
  } else if (arrays.length === 1) {
    return arrays[0] as T[]
  }

  for (let i = 1; i < arrays.length; i++) {
    if (arrays[i].length < arrays[0].length) {
      const tmp = arrays[0]
      arrays[0] = arrays[i]
      arrays[i] = tmp
    }
  }

  const set = new Map()
  for (const elem of arrays[0]) {
    set.set(elem, 1)
  }
  for (let i = 1; i < arrays.length; i++) {
    let found = 0
    for (const elem of arrays[i]) {
      const count = set.get(elem)
      if (count === i) {
        set.set(elem, count + 1)
        found++
      }
    }
    if (found === 0) return []
  }

  return arrays[0].filter(e => {
    const count = set.get(e)
    if (count !== undefined) set.set(e, 0)
    return count === arrays.length
  })
}

export async function getDocumentProperties(doc: Document, paths: string[]): Promise<Record<string, SearchableValue>> {
  const properties: Record<string, SearchableValue> = {}

  const pathsLength = paths.length
  for (let i = 0; i < pathsLength; i++) {
    const path = paths[i]
    const pathTokens = path.split('.')

    let current: SearchableValue | Document | undefined = doc
    const pathTokensLength = pathTokens.length
    for (let j = 0; j < pathTokensLength; j++) {
      current = (current as Document)[pathTokens[j]!] as Document | SearchableValue

      // We found an object but we were supposed to be done
      if (typeof current === 'object' && !Array.isArray(current) && current !== null && j === pathTokensLength - 1) {
        current = undefined
        break
      } else if ((current === null || typeof current !== 'object') && j < pathTokensLength - 1) {
        // We can't recurse anymore but we were supposed to
        current = undefined
        break
      }
    }

    if (typeof current !== 'undefined') {
      properties[path] = current as SearchableValue
    }
  }

  return properties
}

export async function getNested<T = SearchableValue>(obj: object, path: string): Promise<T | undefined> {
  const props = await getDocumentProperties(obj as Document, [path])

  return props[path] as T | undefined
}

export function flattenObject(obj: object, prefix = ''): Document {
  const result: Document = {}

  for (const key in obj) {
    const prop = `${prefix}${key}`
    const objKey = (obj as Document)[key]

    if (typeof objKey === 'object' && objKey !== null) {
      Object.assign(result, flattenObject(objKey, `${prop}.`))
    } else {
      result[prop] = objKey
    }
  }
  return result
}
