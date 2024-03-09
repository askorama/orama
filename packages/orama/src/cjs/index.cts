import type { create as esmCreate } from '../methods/create.ts'
import type { count as esmCount, getByID as esmGetByID } from '../methods/docs.ts'
import type { insert as esmInsert, insertMultiple as esminsertMultiple } from '../methods/insert.ts'
import type { remove as esmRemove, removeMultiple as esmRemoveMultiple } from '../methods/remove.ts'
import type { search as esmSearch } from '../methods/search.ts'
import type { searchVector as esmSearchVector } from '../methods/search-vector.ts'
import type { load as esmLoad, save as esmSave } from '../methods/serialization.ts'
import type { update as esmUpdate, updateMultiple as esmUpdateMultiple } from '../methods/update.ts'

let _esmCount: typeof esmCount
let _esmCreate: typeof esmCreate
let _esmGetByID: typeof esmGetByID
let _esmInsert: typeof esmInsert
let _esmInsertMultiple: typeof esminsertMultiple
let _esmLoad: typeof esmLoad
let _esmRemove: typeof esmRemove
let _esmRemoveMultiple: typeof esmRemoveMultiple
let _esmSave: typeof esmSave
let _esmSearch: typeof esmSearch
let _esmUpdate: typeof esmUpdate
let _esmUpdateMultiple: typeof esmUpdateMultiple
let _esmSearchVector: typeof esmSearchVector

export async function count(...args: Parameters<typeof esmCount>): ReturnType<typeof esmCount> {
  if (!_esmCount) {
    const imported = await import('../methods/docs.ts')
    _esmCount = imported.count
  }

  return _esmCount(...args)
}

export async function create(...args: Parameters<typeof esmCreate>): ReturnType<typeof esmCreate> {
  if (!_esmCreate) {
    const imported = await import('../methods/create.ts')
    _esmCreate = imported.create
  }

  return _esmCreate(...args)
}

export async function getByID(...args: Parameters<typeof esmGetByID>): ReturnType<typeof esmGetByID> {
  if (!_esmGetByID) {
    const imported = await import('../methods/docs.ts')
    _esmGetByID = imported.getByID
  }

  return _esmGetByID(...args)
}

export async function insert(...args: Parameters<typeof esmInsert>): ReturnType<typeof esmInsert> {
  if (!_esmInsert) {
    const imported = await import('../methods/insert.ts')
    _esmInsert = imported.insert
  }

  return _esmInsert(...args)
}

export async function insertMultiple(
  ...args: Parameters<typeof esminsertMultiple>
): ReturnType<typeof esminsertMultiple> {
  if (!_esmInsertMultiple) {
    const imported = await import('../methods/insert.ts')
    _esmInsertMultiple = imported.insertMultiple
  }

  return _esmInsertMultiple(...args)
}

export async function load(...args: Parameters<typeof esmLoad>): ReturnType<typeof esmLoad> {
  if (!_esmLoad) {
    const imported = await import('../methods/serialization.ts')
    _esmLoad = imported.load
  }

  return _esmLoad(...args)
}

export async function remove(...args: Parameters<typeof esmRemove>): ReturnType<typeof esmRemove> {
  if (!_esmRemove) {
    const imported = await import('../methods/remove.ts')
    _esmRemove = imported.remove
  }

  return _esmRemove(...args)
}

export async function removeMultiple(
  ...args: Parameters<typeof esmRemoveMultiple>
): ReturnType<typeof esmRemoveMultiple> {
  if (!_esmRemoveMultiple) {
    const imported = await import('../methods/remove.ts')
    _esmRemoveMultiple = imported.removeMultiple
  }

  return _esmRemoveMultiple(...args)
}

export async function save(...args: Parameters<typeof esmSave>): ReturnType<typeof esmSave> {
  if (!_esmSave) {
    const imported = await import('../methods/serialization.ts')
    _esmSave = imported.save
  }

  return _esmSave(...args)
}

export async function search(...args: Parameters<typeof esmSearch>): ReturnType<typeof esmSearch> {
  if (!_esmSearch) {
    const imported = await import('../methods/search.ts')
    _esmSearch = imported.search
  }

  return _esmSearch(...args)
}

export async function update(...args: Parameters<typeof esmUpdate>): ReturnType<typeof esmUpdate> {
  if (!_esmUpdate) {
    const imported = await import('../methods/update.ts')
    _esmUpdate = imported.update
  }

  return _esmUpdate(...args)
}

export async function updateMultiple(
  ...args: Parameters<typeof esmUpdateMultiple>
): ReturnType<typeof esmUpdateMultiple> {
  if (!_esmUpdateMultiple) {
    const imported = await import('../methods/update.ts')
    _esmUpdateMultiple = imported.updateMultiple
  }

  return _esmUpdateMultiple(...args)
}

export async function searchVector(...args: Parameters<typeof esmSearchVector>): ReturnType<typeof esmSearchVector> {
  if (!_esmSearchVector) {
    const imported = await import('../methods/search-vector.ts')
    _esmSearchVector = imported.searchVector
  }

  return _esmSearchVector(...args)
}

export * as components from './components/defaults.cjs'
export * as internals from './internals.cjs'
