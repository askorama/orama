import { createError } from './errors.js'
const baseId = Date.now().toString().slice(5)
let lastId = 0
const k = 1024
const nano = BigInt(1e3)
const milli = BigInt(1e6)
const second = BigInt(1e9)
export const isServer = typeof window === 'undefined'
/**
 * This value can be increased up to 100_000
 * But i don't know if this value change from nodejs to nodejs
 * So I will keep a safer value here.
 */
export const MAX_ARGUMENT_FOR_STACK = 65535
/**
 * This method is needed to used because of issues like: https://github.com/askorama/orama/issues/301
 * that issue is caused because the array that is pushed is huge (>100k)
 *
 * @example
 * ```ts
 * safeArrayPush(myArray, [1, 2])
 * ```
 */
export function safeArrayPush(arr, newArr) {
  if (newArr.length < MAX_ARGUMENT_FOR_STACK) {
    Array.prototype.push.apply(arr, newArr)
  } else {
    const newArrLength = newArr.length
    for (let i = 0; i < newArrLength; i += MAX_ARGUMENT_FOR_STACK) {
      Array.prototype.push.apply(arr, newArr.slice(i, i + MAX_ARGUMENT_FOR_STACK))
    }
  }
}
export function sprintf(template, ...args) {
  return template.replace(/%(?:(?<position>\d+)\$)?(?<width>-?\d*\.?\d*)(?<type>[dfs])/g, function (...replaceArgs) {
    const groups = replaceArgs[replaceArgs.length - 1]
    const { width: rawWidth, type, position } = groups
    const replacement = position ? args[Number.parseInt(position) - 1] : args.shift()
    const width = rawWidth === '' ? 0 : Number.parseInt(rawWidth)
    switch (type) {
      case 'd':
        return replacement.toString().padStart(width, '0')
      case 'f': {
        let value = replacement
        const [padding, precision] = rawWidth.split('.').map((w) => Number.parseFloat(w))
        if (typeof precision === 'number' && precision >= 0) {
          value = value.toFixed(precision)
        }
        return typeof padding === 'number' && padding >= 0 ? value.toString().padStart(width, '0') : value.toString()
      }
      case 's':
        return width < 0 ? replacement.toString().padEnd(-width, ' ') : replacement.toString().padStart(width, ' ')
      default:
        return replacement
    }
  })
}
export function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) {
    return '0 Bytes'
  }
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}
export function isInsideWebWorker() {
  // @ts-expect-error - WebWorker global scope
  return typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope
}
export function isInsideNode() {
  return typeof process !== 'undefined' && process.release && process.release.name === 'node'
}
export function getNanosecondTimeViaPerformance() {
  return BigInt(Math.floor(performance.now() * 1e6))
}
export function formatNanoseconds(value) {
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
export function getNanosecondsTime() {
  if (isInsideWebWorker()) {
    return getNanosecondTimeViaPerformance()
  }
  if (isInsideNode()) {
    return process.hrtime.bigint()
  }
  if (typeof process !== 'undefined' && typeof process?.hrtime?.bigint === 'function') {
    return process.hrtime.bigint()
  }
  if (typeof performance !== 'undefined') {
    return getNanosecondTimeViaPerformance()
  }
  // @todo: fallback to V8 native method to get microtime
  return BigInt(0)
}
export function uniqueId() {
  return `${baseId}-${lastId++}`
}
export function getOwnProperty(object, property) {
  // Checks if `hasOwn` method is defined avoiding errors with older Node.js versions
  if (Object.hasOwn === undefined) {
    return Object.prototype.hasOwnProperty.call(object, property) ? object[property] : undefined
  }
  return Object.hasOwn(object, property) ? object[property] : undefined
}
export function getTokenFrequency(token, tokens) {
  let count = 0
  for (const t of tokens) {
    if (t === token) {
      count++
    }
  }
  return count
}
export function insertSortedValue(arr, el, compareFn = sortTokenScorePredicate) {
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
export function sortTokenScorePredicate(a, b) {
  if (b[1] === a[1]) {
    return a[0] - b[0]
  }
  return b[1] - a[1]
}
// Intersection function taken from https://github.com/lovasoa/fast_array_intersect.
// MIT Licensed at the time of writing.
export function intersect(arrays) {
  if (arrays.length === 0) {
    return []
  } else if (arrays.length === 1) {
    return arrays[0]
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
  return arrays[0].filter((e) => {
    const count = set.get(e)
    if (count !== undefined) set.set(e, 0)
    return count === arrays.length
  })
}
export function getDocumentProperties(doc, paths) {
  const properties = {}
  const pathsLength = paths.length
  for (let i = 0; i < pathsLength; i++) {
    const path = paths[i]
    const pathTokens = path.split('.')
    let current = doc
    const pathTokensLength = pathTokens.length
    for (let j = 0; j < pathTokensLength; j++) {
      current = current[pathTokens[j]]
      // We found an object but we were supposed to be done
      if (typeof current === 'object') {
        if (
          current !== null &&
          'lat' in current &&
          'lon' in current &&
          typeof current.lat === 'number' &&
          typeof current.lon === 'number'
        ) {
          current = properties[path] = current
          break
        } else if (!Array.isArray(current) && current !== null && j === pathTokensLength - 1) {
          current = undefined
          break
        }
      } else if ((current === null || typeof current !== 'object') && j < pathTokensLength - 1) {
        // We can't recurse anymore but we were supposed to
        current = undefined
        break
      }
    }
    if (typeof current !== 'undefined') {
      properties[path] = current
    }
  }
  return properties
}
export function getNested(obj, path) {
  const props = getDocumentProperties(obj, [path])
  return props[path]
}
export function flattenObject(obj, prefix = '') {
  const result = {}
  for (const key in obj) {
    const prop = `${prefix}${key}`
    const objKey = obj[key]
    if (typeof objKey === 'object' && objKey !== null) {
      Object.assign(result, flattenObject(objKey, `${prop}.`))
    } else {
      result[prop] = objKey
    }
  }
  return result
}
const mapDistanceToMeters = {
  cm: 0.01,
  m: 1,
  km: 1000,
  ft: 0.3048,
  yd: 0.9144,
  mi: 1609.344
}
export function convertDistanceToMeters(distance, unit) {
  const ratio = mapDistanceToMeters[unit]
  if (ratio === undefined) {
    throw new Error(createError('INVALID_DISTANCE_SUFFIX', distance).message)
  }
  return distance * ratio
}
export function removeVectorsFromHits(searchResult, vectorProperties) {
  searchResult.hits = searchResult.hits.map((result) => ({
    ...result,
    document: {
      ...result.document,
      // Remove embeddings from the result
      ...vectorProperties.reduce((acc, prop) => {
        const path = prop.split('.')
        const lastKey = path.pop()
        let obj = acc
        for (const key of path) {
          obj[key] = obj[key] ?? {}
          obj = obj[key]
        }
        obj[lastKey] = null
        return acc
      }, result.document)
    }
  }))
}
export function isPromise(obj) {
  return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function'
}
export function isAsyncFunction(func) {
  return func?.constructor?.name === 'AsyncFunction'
}
//# sourceMappingURL=utils.js.map
