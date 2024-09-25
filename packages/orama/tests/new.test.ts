import t from 'tap'
import { AnyOrama, create, insertMultiple, search } from '../src/index.js'

async function createNew(docs: { description: string }[]) {
  const db = await create({
    schema: {
      description: 'string'
    } as const,
    components: {
      tokenizer: {
        stopWords: ['the', 'is', 'on', 'under']
      }
    }
  })
  await insertMultiple(
    db,
    docs.map(d => ({ ...d }))
  )
  return db
}
async function searchNew(db: AnyOrama, { term }: { term: string }) {
  const searchResult = await search(db, {
    mode: 'fulltext',
    term
  })
  return searchResult.hits
}

t.test('order of the results', async (t) => {
  const docs = [
    { id: '0', description: 'The pen is on the table. The cat is under the table. The dog is near the table' },
    { id: '1', description: 'The pen is on the table' },
    { id: '2', description: 'The cat is under the table' },
    { id: '3', description: 'The dog is near the table' }
  ]
  const s = await createNew(docs)

  t.test('if the document more words, it should be the first result', async (t) => {
    const results = await searchNew(s, {
      term: 'table'
    })

    t.equal(results.length, 4)
    t.equal(results[0].id, '0')
    const score = results[0].score

    for (let i = 1; i < results.length; i++) {
      t.ok(results[i].score < score, 'Score should be less than the first result')
    }
  })

  t.test('every doc permutation has the correct order', async (t) => {
    const docs = permutator([
      { id: '0', description: 'The pen is on the table. The cat is under the table. The dog is near the table' },
      { id: '1', description: 'The pen is on the table' },
      { id: '2', description: 'The cat is under the table' },
      { id: '3', description: 'The dog is near the table' }
    ])
    for (const d of docs) {
      const s = await createNew(d)
      const results = await searchNew(s, {
        term: 'table'
      })

      t.equal(results.length, 4)
      t.equal(results[0].id, '0')
      const score = results[0].score

      for (let i = 1; i < results.length; i++) {
        t.ok(results[i].score < score, 'Score should be less than the first result')
      }
    }
  })

  t.test('multiple words increments score', async (t) => {
    const results = await searchNew(s, {
      term: 'table pen'
    })
    t.equal(results.length, 4)
    t.equal(results[0].id, '0')
    const score = results[0].score

    for (let i = 1; i < results.length; i++) {
      t.ok(results[i].score < score, 'Score should be less than the first result')
    }

    const score2 = results[1].score
    for (let i = 2; i < results.length; i++) {
      t.ok(results[i].score < score2, 'Score should be less than the second result')
    }
  })

  t.test('same matches + same length, same score', async (t) => {
    const results = await searchNew(s, {
      term: 'table pen cat'
    })
    t.equal(results.length, 4)
    t.equal(results[0].id, '0')
    t.equal(results[1].id, '1')
    t.equal(results[2].id, '2')
    t.equal(results[3].id, '3')
    t.equal(results[1].score, results[2].score)
  })

  t.test('shorter, more score', async (t) => {
    const results = await searchNew(s, {
      term: 'table pen dog'
    })
    t.equal(results.length, 4)
    t.equal(results[0].id, '0')
    t.equal(results[1].id, '1')
    t.equal(results[2].id, '3')
    t.equal(results[3].id, '2')
  })

  t.test('matching word score is higher than prefixed word', async (t) => {
    const docs = [
      { id: '0', description: 'table' },
      { id: '1', description: 'tab' }
    ]
    const s = await createNew(docs)

    const results = await searchNew(s, {
      term: 'tab'
    })
    t.equal(results[0].id, '1')
    t.equal(results[1].id, '0')
    t.ok(results[1].score < results[0].score)
  })

  t.test("prefix score doesn't depend on matched word lenght", async (t) => {
    const docs = [{ description: 'table' }, { description: 'tab' }]
    const s = await createNew(docs)

    const results = await searchNew(s, {
      term: 't'
    })
    t.equal(results[0].score, results[1].score)
  })
})

function permutator<T>(inputArr: T[]): T[][] {
  const result: T[][] = []

  const permute = (arr, m = []) => {
    if (arr.length === 0) {
      result.push(m)
    } else {
      for (let i = 0; i < arr.length; i++) {
        const curr = arr.slice()
        const next = curr.splice(i, 1)
        permute(curr.slice(), m.concat(next))
      }
    }
  }

  permute(inputArr)

  return result
}
