import * as orama211 from 'orama_211'
import * as orama300rc2 from 'orama_300_rc_2'
import * as oramaLatest from 'orama_latest'
import dataset from './dataset.json' assert { type: 'json' }

export const schema = {
  title: 'string',
  description: 'string',
  rating: 'number',
  genres: 'enum[]'
}

const create = {
  orama211: () => orama211.create({ schema }),
  orama300rc2: () => orama300rc2.create({ schema }),
  oramaLatest: () => oramaLatest.create({ schema })
}

const db211 = await create.orama211()
const db300rc2 = create.orama300rc2()
const dbLatest = create.oramaLatest()

export const insert = {
  orama211: async () => {
    const db = await create.orama211()
    for (const record of dataset) {
      await orama211.insert(db, record)
    }
  },
  orama300rc2: () => {
    const db = create.orama300rc2()
    for (const record of dataset) {
      orama300rc2.insert(db, record)
    }
  },
  oramaLatest: () => {
    const db = create.oramaLatest()
    for (const record of dataset) {
      oramaLatest.insert(db, record)
    }
  }
}

export const insertMultiple = {
  orama211: async () => {
    await orama211.insertMultiple(db211, dataset, 50)
  },
  orama300rc2: () => {
    orama300rc2.insertMultiple(db300rc2, dataset, 50)
  },
  oramaLatest: () => {
    oramaLatest.insertMultiple(dbLatest, dataset, 50)
  }
}

export const searchPlain = {
  orama211: async () => {
    await orama211.search(db211, { term: 'Legend of Zelda' })
  },
  orama300rc2: () => {
    orama300rc2.search(db300rc2, { term: 'Legend of Zelda' })
  },
  oramaLatest: () => {
    oramaLatest.search(dbLatest, { term: 'Legend of Zelda' })
  }
}

export const searchWithFilters = {
  orama211: async () => {
    await orama211.search(db211, { term: 'Super Hero', where: { rating: { gte: 4 } } })
  },
  orama300rc2: () => {
    orama300rc2.search(db300rc2, { term: 'Super Hero', where: { rating: { gte: 4 } } })
  },
  oramaLatest: () => {
    oramaLatest.search(dbLatest, { term: 'Super Hero', where: { rating: { gte: 4 } } })
  }
}

export const searchWithLongTextAndComplexFilters = {
  orama211: async () => {
    await orama211.search(db211, { term: 'classic run gun, action game focused on boss battles', where: { rating: { gte: 4 }, genres: { containsAll: ['Shooter'] } } })
  },
  orama300rc2: () => {
    orama300rc2.search(db300rc2, { term: 'classic run gun, action game focused on boss battles', where: { rating: { gte: 4 }, genres: { containsAll: ['Shooter'] } } })
  },
  oramaLatest: () => {
    oramaLatest.search(dbLatest, { term: 'classic run gun, action game focused on boss battles', where: { rating: { gte: 4 }, genres: { containsAll: ['Shooter'] } } })
  }
}