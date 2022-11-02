import t from "tap";
import { intersectMany, formatBytes, formatNanoseconds, deepSet } from "../src/utils";

t.test("utils", t => {
  t.plan(4);

  t.test("should set deep properties", t => {
    t.plan(1);

    const obj = {};
    deepSet(obj, "a.b.c", 1);

    // @ts-expect-error - obj is any
    t.equal(obj.a.b.c, 1);
  });

  t.test("should correctly intersect 2 or more arrays", t => {
    t.plan(6);

    const arr1 = [1, 2, 3, 4, 5, 8];
    const arr2 = [2, 3, 8];
    const arr3 = [4, 6, 5, 8];
    const arr4 = [11];

    t.same(intersectMany([arr1, arr2]), [2, 3, 8]);
    t.same(intersectMany([arr1, arr3]), [4, 5, 8]);
    t.same(intersectMany([arr2, arr3]), [8]);
    t.same(intersectMany([arr1, arr2, arr3]), [8]);
    t.same(intersectMany([arr1, arr2, arr3, arr4]), []);

    const ex1 = ["100-2991", "300-1029", "01292-931", "093-12342"];
    const ex2 = ["400-2391", "343-1029", "12321-931", "093-12342"];
    const ex3 = ["420-5233", "633-1234", "01292-931", "093-12342", "293-12232", "455-2391", "521-1029", "19293-92331"];

    t.same(intersectMany([ex1, ex2, ex3]), ["093-12342"]);
  });

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
});
