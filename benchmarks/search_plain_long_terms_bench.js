import { orama_2_1_1, orama_3_0_0_rc_2, orama_latest, getV2_1_1DB, getV3_0_0_rc_2DB, getLatestDB } from './common.js'

const v2_1_1DB = await getV2_1_1DB()
const v3_0_0_rc_2DB = getV3_0_0_rc_2DB()
const latestDB = getLatestDB()

Deno.bench('v2.1.1 search (long term)', async () => {
  await orama_2_1_1.search(v2_1_1DB, { 
    term: 'Super Mario Galaxy sees Mario jump across planets with a few items'
  })
})

Deno.bench('v3.0.0-rc2 search (long term)', () => {
  orama_3_0_0_rc_2.search(v3_0_0_rc_2DB, { 
    term: 'Super Mario Galaxy sees Mario jump across planets with a few items'
  })
})

Deno.bench('latest search (long term)', () => {
  orama_latest.search(latestDB, { 
    term: 'Super Mario Galaxy sees Mario jump across planets with a few items'
  })
})