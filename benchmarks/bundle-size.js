import zlib from 'node:zlib'
import fs from 'node:fs'
import { persistToFile } from '@orama/plugin-data-persistence/server'
import { insertMultiple, db211, db300rc2, dbLatest, dbLatestPT15, dbLatestQPS } from './src/get-orama.js'

const db211Path = './bundle/db211.json'
const db300rc2Path = './bundle/db300rc2.json'
const dbLatestPath = './bundle/dbLatest.json'
const dbLatestPT15Path = './bundle/dbLatestPT15.json'
const dbLatestQPSPath = './bundle/dbLatestQPS.json'

await insertMultiple.orama211()
insertMultiple.orama300rc2()
insertMultiple.oramaLatest()
insertMultiple.oramaLatestPT15()
insertMultiple.oramaLatestQPS()

await persistToFile(db211, 'json', db211Path)
await persistToFile(db300rc2, 'json', db300rc2Path)
await persistToFile(dbLatest, 'json', dbLatestPath)
await persistToFile(dbLatestPT15, 'json', dbLatestPT15Path)
await persistToFile(dbLatestQPS, 'json', dbLatestQPSPath)


fs.writeFileSync(db211Path + '.gz', zlib.gzipSync(fs.readFileSync(db211Path)))
fs.writeFileSync(db300rc2Path + '.gz', zlib.gzipSync(fs.readFileSync(db300rc2Path)))
fs.writeFileSync(dbLatestPath + '.gz', zlib.gzipSync(fs.readFileSync(dbLatestPath)))
fs.writeFileSync(dbLatestPT15Path + '.gz', zlib.gzipSync(fs.readFileSync(dbLatestPT15Path)))
fs.writeFileSync(dbLatestQPSPath + '.gz', zlib.gzipSync(fs.readFileSync(dbLatestQPSPath)))