import { orama_2_1_1, orama_3_0_0_rc_2, orama_latest, schema, dataset } from './common.js'

Deno.bench('v2.1.1 insert', async () => {
  const db = await orama_2_1_1.create({ schema })
  
  for (const doc of dataset) {
    await orama_2_1_1.insert(db, doc)
  }
})

Deno.bench('v3.0.0-rc2 insert', () => {
  const db = orama_3_0_0_rc_2.create({ schema })
  
  for (const doc of dataset) {
    orama_3_0_0_rc_2.insert(db, doc)
  }
})

Deno.bench('latest insert', () => {
  const db = orama_latest.create({ schema })
  
  for (const doc of dataset) {
    orama_latest.insert(db, doc)
  }
})