import t from "tap";
import { create, insert } from "../src/lyra";
import { formatBytes, formatNanoseconds, countOccurrencies, getAllTokensInAllDocsByProperty } from "../src/utils";

t.test("utils", t => {
  t.plan(4);

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

  t.test("should correctly count occurrences of an element in an array", t => {
    t.plan(3);

    t.equal(countOccurrencies(["hello", "hello", "there"], "hello"), 2);
    t.equal(countOccurrencies([10, 2030, 120, 3020, 849, 9249, 10], 10), 2);
    t.equal(countOccurrencies([10, 2030, 120, 3020, 849, 9249, 10], 3), 0);
  });

  t.test("should correctly get all tokens in all docs by property", t => {
    t.plan(1);

    const lyra = create({
      schema: {
        name: "string",
        description: "string",
      },
    });

    insert(lyra, {
      name: "John Doe",
      description: "My example description",
    });

    insert(lyra, {
      name: "Jane Doe",
      description: "Another example description",
    });

    const result = getAllTokensInAllDocsByProperty(lyra);

    t.matchSnapshot(result, `${t.name}-O1`);
  });
});
