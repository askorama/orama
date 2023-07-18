import t from 'tap'
import {
  generateShortId,
  generateUniqueShortId,
  getOriginalId,
  getGeneratedId,
  createNewIdDatabase,
} from '../src/id-shortener.js'

t.test('follow sequence', t => {
  t.plan(3)
  t.equal(generateShortId(''), 'A')
  t.equal(generateShortId('A'), 'B')
  t.equal(generateShortId('~'), '~A')
})

t.test('create and retrieve key', t => {
  t.plan(6)
  const idDatabase = createNewIdDatabase()
  const first = 'foobar'
  const firstKey = generateUniqueShortId(idDatabase, first)
  t.equal(firstKey, 'A')
  t.equal(getOriginalId(idDatabase, firstKey), first)

  const second = 'hello'
  const secondKey = generateUniqueShortId(idDatabase, second)
  t.equal(secondKey, 'B')
  t.equal(getOriginalId(idDatabase, secondKey), second)

  t.equal('A', getGeneratedId(idDatabase, first))
  t.equal('B', getGeneratedId(idDatabase, second))
})

t.test('massive insertion', t => {
  t.plan(1)
  const idDatabase = createNewIdDatabase()
  const generatedIds: string[] = []
  for (let i = 0; i < 1000; i++) {
    const generatedId = generateUniqueShortId(idDatabase, i.toString())
    generatedIds.push(generatedId)
  }

  const generatedIdsLength = generatedIds.length

  const uniqueIdsSize = new Set(generatedIds).size

  t.equal(generatedIdsLength, uniqueIdsSize)
})

t.test('generate same key', t => {
  t.plan(5)
  const idDatabase = createNewIdDatabase()
  const originalId = 'foobar'
  const firstKey = generateUniqueShortId(idDatabase, originalId)
  t.equal(firstKey, 'A')
  t.equal(getOriginalId(idDatabase, firstKey), originalId)

  const secondKey = generateUniqueShortId(idDatabase, originalId)
  t.equal(secondKey, firstKey)
  t.equal(getOriginalId(idDatabase, secondKey), originalId)

  t.equal('A', getGeneratedId(idDatabase, originalId))
})
