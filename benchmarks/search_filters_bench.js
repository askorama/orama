import { orama_2_1_1, orama_3_0_0_rc_2, orama_latest, getV2_1_1DB, getV3_0_0_rc_2DB, getLatestDB } from './common.js'

const v2_1_1DB = await getV2_1_1DB()
const v3_0_0_rc_2DB = getV3_0_0_rc_2DB()
const latestDB = getLatestDB()

Deno.bench('v2.1.1 search (with filters)', async () => {
  await orama_2_1_1.search(v2_1_1DB, { 
    term: 'AI companions',
    where: {
      rating: {
        gte: 3
      },
      genres: {
        containsAll: ['RPG']
      }
    }
  })
})

Deno.bench('v3.0.0-rc2 search (with filters)', () => {
  orama_3_0_0_rc_2.search(v3_0_0_rc_2DB, { 
    term: 'AI companions',
    where: {
      rating: {
        gte: 3
      },
      genres: {
        containsAll: ['RPG']
      }
    }
  })
})

Deno.bench('latest search (with filters)', () => {
  orama_latest.search(latestDB, { 
    term: 'AI companions',
    where: {
      rating: {
        gte: 3
      },
      genres: {
        containsAll: ['RPG']
      }
    }
  })
})