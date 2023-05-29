import type {
  getDefaultFileName as esmGetDefaultFileName,
  persistToFile as esmPersistToFile,
  restoreFromFile as esmRestoreFromFile
} from './server.js'

export interface OramaPluginDataPersistenceExport {
  getDefaultFileName: typeof esmGetDefaultFileName
  persistToFile: typeof esmPersistToFile
  restoreFromFile: typeof esmRestoreFromFile
}

export type RequireCallback = (err: Error | undefined, orama?: OramaPluginDataPersistenceExport) => void

let _esmRestoreFromFile: typeof esmRestoreFromFile
let _esmPersistToFile: typeof esmPersistToFile
let _esmGetDefaultFileName: typeof esmGetDefaultFileName

export async function getDefaultFileName(
  ...args: Parameters<typeof esmGetDefaultFileName>
): ReturnType<typeof esmGetDefaultFileName> {
  if (!_esmGetDefaultFileName) {
    const imported = await import('./server.js')
    _esmGetDefaultFileName = imported.getDefaultFileName
  }

  return _esmGetDefaultFileName(...args)
}

export async function persistToFile(...args: Parameters<typeof esmPersistToFile>): ReturnType<typeof esmPersistToFile> {
  if (!_esmPersistToFile) {
    const imported = await import('./server.js')
    _esmPersistToFile = imported.persistToFile
  }

  return _esmPersistToFile(...args)
}

export async function restoreFromFile(
  ...args: Parameters<typeof esmRestoreFromFile>
): ReturnType<typeof esmRestoreFromFile> {
  if (!_esmRestoreFromFile) {
    const imported = await import('./server.js')
    _esmRestoreFromFile = imported.restoreFromFile
  }

  return _esmRestoreFromFile(...args)
}