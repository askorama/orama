import { kInsertions, kRemovals, Orama, OpaqueDocumentStore, OpaqueIndex, Schema } from "../types.js";

// Web platforms don't have process. React-Native doesn't have process.emitWarning.
const warn =
  globalThis.process?.emitWarning ??
  function emitWarning(message: string, options: { code: string }) {
    console.warn(`[WARNING] [${options.code}] ${message}`);
  };

export function trackInsertion<S extends Schema, I extends OpaqueIndex, D extends OpaqueDocumentStore>(
  lyra: Orama<S, I, D>,
): void {
  if (typeof lyra[kInsertions] !== "number") {
    queueMicrotask(() => {
      lyra[kInsertions] = undefined;
    });

    lyra[kInsertions] = 0;
  }

  if (lyra[kInsertions]! > 1000) {
    warn(
      "Lyra's insert operation is synchronous. Please avoid inserting a large number of document in a single operation in order not to block the main thread or, in alternative, please use insertMultiple.",
      { code: "LYRA0001" },
    );

    lyra[kInsertions] = -1;
  } else if (lyra[kInsertions] >= 0) {
    lyra[kInsertions]++;
  }
}

export function trackRemoval<S extends Schema, I extends OpaqueIndex, D extends OpaqueDocumentStore>(
  lyra: Orama<S, I, D>,
): void {
  if (typeof lyra[kRemovals] !== "number") {
    queueMicrotask(() => {
      lyra[kRemovals] = undefined;
    });

    lyra[kRemovals] = 0;
  }

  if (lyra[kRemovals]! > 1000) {
    warn(
      "Lyra's remove operation is synchronous. Please avoid removing a large number of document in a single operation in order not to block the main thread, in alternative, please use updateMultiple.",
      { code: "LYRA0002" },
    );

    lyra[kRemovals] = -1;
  } else if (lyra[kRemovals] >= 0) {
    lyra[kRemovals]++;
  }
}
