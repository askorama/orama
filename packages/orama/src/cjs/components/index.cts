import {
  create as esmCreate,
  insert as esmInsert,
  remove as esmRemove,
  search as esmSearch,
  searchByWhereClause as esmSearchByWhereClause,
  getSearchableProperties as esmGetSearchableProperties,
  getSearchablePropertiesWithTypes as esmGetSearchablePropertiesWithTypes,
  load as esmLoad,
  save as esmSave,
  createIndex as esmCreateIndex
} from '../../components/index.ts'

let _esmCreate: typeof esmCreate
let _esmInsert: typeof esmInsert
let _esmRemove: typeof esmRemove
let _esmSearch: typeof esmSearch
let _esmSearchByWhereClause: typeof esmSearchByWhereClause
let _esmGetSearchableProperties: typeof esmGetSearchableProperties
let _esmGetSearchablePropertiesWithTypes: typeof esmGetSearchablePropertiesWithTypes
let _esmLoad: typeof esmLoad
let _esmSave: typeof esmSave
let _esmCreateIndex: typeof esmCreateIndex

export async function create(...args: Parameters<typeof esmCreate>): ReturnType<typeof esmCreate> {
  if (!_esmCreate) {
    const imported = await import('../../components/index.ts')
    _esmCreate = imported.create
  }

  return _esmCreate(...args)
}

export async function insert(...args: Parameters<typeof esmInsert>): ReturnType<typeof esmInsert> {
  if (!_esmInsert) {
    const imported = await import('../../components/index.ts')
    _esmInsert = imported.insert
  }

  return _esmInsert(...args)
}

export async function remove(...args: Parameters<typeof esmRemove>): ReturnType<typeof esmRemove> {
  if (!_esmRemove) {
    const imported = await import('../../components/index.ts')
    _esmRemove = imported.remove
  }

  return _esmRemove(...args)
}

export async function search(...args: Parameters<typeof esmSearch>): ReturnType<typeof esmSearch> {
  if (!_esmSearch) {
    const imported = await import('../../components/index.ts')
    _esmSearch = imported.search
  }

  return _esmSearch(...args)
}

export async function searchByWhereClause(
  ...args: Parameters<typeof esmSearchByWhereClause>
): ReturnType<typeof esmSearchByWhereClause> {
  if (!_esmSearchByWhereClause) {
    const imported = await import('../../components/index.ts')
    _esmSearchByWhereClause = imported.searchByWhereClause
  }

  return _esmSearchByWhereClause(...args)
}

export async function getSearchableProperties(
  ...args: Parameters<typeof esmGetSearchableProperties>
): ReturnType<typeof esmGetSearchableProperties> {
  if (!_esmGetSearchableProperties) {
    const imported = await import('../../components/index.ts')
    _esmGetSearchableProperties = imported.getSearchableProperties
  }

  return _esmGetSearchableProperties(...args)
}

export async function getSearchablePropertiesWithTypes(
  ...args: Parameters<typeof esmGetSearchablePropertiesWithTypes>
): ReturnType<typeof esmGetSearchablePropertiesWithTypes> {
  if (!_esmGetSearchablePropertiesWithTypes) {
    const imported = await import('../../components/index.ts')
    _esmGetSearchablePropertiesWithTypes = imported.getSearchablePropertiesWithTypes
  }

  return _esmGetSearchablePropertiesWithTypes(...args)
}

export async function load(...args: Parameters<typeof esmLoad>): ReturnType<typeof esmLoad> {
  if (!_esmLoad) {
    const imported = await import('../../components/index.ts')
    _esmLoad = imported.load
  }

  return _esmLoad(...args)
}

export async function save(...args: Parameters<typeof esmSave>): ReturnType<typeof esmSave> {
  if (!_esmSave) {
    const imported = await import('../../components/index.ts')
    _esmSave = imported.save
  }

  return _esmSave(...args)
}

export async function createIndex(...args: Parameters<typeof esmCreateIndex>): ReturnType<typeof esmCreateIndex> {
  if (!_esmCreateIndex) {
    const imported = await import('../../components/index.ts')
    _esmCreateIndex = imported.createIndex
  }

  return _esmCreateIndex(...args)
}
