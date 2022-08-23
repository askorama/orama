const kInsertions = Symbol("lyra.insertions");

const warn =
  "process" in globalThis
    ? process.emitWarning
    : function emitWarning(message: string, options: { code: string }) {
        console.warn(`[WARNING] [${options.code}] ${message}`);
      };

export function trackInsertion(_lyra: unknown) {
  const lyra = _lyra as object & { [kInsertions]?: number };

  if (typeof lyra[kInsertions] !== "number") {
    queueMicrotask(() => {
      lyra[kInsertions] = undefined;
    });

    lyra[kInsertions] = 0;
  }

  if (lyra[kInsertions]! > 1000) {
    warn(
      "Lyra's insert operation is synchronous. Please avoid inserting a large number of document in a single operation in order not to block the main thread.",
      { code: "LYRA0001" },
    );

    lyra[kInsertions] = -1;
  } else if (lyra[kInsertions] >= 0) {
    lyra[kInsertions]++;
  }
}
