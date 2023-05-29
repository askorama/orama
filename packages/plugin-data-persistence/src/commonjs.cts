import type {
  persist as esmPersist,
  restore as esmRestore,
  persistToFile as esmPersistToFile,
  restoreFromFile as esmRestoreFromFile,
} from './index.js'

export interface OramaPluginDataPersistenceExport {
  persist: typeof esmPersist
  restore: typeof esmRestore
}

export type RequireCallback = (err: Error | undefined, orama?: OramaPluginDataPersistenceExport) => void

let _esmRestore: typeof esmRestore
let _esmPersist: typeof esmPersist
let _esmRestoreFromFile: typeof esmRestoreFromFile
let _esmPersistToFile: typeof esmPersistToFile

export async function persist(...args: Parameters<typeof esmPersist>): ReturnType<typeof esmPersist> {
  if (!_esmPersist) {
    const imported = await import('./index.js')
    _esmPersist = imported.persist
  }

  return _esmPersist(...args)
}

export async function restore(...args: Parameters<typeof esmRestore>): ReturnType<typeof esmRestore> {
  if (!_esmRestore) {
    const imported = await import('./index.js')
    _esmRestore = imported.restore
  }

  return _esmRestore(...args)
}

export function persistToFile(...args: Parameters<typeof esmPersistToFile>): ReturnType<typeof esmPersistToFile> {
  if (!_esmPersistToFile) {
    const imported = require('./index.js')
    _esmPersistToFile = imported.persistToFile
  }

  return _esmPersistToFile(...args)
}

export function restoreFromFile(...args: Parameters<typeof esmRestoreFromFile>): ReturnType<typeof esmRestoreFromFile> {
  if (!_esmRestoreFromFile) {
    const imported = require('./index.js')
    _esmRestoreFromFile = imported.restoreFromFile
  }
  return _esmRestoreFromFile(...args)
}

export function requireOramaPluginDataPersistence(callback: RequireCallback): void {
  import('./index.js')
    .then((loaded: OramaPluginDataPersistenceExport) => setTimeout(() => callback(undefined, loaded), 1))
    .catch((error: Error) => setTimeout(() => callback(error), 1))
}
