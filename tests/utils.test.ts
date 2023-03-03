import t from "tap";
import {
  formatBytes,
  formatNanoseconds,
  getOwnProperty,
  getNested,
  flattenObject,
  getNanosecondsTime,
  getTokenFrequency,
  intersect,
} from "../src/utils.js";
import { BALANCE_STATE, findMin, getBalanceFactor, rotateLeft, rotateRight } from "../src/trees/avl/utils.js";
import { createAVLNode } from "../src/trees/avl/node.js";

t.test("utils", t => {
  t.plan(9);

  t.test("should correctly format bytes", t => {
    t.plan(10);

    t.equal(formatBytes(0), "0 Bytes");
    t.equal(formatBytes(1), "1 Bytes");
    t.equal(formatBytes(1024), "1 KB");
    t.equal(formatBytes(1024 ** 2), "1 MB");
    t.equal(formatBytes(1024 ** 3), "1 GB");
    t.equal(formatBytes(1024 ** 4), "1 TB");
    t.equal(formatBytes(1024 ** 5), "1 PB");
    t.equal(formatBytes(1024 ** 6), "1 EB");
    t.equal(formatBytes(1024 ** 7), "1 ZB");

    t.equal(formatBytes(1, -2), "1 Bytes");
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

  t.test("should format nanoseconds numbers", t => {
    t.plan(3);

    t.equal(formatNanoseconds(1), "1ns");
    t.equal(formatNanoseconds(1000), "1μs");
    t.equal(formatNanoseconds(1000000), "1ms");
  });

  t.test("should check object properties", t => {
    t.plan(2);

    t.test("should get value from an object", t => {
      t.plan(2);

      const myObject = {
        foo: "bar",
      };
  
      t.equal(getOwnProperty(myObject, "foo"), "bar");
      t.equal(getOwnProperty(myObject, "bar"), undefined);
    });

    t.test("should get value with Object.hasOwn undefined property", t => {
      t.plan(2);

      const myObject = {
        foo: "bar",
      };

      // @ts-expect-error - we are testing this
      const hasOwn = Object.hasOwn;

      // @ts-expect-error - we are testing this
      Object.hasOwn = undefined;

      t.equal(getOwnProperty(myObject, "foo"), "bar");
      t.equal(getOwnProperty(myObject, "bar"), undefined);

      // @ts-expect-error - we are testing this
      Object.hasOwn = hasOwn;
    });

  });

  t.test("should get value from a nested object", t => {
    t.plan(8);

    const myObject = {
      foo: "bar",
      nested: {
        nested2: {
          nested3: {
            bar: "baz",
          },
        },
        null: null,
        noop: () => null,
      },
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
            bar: "baz",
          },
        },
        null: null,
        noop: () => null,
      },
    };

    const flattened = flattenObject(myObject);

    t.equal((flattened as any).foo, "bar");
    t.equal(flattened["nested.nested2.nested3.bar"], "baz");
  });

  t.test("should get nanoseconds time", t => {
    t.plan(2);

    t.test("hrtime not defined", async t => {
      t.plan(1);

      const performance = globalThis.performance;
      const hrtime = process.hrtime;

      // @ts-expect-error - we are testing this
      globalThis.process.hrtime = undefined;

      // @ts-expect-error - we are testing this
      globalThis.performance = {
        now: () => 1,
      };

      const time = getNanosecondsTime();

      process.hrtime = hrtime;
      globalThis.performance = performance;

      t.equal(time, 1_000_000n);
    });

    t.test("hrtime not defined and performance.now not defined", async t => {
      t.plan(1);

      const performance = globalThis.performance;
      const hrtime = process.hrtime;

      // @ts-expect-error - we are testing this
      globalThis.process.hrtime = undefined;

      // @ts-expect-error - we are testing this
      globalThis.performance = undefined;

      const time = getNanosecondsTime();

      process.hrtime = hrtime;
      globalThis.performance = performance;

      t.equal(time, 0n);
    });
  });

  t.test("should get the token frequency", t => {
    t.plan(3);

    const tokens = [
      'foo',
      'bar',
      'kaboom',
      'foo',
      'foo',
      'bar',
    ];

    t.equal(getTokenFrequency('foo', tokens), 3);
    t.equal(getTokenFrequency('bar', tokens), 2);
    t.equal(getTokenFrequency('kaboom', tokens), 1);
  });

  t.test("should intersects arrays", t => {
    t.plan(2);

    t.test("should return 0 if intersect arrays are empty", t => {
      t.plan(1);
  
      t.same(intersect([]), []);
    });

    t.test("should return empty array if no intersection", t => {
      t.plan(1);
  
      t.same(intersect([[1, 2, 3], [4, 5, 6]]), []);
    });
  });
});

t.test("avl utils", t => {
  t.plan(6);

  t.test("should return unbalanced right", t => {
    t.plan(1);

    const node = createAVLNode("node", [1, 2, 3]);
    node.left = createAVLNode("left", [1, 2, 3]);
    node.left.right = createAVLNode("left.right", [1, 2, 3]);
    const rotated = rotateRight(node);

    t.equal(getBalanceFactor(rotated), BALANCE_STATE.UNBALANCED_RIGHT);
  });

  t.test("should return sligthly unbalanced right", t => {
    t.plan(1);

    const node = createAVLNode("node", [1, 2, 3]);
    node.left = createAVLNode("left", [1, 2, 3]);
    const rotated = rotateRight(node);

    t.equal(getBalanceFactor(rotated), BALANCE_STATE.SLIGHTLY_UNBALANCED_RIGHT);
  });

  t.test("should return balanced", t => {
    t.plan(1);

    const node = createAVLNode("node", [1, 2, 3]);
    node.left = createAVLNode("left", [1, 2, 3]);
    node.left.left = createAVLNode("left.left", [1, 2, 3]);
    const rotated = rotateRight(node);

    t.equal(getBalanceFactor(rotated), BALANCE_STATE.BALANCED);
  });

  t.test("should return sligthly unbalanced right", t => {
    t.plan(1);

    const node = createAVLNode("node", [1, 2, 3]);
    node.right = createAVLNode("right", [1, 2, 3]);
    const rotated = rotateLeft(node);

    t.equal(getBalanceFactor(rotated), BALANCE_STATE.SLIGHTLY_UNBALANCED_LEFT);
  });

  t.test("should return unbalanced left", t => {
    t.plan(1);

    const node = createAVLNode("node", [1, 2, 3]);
    node.right = createAVLNode("right", [1, 2, 3]);
    node.right.left = createAVLNode("right.left", [1, 2, 3]);
    const rotated = rotateLeft(node);

    t.equal(getBalanceFactor(rotated), BALANCE_STATE.UNBALANCED_LEFT);
  });

  t.test("should find min node", t => {
    t.plan(1);

    const node = createAVLNode("node", [1, 2, 3]);
    node.left = createAVLNode("left", [1, 2, 3]);
    node.left.left = createAVLNode("left.left", [1, 2, 3]);
    node.left.right = createAVLNode("left.right", [1, 2, 3]);

    t.equal(findMin(node).key, "left.left");
  });
});
