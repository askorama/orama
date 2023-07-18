import { IdStore } from './types.js'

const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!#$%&()*+,-./:;<=>?@[]^_`{|}~';

export function generateShortId(last: string) {
  if (last === '') {
    return characters[0]
  }

  const lastGeneratedIdLastIndex = last.length - 1

  const lastChar = last[lastGeneratedIdLastIndex]

  const charIndex = characters.indexOf(lastChar)

  if (charIndex === characters.length - 1) {
    return last + characters[0]
  }

  return last.substring(0, lastGeneratedIdLastIndex) + characters[charIndex + 1]
}

export function generateUniqueShortId(db: IdStore, original: string): string {

  const existing = db.originalToShort[original]
  if (existing) {
    return existing
  }

  const newId = generateShortId(db.lastShort)

  db.originalToShort[original] = newId

  db.lastShort = newId

  db.shortToOriginal[newId] = original

  return newId
}

export function getOriginalId(db: IdStore, id: string) {
  return db.shortToOriginal[id]
}

export function getGeneratedId(db: IdStore, id: string) {
  return db.originalToShort[id]
}

export function createNewIdDatabase() {
  return {
    lastShort: '',
    shortToOriginal: {},
    originalToShort: {},
  }
}

