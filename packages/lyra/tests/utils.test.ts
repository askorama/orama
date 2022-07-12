import {
  formatBytes,
  formatNanoseconds,
  getNanosecondsTime,
} from "../src/utils";

describe("utils", () => {
  it("should correctly format bytes", async () => {
    expect(formatBytes(0)).toBe("0 Bytes");
    expect(formatBytes(1)).toBe("1 Bytes");
    expect(formatBytes(1024)).toBe("1 KB");
    expect(formatBytes(1024 ** 2)).toBe("1 MB");
    expect(formatBytes(1024 ** 3)).toBe("1 GB");
    expect(formatBytes(1024 ** 4)).toBe("1 TB");
    expect(formatBytes(1024 ** 5)).toBe("1 PB");
    expect(formatBytes(1024 ** 6)).toBe("1 EB");
    expect(formatBytes(1024 ** 7)).toBe("1 ZB");
  });

  it("should correctly format nanoseconds", async () => {
    expect(formatNanoseconds(1_000_000n)).toBe("1ms");
    expect(formatNanoseconds(1_000_000_000n)).toBe("1000ms"); // 1s
    expect(formatNanoseconds(1_000_000_000_000n)).toBe("1000000ms"); // 1m
    expect(formatNanoseconds(1_000_000_000_000_000n)).toBe("1000000000ms"); // 1h
  });
});
