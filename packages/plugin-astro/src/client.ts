import type { Data, Orama, PropertiesSchema } from '@orama/orama'
import { create as createOramaDB, load as loadOramaDB } from '@orama/orama'

const dbs: Record<string, Orama<PropertiesSchema>> = {}

export async function getOramaDB(dbName: string): Promise<Orama<PropertiesSchema>> {
  if (dbName in dbs) {
    return dbs[dbName]
  }

  const db = await createOramaDB({ schema: { _: 'string' }, edge: true })

  const dbResponse = await fetch(`/assets/oramaDB_${dbName}.json`)
  const dbData = (await dbResponse.json()) as Data<{ _: 'string' }>

  await loadOramaDB(db, dbData)
  dbs[dbName] = db

  return db
}

export { search } from '@orama/orama'
