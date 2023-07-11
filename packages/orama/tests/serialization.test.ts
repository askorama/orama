import t from 'tap'
import type { Document } from '../src/types.js'
import { Node as RadixNode } from '../src/trees/radix.js'
import { create, insert, load, Result, save, search } from '../src/index.js'
import { contains as trieContains } from '../src/trees/radix.js'
import { Index } from '../src/components/index.js'
import { DocumentsStore } from '../src/components/documents-store.js'

function extractOriginalDoc(result: Result[]): Document[] {
  return result.map(({ document }: Result) => document)
}

t.test('Edge getters', t => {
  t.plan(4)

  t.test('should correctly enable edge index getter', async t => {
    t.plan(2)

    const db = await create({
      schema: {
        name: 'string',
        age: 'number',
      },
    })

    await insert(db, {
      name: 'John',
      age: 30,
    })

    await insert(db, {
      name: 'Jane',
      age: 25,
    })

    const { index } = await save(db)
    const nameIndex = (index as Index).indexes['name']

    // Remember that tokenizers an stemmers sets content to lowercase
    t.ok(trieContains(nameIndex as RadixNode, 'john'))
    t.ok(trieContains(nameIndex as RadixNode, 'jane'))
  })

  t.test('should correctly enable edge docs getter', async t => {
    t.plan(2)

    const db = await create({
      schema: {
        name: 'string',
        age: 'number',
      },
    })

    const doc1 = await insert(db, {
      name: 'John',
      age: 30,
    })

    const doc2 = await insert(db, {
      name: 'Jane',
      age: 25,
    })

    const { docs } = await save(db)

    t.strictSame((docs as DocumentsStore).docs[Symbol.for(doc1)], { name: 'John', age: 30 })
    t.strictSame((docs as DocumentsStore).docs[Symbol.for(doc2)], { name: 'Jane', age: 25 })
  })

  t.test('should correctly enable index setter', async t => {
    t.plan(6)

    const db = await create({
      schema: {
        name: 'string',
        age: 'number',
      },
    })

    const jonh = {
      name: 'John',
      age: 30,
    }

    const jane = {
      name: 'Jane',
      age: 25,
    }

    const michele = {
      name: 'Michele',
      age: 27,
    }

    const paolo = {
      name: 'Paolo',
      age: 37,
    }

    await insert(db, jonh)
    await insert(db, jane)

    const db2 = await create({
      schema: {
        name: 'string',
        age: 'number',
      },
    })

    await insert(db2, michele)
    await insert(db2, paolo)

    const dbData = await save(db2)
    await load(db, dbData)

    const search1 = await search(db, { term: 'Jane' })
    const search2 = await search(db, { term: 'John' })
    const search3 = await search(db, { term: 'Paolo' })
    const search4 = await search(db, { term: 'Michele' })

    t.equal(search1.count, 0)
    t.equal(search2.count, 0)
    t.equal(search3.count, 1)
    t.equal(search4.count, 1)

    t.strictSame(extractOriginalDoc(search3.hits), [paolo])
    t.strictSame(extractOriginalDoc(search4.hits), [michele])
  })

  t.test('should correctly save and load data', async t => {
    t.plan(2)

    const originalDB = await create({
      schema: {
        name: 'string',
        age: 'number',
      },
    })

    await insert(originalDB, {
      name: 'Michele',
      age: 27,
    })

    await insert(originalDB, {
      name: 'Paolo',
      age: 37,
    })

    const DBData = await save(originalDB)

    const newDB = await create({
      schema: {
        name: 'string',
        age: 'number',
      },
    })

    await load(newDB, DBData)

    const search1 = await search(originalDB, { term: 'Michele' })
    const search2 = await search(newDB, { term: 'Michele' })

    const search3 = await search(originalDB, { term: 'P' })
    const search4 = await search(newDB, { term: 'P' })

    t.strictSame(search1.hits, search2.hits)
    t.strictSame(search3.hits, search4.hits)
  })
})
