import { create, load, Orama, PropertiesSchema, save } from '@orama/orama'
import { decode, encode } from '@msgpack/msgpack'
// @ts-expect-error dpack does not expose types
import * as dpack from 'dpack'
import { FILESYSTEM_NOT_SUPPORTED_ON_RUNTIME, UNSUPPORTED_FORMAT } from './errors.js'

export type Runtime = 'deno' | 'node' | 'bun' | 'browser' | 'unknown'

export type PersistenceFormat = 'json' | 'dpack' | 'binary'

export const DEFAULT_DB_NAME = `orama_bump_${+new Date()}`

interface FileSystem {
  cwd: () => string
  resolve: (...paths: string[]) => string
  readFile: (path: string, encoding?: string) => Promise<Buffer | string>
  writeFile: (path: string, contents: Buffer | string, encoding?: string) => Promise<unknown>
}

const hexFromMap: Record<string, number> = {
  0: 0,
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  a: 10,
  b: 11,
  c: 12,
  d: 13,
  e: 14,
  f: 15
}
const hexToMap = Object.keys(hexFromMap)

let _fs: FileSystem

function detectRuntime(): Runtime {
  /* c8 ignore next 11 */
  if (typeof process !== 'undefined' && process.versions !== undefined) {
    return 'node'

    // @ts-expect-error "Deno" global variable is defined in Deno only
  } else if (typeof Deno !== 'undefined') {
    return 'deno'
    // @ts-expect-error "Bun" global variable is defined in Bun only
  } else if (typeof Bun !== 'undefined') {
    return 'bun'
  } else if (typeof window !== 'undefined') {
    return 'browser'
  }

  return 'unknown'
}

/* c8 ignore next 13 */
function slowHexToBuffer(hex: string): Uint8Array {
  const bytes = new Uint8Array(Math.floor(hex.length / 2))

  hex = hex.toLowerCase()
  for (let i = 0; i < hex.length; i++) {
    const a = hexFromMap[hex[i * 2]]
    const b = hexFromMap[hex[i * 2 + 1]]
    if (a === undefined || b === undefined) {
      break
    }
    bytes[i] = (a << 4) | b
  }
  return bytes
}

/* c8 ignore next 5 */
function slowHexToString(bytes: Uint8Array): string {
  return Array.from(bytes || [])
    .map(b => hexToMap[b >> 4] + hexToMap[b & 15])
    .join('')
}

async function loadFileSystem(runtime: Runtime): Promise<FileSystem> {
  switch (runtime) {
    case 'node': {
      const { readFile, writeFile } = await import('node:fs/promises')
      const { resolve } = await import('node:path')

      return {
        cwd: process.cwd,
        resolve,
        readFile: readFile as FileSystem['readFile'],
        writeFile: writeFile as FileSystem['writeFile']
      }
    }
    /* c8 ignore next 13 */
    case 'deno': {
      // @ts-expect-error Deno allows TS imports
      const { resolve } = await import('https://deno.land/std/path/mod.ts')

      // @ts-expect-error Deno is only available in Deno
      const { cwd, readTextFile: readFile, writeTextFile: writeFile } = Deno

      return {
        cwd: cwd as FileSystem['cwd'],
        resolve: resolve as FileSystem['resolve'],
        readFile: readFile as FileSystem['readFile'],
        writeFile: writeFile as FileSystem['writeFile']
      }
    }
    default:
      throw new Error(FILESYSTEM_NOT_SUPPORTED_ON_RUNTIME(runtime))
  }
}

async function getDefaultOutputFilename(format: PersistenceFormat, runtime: Runtime): Promise<string> {
  if (!_fs) {
    _fs = await loadFileSystem(runtime)
  }

  return _fs.resolve(_fs.cwd(), await getDefaultFileName(format, runtime))
}

export async function getDefaultFileName(format: PersistenceFormat, runtime?: Runtime): Promise<string> {
  if (!runtime) {
    runtime = detectRuntime()
  }

  let extension: string

  switch (format) {
    case 'json':
      extension = 'json'
      break
    case 'dpack':
      extension = 'dpack'
      break
    case 'binary':
      extension = 'msp'
  }

  let dbName: string = DEFAULT_DB_NAME

  /* c8 ignore next 3 */
  if (runtime === 'deno') {
    // @ts-expect-error Deno is only available in Deno
    dbName = Deno.env.get('LYRA_DB_NAME') ?? DEFAULT_DB_NAME
  } else {
    dbName = process?.env?.LYRA_DB_NAME ?? DEFAULT_DB_NAME
  }

  return `${dbName}.${extension}`
}

export async function persist<T extends PropertiesSchema>(
  db: Orama<T>,
  format: PersistenceFormat = 'binary',
  runtime?: Runtime
): Promise<string | Buffer> {
  if (!runtime) {
    runtime = detectRuntime()
  }

  const dbExport = await save(db)
  let serialized: string | Buffer

  switch (format) {
    case 'json':
      serialized = JSON.stringify(dbExport)
      break
    case 'dpack':
      serialized = dpack.serialize(dbExport)
      break
    case 'binary':
      {
        const msgpack = encode(dbExport)
        if (runtime === 'node') {
          serialized = Buffer.from(msgpack.buffer, msgpack.byteOffset, msgpack.byteLength)
          serialized = serialized.toString('hex')
          /* c8 ignore next 3 */
        } else {
          serialized = slowHexToString(msgpack)
        }
      }
      break
    default:
      throw new Error(UNSUPPORTED_FORMAT(format))
  }

  return serialized
}

export async function restore<T extends PropertiesSchema>(
  format: PersistenceFormat,
  data: string | Buffer,
  runtime?: Runtime
): Promise<Orama<T>> {
  if (!runtime) {
    runtime = detectRuntime()
  }

  const db = await create({
    edge: true,
    schema: {
      __placeholder: 'string'
    }
  })
  let deserialized: any

  switch (format) {
    case 'json':
      deserialized = JSON.parse(data.toString())
      break
    case 'dpack':
      deserialized = dpack.parse(data)
      break
    case 'binary':
      if (runtime === 'node') {
        data = Buffer.from(data.toString(), 'hex')
        /* c8 ignore next 3 */
      } else {
        data = slowHexToBuffer(data as string) as Buffer
      }
      deserialized = decode(data)
      break
    default:
      throw new Error(UNSUPPORTED_FORMAT(format))
  }

  await load(db, deserialized)

  return db as unknown as Orama<T>
}

export async function persistToFile<T extends PropertiesSchema>(
  db: Orama<T>,
  format: PersistenceFormat = 'binary',
  path?: string,
  runtime?: Runtime
): Promise<string> {
  if (!runtime) {
    runtime = detectRuntime()
  }

  if (!_fs) {
    _fs = await loadFileSystem(runtime)
  }

  if (!path) {
    path = await getDefaultOutputFilename(format, runtime)
  }

  const serialized = await persist(db, format, runtime)

  await _fs.writeFile(path, serialized)

  return path
}

export async function restoreFromFile<T extends PropertiesSchema>(
  format: PersistenceFormat = 'binary',
  path?: string,
  runtime?: Runtime
): Promise<Orama<T>> {
  if (!runtime) {
    runtime = detectRuntime()
  }

  if (!_fs) {
    _fs = await loadFileSystem(runtime)
  }

  if (!path) {
    path = await getDefaultOutputFilename(format, runtime)
  }

  const data = await _fs.readFile(path)
  return restore(format, data, runtime)
}
