import type { AnyOrama, RawData } from '@orama/orama'
import { create as createOramaDB, load as loadOramaDB } from '@orama/orama'

const dbs: Record<string, AnyOrama> = {}

export async function getOramaDB<T extends AnyOrama>(dbName: string): Promise<T> {
  if (dbName in dbs) {
    return dbs[dbName] as T
  }

  const db = await createOramaDB({ schema: { _: 'string' } })

  const dbResponse = await fetch(`/assets/oramaDB_${dbName}.json`)
  const dbData = (await dbResponse.json()) as RawData

  await loadOramaDB(db, dbData)
  dbs[dbName] = db

  return db as unknown as T
}

export { search } from '@orama/orama'
