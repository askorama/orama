import {
  create as esmCreate,
  get as esmGet,
  getMultiple as esmGetMultiple,
  store as esmStore,
  remove as esmRemove,
  count as esmCount,
  load as esmLoad,
  save as esmSave,
  createDocumentsStore as esmCreateDocumentsStore
} from '../../components/documents-store.js'

let _esmCreate: typeof esmCreate
let _esmGet: typeof esmGet
let _esmGetMultiple: typeof esmGetMultiple
let _esmStore: typeof esmStore
let _esmRemove: typeof esmRemove
let _esmCount: typeof esmCount
let _esmLoad: typeof esmLoad
let _esmSave: typeof esmSave
let _esmCreateDocumentsStore: typeof esmCreateDocumentsStore

export async function create(...args: Parameters<typeof esmCreate>): ReturnType<typeof esmCreate> {
  if (!_esmCreate) {
    const imported = await import('../../components/documents-store.js')
    _esmCreate = imported.create
  }

  return _esmCreate(...args)
}

export async function get(...args: Parameters<typeof esmGet>): ReturnType<typeof esmGet> {
  if (!_esmGet) {
    const imported = await import('../../components/documents-store.js')
    _esmGet = imported.get
  }

  return _esmGet(...args)
}

export async function getMultiple(...args: Parameters<typeof esmGetMultiple>): ReturnType<typeof esmGetMultiple> {
  if (!_esmGetMultiple) {
    const imported = await import('../../components/documents-store.js')
    _esmGetMultiple = imported.getMultiple
  }

  return _esmGetMultiple(...args)
}

export async function store(...args: Parameters<typeof esmStore>): ReturnType<typeof esmStore> {
  if (!_esmStore) {
    const imported = await import('../../components/documents-store.js')
    _esmStore = imported.store
  }

  return _esmStore(...args)
}

export async function remove(...args: Parameters<typeof esmRemove>): ReturnType<typeof esmRemove> {
  if (!_esmRemove) {
    const imported = await import('../../components/documents-store.js')
    _esmRemove = imported.remove
  }

  return _esmRemove(...args)
}

export async function count(...args: Parameters<typeof esmCount>): ReturnType<typeof esmCount> {
  if (!_esmCount) {
    const imported = await import('../../components/documents-store.js')
    _esmCount = imported.count
  }

  return _esmCount(...args)
}

export async function load(...args: Parameters<typeof esmLoad>): ReturnType<typeof esmLoad> {
  if (!_esmLoad) {
    const imported = await import('../../components/documents-store.js')
    _esmLoad = imported.load
  }

  return _esmLoad(...args)
}

export async function save(...args: Parameters<typeof esmSave>): ReturnType<typeof esmSave> {
  if (!_esmSave) {
    const imported = await import('../../components/documents-store.js')
    _esmSave = imported.save
  }

  return _esmSave(...args)
}

export async function createDocumentsStore(
  ...args: Parameters<typeof esmCreateDocumentsStore>
): ReturnType<typeof esmCreateDocumentsStore> {
  if (!_esmCreateDocumentsStore) {
    const imported = await import('../../components/documents-store.js')
    _esmCreateDocumentsStore = imported.createDocumentsStore
  }

  return _esmCreateDocumentsStore(...args)
}
