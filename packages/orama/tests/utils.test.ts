import t from 'tap'
import { formatBytes, formatNanoseconds, getOwnProperty, getNested, flattenObject } from '../src/utils.js'

t.test('utils', (t) => {
  t.plan(5)

  t.test('should correctly format bytes', async (t) => {
    t.plan(9)

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
    t.plan(13)

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

  t.test('should check object properties', (t) => {
    t.plan(2)

    t.test('should return the value of the property or undefined', (t) => {
      t.plan(2)

      const myObject = {
        foo: 'bar'
      }

      t.equal(getOwnProperty(myObject, 'foo'), 'bar')
      t.equal(getOwnProperty(myObject, 'bar'), undefined)
    })

    t.test('should return even if the hasOwn method is not available', (t) => {
      t.plan(2)

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
    t.plan(7)

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

  t.test('should flatten an object', (t) => {
    t.plan(2)

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
