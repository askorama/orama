import t from "tap";
import {
  formatBytes,
  formatNanoseconds,
  getOwnProperty,
  getNested,
  flattenObject,
  isSerializable,
} from "../src/utils.js";

t.test("utils", t => {
  t.plan(6);

  t.test("should correctly format bytes", t => {
    t.plan(9);

    t.equal(formatBytes(0), "0 Bytes");
    t.equal(formatBytes(1), "1 Bytes");
    t.equal(formatBytes(1024), "1 KB");
    t.equal(formatBytes(1024 ** 2), "1 MB");
    t.equal(formatBytes(1024 ** 3), "1 GB");
    t.equal(formatBytes(1024 ** 4), "1 TB");
    t.equal(formatBytes(1024 ** 5), "1 PB");
    t.equal(formatBytes(1024 ** 6), "1 EB");
    t.equal(formatBytes(1024 ** 7), "1 ZB");
  });

  t.test("should correctly format nanoseconds", t => {
    t.plan(13);

    t.equal(formatNanoseconds(1n), "1ns");
    t.equal(formatNanoseconds(10n), "10ns");
    t.equal(formatNanoseconds(100n), "100ns");
    t.equal(formatNanoseconds(1_000n), "1μs");
    t.equal(formatNanoseconds(10_000n), "10μs");
    t.equal(formatNanoseconds(100_000n), "100μs");
    t.equal(formatNanoseconds(1_000_000n), "1ms");
    t.equal(formatNanoseconds(10_000_000n), "10ms");
    t.equal(formatNanoseconds(100_000_000n), "100ms");
    t.equal(formatNanoseconds(1000_000_000n), "1s");
    t.equal(formatNanoseconds(10_000_000_000n), "10s");
    t.equal(formatNanoseconds(100_000_000_000n), "100s");
    t.equal(formatNanoseconds(1000_000_000_000n), "1000s");
  });

  t.test("should check object properties", t => {
    t.plan(2);

    const myObject = {
      foo: "bar",
    };

    t.equal(getOwnProperty(myObject, "foo"), "bar");
    t.equal(getOwnProperty(myObject, "bar"), undefined);
  });

  t.test("should get value from a nested object", t => {
    t.plan(8);

    const myObject = {
      foo: "bar",
      nested: {
        nested2: {
          nested3: {
            bar: "baz"
          }
        },
        null: null,
        noop: () => null
      }
    };

    t.equal(getNested(myObject, "foo"), "bar");
    t.same(getNested(myObject, "nested"), myObject.nested);
    t.same(getNested(myObject, "nested.nested2"), myObject.nested.nested2);
    t.same(getNested(myObject, "nested.nested2.nested3"), myObject.nested.nested2.nested3);
    t.equal(getNested(myObject, "nested.nested2.nested3.bar"), "baz");
    t.equal(getNested(myObject, "nested1.nested3.bar"), undefined);
    t.equal(getNested(myObject, "nested.null.bar"), undefined);
    t.equal(getNested(myObject, "nested.noop.bar"), undefined);
  });

  t.test("should flatten an object", t => {
    t.plan(2);

    const myObject = {
      foo: "bar",
      nested: {
        nested2: {
          nested3: {
            bar: "baz"
          }
        },
        null: null,
        noop: () => null
      }
    };

    const flattened = flattenObject(myObject);

    t.equal((flattened as any).foo, "bar");
    t.equal(flattened["nested.nested2.nested3.bar"], "baz");
  });

  t.test("isSerializable", t => {
    t.plan(2);
    t.test("should return true on supported serializable objects", t => {
      t.plan(1);
      t.ok(isSerializable({}));
    });
    t.test("should return false on supported serializable objects", t => {
      t.plan(9);
      // @ts-expect-error error case
      t.notOk(isSerializable([]));
      // @ts-expect-error error case
      t.notOk(isSerializable(new Map()));
      // @ts-expect-error error case
      t.notOk(isSerializable(new Set()));
      // @ts-expect-error error case
      t.notOk(isSerializable(new WeakMap()));
      // @ts-expect-error error case
      t.notOk(isSerializable(new WeakSet()));
      // @ts-expect-error error case
      t.notOk(isSerializable(new ArrayBuffer()));
      // @ts-expect-error error case
      t.notOk(isSerializable(new Float32Array()));
      // @ts-expect-error error case
      t.notOk(isSerializable(new Uint8Array()));
      // @ts-expect-error error case
      t.notOk(isSerializable(new SharedArrayBuffer()));
    });
  });
});
