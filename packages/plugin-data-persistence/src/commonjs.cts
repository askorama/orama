import type {
  getDefaultFileName as esmGetDefaultFileName,
  persist as esmPersist,
  persistToFile as esmPersistToFile,
  restore as esmRestore,
  restoreFromFile as esmRestoreFromFile
} from './index.js'

export interface OramaPluginDataPersistenceExport {
  getDefaultFileName: typeof esmGetDefaultFileName
  persist: typeof esmPersist
  restore: typeof esmRestore
  persistToFile: typeof esmPersistToFile
  restoreFromFile: typeof esmRestoreFromFile
}

export type RequireCallback = (err: Error | undefined, orama?: OramaPluginDataPersistenceExport) => void

let _esmRestoreFromFile: typeof esmRestoreFromFile
let _esmRestore: typeof esmRestore
let _esmPersistToFile: typeof esmPersistToFile
let _esmPersist: typeof esmPersist
let _esmGetDefaultFileName: typeof esmGetDefaultFileName

export async function getDefaultFileName(
  ...args: Parameters<typeof esmGetDefaultFileName>
): ReturnType<typeof esmGetDefaultFileName> {
  if (!_esmGetDefaultFileName) {
    const imported = await import('./index.js')
    _esmGetDefaultFileName = imported.getDefaultFileName
  }

  return _esmGetDefaultFileName(...args)
}

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

export async function persistToFile(...args: Parameters<typeof esmPersistToFile>): ReturnType<typeof esmPersistToFile> {
  if (!_esmPersistToFile) {
    const imported = await import('./index.js')
    _esmPersistToFile = imported.persistToFile
  }

  return _esmPersistToFile(...args)
}

export async function restoreFromFile(
  ...args: Parameters<typeof esmRestoreFromFile>
): ReturnType<typeof esmRestoreFromFile> {
  if (!_esmRestoreFromFile) {
    const imported = await import('./index.js')
    _esmRestoreFromFile = imported.restoreFromFile
  }

  return _esmRestoreFromFile(...args)
}

export function requireOramaPluginDataPersistence(callback: RequireCallback): void {
  import('./index.js')
    .then((loaded: OramaPluginDataPersistenceExport) => setTimeout(() => callback(undefined, loaded), 1))
    .catch((error: Error) => setTimeout(() => callback(error), 1))
}
