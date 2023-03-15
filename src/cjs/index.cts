import type { create as esmCreate } from "../methods/create.js";
import type { count as esmCount, getByID as esmGetByID } from "../methods/docs.js";
import type { insert as esmInsert, insertMultiple as esminsertMultiple } from "../methods/insert.js";
import type { remove as esmRemove, removeMultiple as esmRemoveMultiple } from "../methods/remove.js";
import type { search as esmSearch } from "../methods/search.js";
import type { load as esmLoad, save as esmSave } from "../methods/serialization.js";
import type { update as esmUpdate, updateMultiple as esmUpdateMultiple } from "../methods/update.js";
import type {
  addSynonyms as esmAddSynonyms,
  removeSynonyms as esmRemoveSynonyms,
  clearSynonyms as esmClearSynonyms,
} from "../methods/synonyms.js";

export interface LyraExport {
  count: typeof esmCount;
  create: typeof esmCreate;
  getByID: typeof esmGetByID;
  insert: typeof esmInsert;
  insertMultiple: typeof esminsertMultiple;
  load: typeof esmLoad;
  remove: typeof esmRemove;
  removeMultiple: typeof esmRemoveMultiple;
  save: typeof esmSave;
  search: typeof esmSearch;
  addSynonyms: typeof esmAddSynonyms;
  removeSynonyms: typeof esmRemoveSynonyms;
  clearSynonyms: typeof esmClearSynonyms;
}

export type RequireCallback = (err: Error | undefined, lyra?: LyraExport) => void;

let _esmCount: typeof esmCount;
let _esmCreate: typeof esmCreate;
let _esmGetByID: typeof esmGetByID;
let _esmInsert: typeof esmInsert;
let _esmInsertMultiple: typeof esminsertMultiple;
let _esmLoad: typeof esmLoad;
let _esmRemove: typeof esmRemove;
let _esmRemoveMultiple: typeof esmRemoveMultiple;
let _esmSave: typeof esmSave;
let _esmSearch: typeof esmSearch;
let _esmUpdate: typeof esmUpdate;
let _esmUpdateMultiple: typeof esmUpdateMultiple;
let _esmAddSynonyms: typeof esmAddSynonyms;
let _esmRemoveSynonyms: typeof esmRemoveSynonyms;
let _esmClearSynonyms: typeof esmClearSynonyms;

export async function count(...args: Parameters<typeof esmCount>): ReturnType<typeof esmCount> {
  if (!_esmCount) {
    const imported = await import("../methods/docs.js");
    _esmCount = imported.count;
  }

  return _esmCount(...args);
}

export async function create(...args: Parameters<typeof esmCreate>): ReturnType<typeof esmCreate> {
  if (!_esmCreate) {
    const imported = await import("../methods/create.js");
    _esmCreate = imported.create;
  }

  return _esmCreate(...args);
}

export async function getByID(...args: Parameters<typeof esmGetByID>): ReturnType<typeof esmGetByID> {
  if (!_esmGetByID) {
    const imported = await import("../methods/docs.js");
    _esmGetByID = imported.getByID;
  }

  return _esmGetByID(...args);
}

export async function insert(...args: Parameters<typeof esmInsert>): ReturnType<typeof esmInsert> {
  if (!_esmInsert) {
    const imported = await import("../methods/insert.js");
    _esmInsert = imported.insert;
  }

  return _esmInsert(...args);
}

export async function insertMultiple(
  ...args: Parameters<typeof esminsertMultiple>
): ReturnType<typeof esminsertMultiple> {
  if (!_esmInsertMultiple) {
    const imported = await import("../methods/insert.js");
    _esmInsertMultiple = imported.insertMultiple;
  }

  return _esmInsertMultiple(...args);
}

export async function load(...args: Parameters<typeof esmLoad>): ReturnType<typeof esmLoad> {
  if (!_esmLoad) {
    const imported = await import("../methods/serialization.js");
    _esmLoad = imported.load;
  }

  return _esmLoad(...args);
}

export async function remove(...args: Parameters<typeof esmRemove>): ReturnType<typeof esmRemove> {
  if (!_esmRemove) {
    const imported = await import("../methods/remove.js");
    _esmRemove = imported.remove;
  }

  return _esmRemove(...args);
}

export async function removeMultiple(
  ...args: Parameters<typeof esmRemoveMultiple>
): ReturnType<typeof esmRemoveMultiple> {
  if (!_esmRemoveMultiple) {
    const imported = await import("../methods/remove.js");
    _esmRemoveMultiple = imported.removeMultiple;
  }

  return _esmRemoveMultiple(...args);
}

export async function save(...args: Parameters<typeof esmSave>): ReturnType<typeof esmSave> {
  if (!_esmSave) {
    const imported = await import("../methods/serialization.js");
    _esmSave = imported.save;
  }

  return _esmSave(...args);
}

export async function search(...args: Parameters<typeof esmSearch>): ReturnType<typeof esmSearch> {
  if (!_esmSearch) {
    const imported = await import("../methods/search.js");
    _esmSearch = imported.search;
  }

  return _esmSearch(...args);
}

export async function update(...args: Parameters<typeof esmUpdate>): ReturnType<typeof esmUpdate> {
  if (!_esmUpdate) {
    const imported = await import("../methods/update.js");
    _esmUpdate = imported.update;
  }

  return _esmUpdate(...args);
}

export async function updateMultiple(
  ...args: Parameters<typeof esmUpdateMultiple>
): ReturnType<typeof esmUpdateMultiple> {
  if (!_esmUpdateMultiple) {
    const imported = await import("../methods/update.js");
    _esmUpdateMultiple = imported.updateMultiple;
  }

  return _esmUpdateMultiple(...args);
}

export async function addSynonyms(...args: Parameters<typeof esmAddSynonyms>): ReturnType<typeof esmAddSynonyms> {
  if (!_esmAddSynonyms) {
    const imported = await import("../methods/synonyms.js");
    _esmAddSynonyms = imported.addSynonyms;
  }

  return _esmAddSynonyms(...args);
}

export async function removeSynonyms(
  ...args: Parameters<typeof esmRemoveSynonyms>
): ReturnType<typeof esmRemoveSynonyms> {
  if (!_esmRemoveSynonyms) {
    const imported = await import("../methods/synonyms.js");
    _esmRemoveSynonyms = imported.removeSynonyms;
  }

  return _esmRemoveSynonyms(...args);
}

export async function clearSynonyms(...args: Parameters<typeof esmClearSynonyms>): ReturnType<typeof esmClearSynonyms> {
  if (!_esmClearSynonyms) {
    const imported = await import("../methods/synonyms.js");
    _esmClearSynonyms = imported.clearSynonyms;
  }

  return _esmClearSynonyms(...args);
}

export function requireLyra(callback: RequireCallback): void {
  import("../index.js")
    .then((loaded: LyraExport) => setTimeout(() => callback(undefined, loaded), 1))
    .catch((error: Error) => setTimeout(() => callback(error), 1));
}
