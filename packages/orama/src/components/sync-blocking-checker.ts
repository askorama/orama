import { kInsertions, kRemovals, OpaqueDocumentStore, OpaqueIndex, OpaqueSorter, Orama, Schema } from '../types.js'

// Web platforms don't have process. React-Native doesn't have process.emitWarning.
const warn =
  globalThis.process?.emitWarning ??
  function emitWarning(message: string, options: { code: string }) {
    console.warn(`[WARNING] [${options.code}] ${message}`)
  }

export function trackInsertion
<S extends Schema, I extends OpaqueIndex, D extends OpaqueDocumentStore, So extends OpaqueSorter>
(orama: Orama<S, I, D, So>): void {
  if (typeof orama[kInsertions] !== 'number') {
    queueMicrotask(() => {
      orama[kInsertions] = undefined
    })

    orama[kInsertions] = 0
  }

  if (orama[kInsertions]! > 1000) {
    warn(
      "Orama's insert operation is synchronous. Please avoid inserting a large number of document in a single operation in order not to block the main thread or, in alternative, please use insertMultiple.",
      { code: 'ORAMA0001' },
    )

    orama[kInsertions] = -1
  } else if (orama[kInsertions] >= 0) {
    orama[kInsertions]++
  }
}

export function trackRemoval
<S extends Schema, I extends OpaqueIndex, D extends OpaqueDocumentStore, So extends OpaqueSorter>
(orama: Orama<S, I, D, So>): void {
  if (typeof orama[kRemovals] !== 'number') {
    queueMicrotask(() => {
      orama[kRemovals] = undefined
    })

    orama[kRemovals] = 0
  }

  if (orama[kRemovals]! > 1000) {
    warn(
      "Orama's remove operation is synchronous. Please avoid removing a large number of document in a single operation in order not to block the main thread, in alternative, please use updateMultiple.",
      { code: 'ORAMA0002' },
    )

    orama[kRemovals] = -1
  } else if (orama[kRemovals] >= 0) {
    orama[kRemovals]++
  }
}
