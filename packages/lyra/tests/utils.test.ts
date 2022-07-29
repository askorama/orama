import t from "tap";
import { formatBytes, formatNanoseconds } from "../src/utils";

t.test("utils", t => {
  t.plan(2);

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
    t.plan(4);

    t.equal(formatNanoseconds(1_000_000n), "1ms");
    t.equal(formatNanoseconds(1_000_000_000n), "1000ms"); // 1s
    t.equal(formatNanoseconds(1_000_000_000_000n), "1000000ms"); // 1m
    t.equal(formatNanoseconds(1_000_000_000_000_000n), "1000000000ms"); // 1h
  });
});
