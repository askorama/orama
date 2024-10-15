import t from 'tap'
import { formatBytes, formatNanoseconds, getOwnProperty, getNested, flattenObject, setUnion, setIntersection } from '../src/utils.js'

t.test('utils', async (t) => {
  t.test('should correctly format bytes', async (t) => {
    t.equal(await formatBytes(0), '0 Bytes')
    t.equal(await formatBytes(1), '1 Bytes')
    t.equal(await formatBytes(1024), '1 KB')
    t.equal(await formatBytes(1024 ** 2), '1 MB')
    t.equal(await formatBytes(1024 ** 3), '1 GB')
    t.equal(await formatBytes(1024 ** 4), '1 TB')
    t.equal(await formatBytes(1024 ** 5), '1 PB')
    t.equal(await formatBytes(1024 ** 6), '1 EB')
    t.equal(await formatBytes(1024 ** 7), '1 ZB')
  })

  t.test('should correctly format nanoseconds', async (t) => {
    t.equal(await formatNanoseconds(1n), '1ns')
    t.equal(await formatNanoseconds(10n), '10ns')
    t.equal(await formatNanoseconds(100n), '100ns')
    t.equal(await formatNanoseconds(1_000n), '1μs')
    t.equal(await formatNanoseconds(10_000n), '10μs')
    t.equal(await formatNanoseconds(100_000n), '100μs')
    t.equal(await formatNanoseconds(1_000_000n), '1ms')
    t.equal(await formatNanoseconds(10_000_000n), '10ms')
    t.equal(await formatNanoseconds(100_000_000n), '100ms')
    t.equal(await formatNanoseconds(1000_000_000n), '1s')
    t.equal(await formatNanoseconds(10_000_000_000n), '10s')
    t.equal(await formatNanoseconds(100_000_000_000n), '100s')
    t.equal(await formatNanoseconds(1000_000_000_000n), '1000s')
  })

  t.test('should check object properties', async (t) => {
    t.test('should return the value of the property or undefined', async (t) => {
      const myObject = {
        foo: 'bar'
      }

      t.equal(getOwnProperty(myObject, 'foo'), 'bar')
      t.equal(getOwnProperty(myObject, 'bar'), undefined)
    })

    t.test('should return even if the hasOwn method is not available', async (t) => {
      // @ts-expect-error - we are testing the fallback
      globalThis.Object.hasOwn = undefined

      const myObject = {
        foo: 'bar'
      }

      t.equal(getOwnProperty(myObject, 'foo'), 'bar')
      t.equal(getOwnProperty(myObject, 'bar'), undefined)
    })
  })

  t.test('should get value from a nested object', async (t) => {
    const myObject = {
      foo: 'bar',
      nested: {
        nested2: {
          nested3: {
            bar: 'baz'
          }
        },
        null: null,
        noop: () => null
      }
    }

    t.equal(await getNested(myObject, 'foo'), 'bar')
    t.same(await getNested(myObject, 'nested'), undefined)
    t.same(await getNested(myObject, 'nested.nested2'), undefined)
    t.same(await getNested(myObject, 'nested.nested2.nested3'), undefined)
    t.equal(await getNested(myObject, 'nested.nested2.nested3.bar'), 'baz')
    t.equal(await getNested(myObject, 'nested1.nested3.bar'), undefined)
    t.equal(await getNested(myObject, 'nested.noop.bar'), undefined)
  })

  t.test('should flatten an object', async (t) => {
    const myObject = {
      foo: 'bar',
      nested: {
        nested2: {
          nested3: {
            bar: 'baz'
          }
        },
        null: null,
        noop: () => null
      }
    }

    const flattened = flattenObject(myObject)

    t.equal((flattened as Record<string, string>).foo, 'bar')
    t.equal(flattened['nested.nested2.nested3.bar'], 'baz')
  })
})

t.test('setUnion', async t => {
  const set1 = new Set([1, 2, 3])
  const set2 = new Set([2, 3, 4])

  t.strictSame(setUnion(undefined, set2), set2)
  t.strictSame(setUnion(set1, set2), new Set([1, 2, 3, 4]))
  t.strictSame(setUnion(set2, set1), new Set([1, 2, 3, 4]))
})

t.test('setIntersection', async t => {
  const set1 = new Set([1, 2, 3])
  const set2 = new Set([2, 3, 4])
  const set3 = new Set([2, 3, 5])

  // empty set
  t.strictSame(setIntersection(), new Set())

  // single set
  t.strictSame(setIntersection(set1), set1)

  // two sets
  t.strictSame(setIntersection(set1, set2), new Set([2, 3]))
  t.strictSame(setIntersection(set2, set1), new Set([2, 3]))

  // three sets
  t.strictSame(setIntersection(set1, set2, set3), new Set([2, 3]))
  t.strictSame(setIntersection(set1, set3, set2), new Set([2, 3]))
  t.strictSame(setIntersection(set2, set1, set3), new Set([2, 3]))
  t.strictSame(setIntersection(set2, set3, set1), new Set([2, 3]))
  t.strictSame(setIntersection(set3, set1, set2), new Set([2, 3]))
  t.strictSame(setIntersection(set3, set2, set1), new Set([2, 3]))
})
