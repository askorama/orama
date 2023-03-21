import type { Orama, RawData } from '@orama/orama'
import { create as createOramaDB, load as loadOramaDB } from '@orama/orama'

const dbs: Record<string, Orama> = {}

export async function getOramaDB(dbName: string): Promise<Orama> {
  if (dbName in dbs) {
    return dbs[dbName]
  }

  const db = await createOramaDB({ schema: { _: 'string' } })

  const dbResponse = await fetch(`/assets/oramaDB_${dbName}.json`)
  const dbData = (await dbResponse.json()) as RawData

  await loadOramaDB(db, dbData)
  dbs[dbName] = db

  return db
}

export { search } from '@orama/orama'
