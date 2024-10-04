import * as orama_2_1_1 from 'npm:@orama/orama@2.1.1'
import * as orama_3_0_0_rc_2 from 'npm:@orama/orama@3.0.0-rc-2'
import * as orama_latest from '../packages/orama/dist/deno/index.js'
import dataset from './dataset.json' with { type: 'json' }

const schema =   {
  title: 'string',
  description: 'string',
  rating: 'number',
  genres: 'enum[]'
}

async function getV2_1_1DB() {
  const db = await orama_2_1_1.create({ schema })
  
  for (const doc of dataset) {
    await orama_2_1_1.insert(db, doc)
  }

  return db
}

function getV3_0_0_rc_2DB() {
  const db = orama_3_0_0_rc_2.create({ schema })
  
  for (const doc of dataset) {
    orama_3_0_0_rc_2.insert(db, doc)
  }

  return db
}

function getLatestDB() {
  const db = orama_latest.create({ schema })
  
  for (const doc of dataset) {
    orama_latest.insert(db, doc)
  }

  return db
}

export {
  orama_2_1_1,
  orama_3_0_0_rc_2,
  orama_latest,
  schema,
  dataset,
  getV2_1_1DB,
  getV3_0_0_rc_2DB,
  getLatestDB
}