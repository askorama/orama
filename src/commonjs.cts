import type { create as esmCreate } from "./methods/create.js";
import type {
  insert as esmInsert,
  insertBatch as esmInsertBatch,
  insertWithHooks as esmInsertWithHooks,
} from "./methods/insert.js";
import type { load as esmLoad } from "./methods/load.js";
import type { remove as esmRemove } from "./methods/remove.js";
import type { save as esmSave } from "./methods/save.js";
import type { search as esmSearch } from "./methods/search.js";

interface LyraExport {
  create: typeof esmCreate;
  insert: typeof esmInsert;
  insertWithHooks: typeof esmInsertWithHooks;
  insertBatch: typeof esmInsertBatch;
  remove: typeof esmRemove;
  search: typeof esmSearch;
  save: typeof esmSave;
  load: typeof esmLoad;
}

type RequireCallback = (err: Error | undefined, lyra?: LyraExport) => void;

// This is needed in order not to have transpilation turn this into a require
const importDynamic = new Function("modulePath", "return import(modulePath)");

let _esmCreate: typeof esmCreate;
let _esmInsert: typeof esmInsert;
let _esmInsertWithHooks: typeof esmInsertWithHooks;
let _esmInsertBatch: typeof esmInsertBatch;
let _esmRemove: typeof esmRemove;
let _esmSearch: typeof esmSearch;
let _esmSave: typeof esmSave;
let _esmLoad: typeof esmLoad;

export async function create(...args: Parameters<typeof esmCreate>): ReturnType<typeof esmCreate> {
  if (!_esmCreate) {
    const imported = await importDynamic("./methods/create.js");
    _esmCreate = imported.create;
  }

  return _esmCreate(...args);
}

export async function insert(...args: Parameters<typeof esmInsert>): ReturnType<typeof esmInsert> {
  if (!_esmInsert) {
    const imported = await importDynamic("./methods/insert.js");
    _esmInsert = imported.insert;
  }

  return _esmInsert(...args);
}

export async function insertWithHooks(
  ...args: Parameters<typeof esmInsertWithHooks>
): ReturnType<typeof esmInsertWithHooks> {
  if (!_esmInsertWithHooks) {
    const imported = await importDynamic("./methods/insert.js");
    _esmInsertWithHooks = imported.insertWithHooks;
  }

  return _esmInsertWithHooks(...args);
}

export async function insertBatch(...args: Parameters<typeof esmInsertBatch>): ReturnType<typeof esmInsertBatch> {
  if (!_esmInsertBatch) {
    const imported = await importDynamic("./methods/insert.js");
    _esmInsertBatch = imported.insertBatch;
  }

  return _esmInsertBatch(...args);
}

export async function remove(...args: Parameters<typeof esmRemove>): ReturnType<typeof esmRemove> {
  if (!_esmRemove) {
    const imported = await importDynamic("./methods/remove.js");
    _esmRemove = imported.remove;
  }

  return _esmRemove(...args);
}

export async function search(...args: Parameters<typeof esmSearch>): ReturnType<typeof esmSearch> {
  if (!_esmSearch) {
    const imported = await importDynamic("./methods/search.js");
    _esmSearch = imported.search;
  }

  return _esmSearch(...args);
}

export async function save(...args: Parameters<typeof esmSave>): ReturnType<typeof esmSave> {
  if (!_esmSave) {
    const imported = await importDynamic("./methods/save.js");
    _esmSave = imported.save;
  }

  return _esmSave(...args);
}

export async function load(...args: Parameters<typeof esmLoad>): ReturnType<typeof esmLoad> {
  if (!_esmLoad) {
    const imported = await importDynamic("./methods/load.js");
    _esmLoad = imported.load;
  }

  return _esmLoad(...args);
}

export function requireLyra(callback: RequireCallback): void {
  importDynamic("./lyra.js")
    .then((loaded: LyraExport) => setTimeout(() => callback(undefined, loaded), 1))
    .catch((error: Error) => setTimeout(() => callback(error), 1));
}
