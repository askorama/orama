import {
  Document,
  Lyra,
  MultipleCallbackComponent,
  OpaqueDocumentStore,
  OpaqueIndex,
  Schema,
  SingleCallbackComponent,
} from "../types.js";

export const COMPLEX_COMPONENTS = ["tokenizer", "index", "documentsStore", "synonyms"];

export const SIMPLE_COMPONENTS = ["validateSchema", "getDocumentIndexId", "getDocumentProperties", "formatElapsedTime"];

export const SIMPLE_OR_ARRAY_COMPONENTS = [
  "beforeInsert",
  "afterInsert",
  "beforeRemove",
  "afterRemove",
  "beforeUpdate",
  "afterUpdate",
  "beforeMultipleInsert",
  "afterMultipleInsert",
  "beforeMultipleRemove",
  "afterMultipleRemove",
  "beforeMultipleUpdate",
  "afterMultipleUpdate",
];

export async function runSingleHook<S extends Schema, I extends OpaqueIndex, D extends OpaqueDocumentStore>(
  hooks: SingleCallbackComponent<S, I, D>[],
  lyra: Lyra<S, I, D>,
  id: string,
  doc?: Document,
): Promise<void> {
  for (let i = 0; i < hooks.length; i++) {
    await hooks[i](lyra, id, doc);
  }
}

export async function runMultipleHook<S extends Schema, I extends OpaqueIndex, D extends OpaqueDocumentStore>(
  hooks: MultipleCallbackComponent<S, I, D>[],
  lyra: Lyra<S, I, D>,
  docsOrIds: Document[] | string[],
): Promise<void> {
  for (let i = 0; i < hooks.length; i++) {
    await hooks[i](lyra, docsOrIds);
  }
}
