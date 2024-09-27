import t from 'tap'
import { AnyOrama, create, insertMultiple, search } from '../src/index.js'
import { bitmask_20, calculateTokenQuantum, count } from '../src/trees/radix.js'

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

t.test('calculateTokenQuantum', async t => {
  let n = 0
  n = calculateTokenQuantum(n, 0)
  t.equal(n, 1 + (1 << 20), 'set the 0th bit and the 20th bit')
  n = calculateTokenQuantum(n, 0)
  t.equal(n, 1 + (2 << 20), 'increment the counter')
  n = calculateTokenQuantum(n, 1)
  t.equal(n, 3 + (3 << 20), ' 1 + 2 + (3 count)')
  n = calculateTokenQuantum(n, 2)
  t.equal(n, 7 + (4 << 20), ' 1 + 2 + 4 + (4 count)')

  t.equal(bitmask_20(n), 7)
  t.equal(count(n), 4)
})

t.test('matching criteria', async t => {
  const docs = [
      { id: '0', description: 'Find your way!' },
  ]
  const s = await createNew(docs)

  t.test('no match', async t => {
      const results = await searchNew(s, {
          term: 'unknown words'
      })
      t.equal(results.length, 0)
  })

  t.test('match', async t => {
      const results = await searchNew(s, {
          term: 'way'
      })
      t.equal(results.length, 1)
      t.equal(results[0].id, '0')
  })

  t.test('match with 2 words', async t => {
      const results = await searchNew(s, {
          term: 'way find'
      })
      t.equal(results.length, 1)
      t.equal(results[0].id, '0')
  })

  t.test('the order of the words doesn\'t matter', async t => {
      const results1 = await searchNew(s, {
          term: 'way find'
      })
      t.equal(results1.length, 1)
      t.equal(results1[0].id, '0')
      const score = results1[0].score

      const results2 = await searchNew(s, {
          term: 'way find'
      })
      t.equal(results2.length, 1)
      t.equal(results2[0].id, '0')

      t.equal(results2[0].score, score)
  })

  t.test('empty string', async t => {
      const results = await searchNew(s, {
          term: ''
      })
      t.equal(results.length, 1)
      t.equal(results[0].id, '0')
      t.equal(results[0].score, 0)
  })

  t.test('prefix', async t => {
      const results = await searchNew(s, {
          term: 'w'
      })
      t.equal(results.length, 1)
      t.equal(results[0].id, '0')
  })
})

t.test('long text', async t => {
  const docs = [
      { id: '0', description: 'The pen is on the table. '.repeat(100) },
      { id: '1', description: 'The pen is on the table' },
  ]
  const s = await createNew(docs)

  const results = await searchNew(s, {
      term: 'table'
  })
  t.equal(results.length, 2)
  t.equal(results[0].id, '0')
  t.equal(results[1].id, '1')
  t.ok(results[0].score > results[1].score)
})

t.test('test', async t => {
  const docs = [
      { id: '0', description: 'FLEXIBLE COMFORT.On your marks! The Nike Flex Plus is built for kiddos who want to move all day. With a flexible feel, supersoft cushioning and an easy slip-on design (no laces needed!), these running-inspired shoes are ready to zoom with little feet learning to crawl and walk.360 ComfortSupersoft foam cushioning feels plush with every move.Easy to WearThe slip-on design with 2 pull tabs gets little feet in easily. A stretchy strap with leather on the sides creates a secure feel.Super FlexibleFlexibility grooves under the forefoot help make every growing step feel natural.More BenefitsMesh fabric adds breathability where little feet need it.Reinforced toe tip brings extra durability for kids who drag their toes.Product DetailsNot intended for use as Personal Protective Equipment (PPE)Shown: Game Royal/Midnight Navy/White/Yellow OchreStyle: CW7430-405' },
      { id: '1', description: 'no matter the distance. Easy, adjustable cuffs help you slide these on and off after your warmup or run.BenefitsNike Dri-FIT technology moves sweat away from your skin for quicker evaporation, helping you stay dry and comfortable.Soft knit fabric is lightweight and breathable.Zippered pockets help keep your things secure.Bungee cords at the hem make it easier to change them over your running shoes.Nike Track Club silicone oval logo is inspired by the shape of a track.Product DetailsElastic waistband with a drawcord100% polyesterMachine washImportedShown: Midnight Navy/Summit White/Summit WhiteStyle: FB5503-410' },
      { id: '2', description: 'A NEW GENERATION OF MAX.Nodding to &apos;90s style, the Nike Air Max Axis honors the past while looking to the future. Subtle design lines and branding pay homage to icons like the Air Max 97 and 98, while sleek no-sew skins, airy mesh and its unique heel design keep your look fresh. Of course, Max Air cushions your journey.BenefitsOriginally designed for performance running, the visible Max Air unit provides lasting comfort.The design lines and details nod to the iconic &apos;90s running shoes you lovesuddenly they could see it. Since then, next-generation Air Max shoes have become a hit with athletes and collectors by offering striking color combinations and reliable, lightweight cushioning.'}
  ]
  const s = await createNew(docs)

  const results = await searchNew(s, {
      term: 'running shoes'
  })

  t.equal(results.length, 3)
  // The 3° document has the most matches because it:
  // - contains running
  // - contains shoes twice
  // - contains running shoes in the same sentence
  t.equal(results[0].id, '2')
  // The 2° document is the second because it:
  // - contains running
  // - contains shoes but only one
  // - contains running shoes in the same sentence
  t.equal(results[1].id, '1')
  // The 1° document is the last because it:
  // - not contain running (it contains "running-inspired" but it's not the same in this case)
  // - contains shoes
  t.equal(results[2].id, '0')
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
