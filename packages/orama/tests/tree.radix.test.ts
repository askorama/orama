import t from 'tap'
import {
  create as createNode,
  find as radixFind,
  insert as radixInsert,
  removeDocumentByWord,
} from '../src/trees/radix.js'
import { tokenizer as Tokenizer } from '../src/components.js'

const phrases = [
  { id: 1, doc: 'the quick, brown fox' },
  { id: 2, doc: 'jumps over the lazy dog' },
  { id: 3, doc: 'just in time!' },
  { id: 4, doc: 'there is something wrong in there' },
  { id: 5, doc: 'this is me' },
  { id: 6, doc: 'thought it was sunday' },
  { id: 7, doc: "let's try this trie" },
  { id: 8, doc: 'primo' },
  { id: 9, doc: 'primate' },
  { id: 10, doc: 'prova' }
]

const tokenizer = await Tokenizer.createTokenizer()
async function buildTree(docs = phrases) {
  const tree = createNode(false, '', '', false)
  for (const { doc, id } of docs) {
    await radixInsert(tree, doc, id, tokenizer, undefined, '')
  }
  return tree
}

t.test('radix tree', (t) => {
  t.test('should correctly find an element by prefix', async (t) => {
    t.plan(1)
    const tree = await buildTree()
    const result = radixFind(tree, { term: phrases[5].doc.slice(0, 5) })
    t.strictSame(result, {
      'thought': [phrases[5].id]
    })
  })

  t.test('should correctly find a complete sentence', async (t) => {
    const tree = await buildTree()

    for (const phrase of phrases) {
      const tokens = await tokenizer.tokenize(phrase.doc)
      for (const term of tokens) {
        const term = phrase.doc.split(' ')[0]
        const result = radixFind(tree, { term })
        t.ok(result[term].includes(phrase.id))
      }
    }
  })

  t.test('exact works correctly', async (t) => {
    const tree = await buildTree()

    const exactResult = radixFind(tree, { term: 'the', exact: true })
    t.strictSame(exactResult, {
      'the': [1, 2]
    })
    const prefixResult = radixFind(tree, { term: 'the', exact: false })
    t.strictSame(prefixResult, {
      'the': [1, 2],
      "there": [4],
    })
  })

  // TODO: this test tests a non feature: `radixContains` is not used at all
  t.test('should correctly index phrases into a prefix tree',{ skip: true }, async (t) => {
    const tree = await buildTree()

    for (const phrase of phrases) {
      t.ok(radixContains(tree, phrase.doc))
    }

    t.notOk(radixContains(tree, 'thought it was saturday'))
  })


  // TODO: this test tests a non feature: `radixRemoveWord` and `radixContains` are not used at all
  t.test('should correctly delete a word from the tree', { skip: true }, async (t) => {
    const tree = await buildTree()

    const removedIndex = 0
    const removal = radixRemoveWord(tree, phrases[removedIndex].doc)
    t.ok(removal)

    const invalidRemoval = radixRemoveWord(tree, 'xyz')
    t.notOk(invalidRemoval)

    for (let i = 0; i < phrases.length; i++) {
      if (i === removedIndex) {
        t.notOk(radixContains(root, phrases[removedIndex].doc))
      } else {
        const result = radixFind(root, { term: phrases[i].doc })
        t.strictSame(result, {
          [phrases[i].doc]: [phrases[i].id]
        })
      }
    }
  })

  // TODO: this is an unnecessary test: `exact` is always `true`
  t.test('should correctly delete a id from the tree with exact=true', { skip: true }, async (t) => {
    const tree = await buildTree()

    radixRemoveDocumentByWord(tree, phrases[0].doc, phrases[0].id, true)

    const resultFullSearch = radixFind(tree, { term: phrases[0].doc })

    t.strictSame(resultFullSearch, {
      [phrases[0].doc]: []
    })

    const resultHalfSearch = radixFind(tree, { term: 'the' })
    t.has(resultHalfSearch, {
      [phrases[0].doc]: []
    })
  })

  // again
  t.test('should correctly delete a id from the tree', { skip: true }, async (t) => {
    const tree = await buildTree()

    radixRemoveDocumentByWord(tree, phrases[0].doc, phrases[0].id, false)

    const resultFullSearch = radixFind(tree, { term: phrases[0].doc })
    t.strictSame(resultFullSearch, {
      [phrases[0].doc]: []
    })

    const resultHalfSearch = radixFind(tree, { term: phrases[0].doc.slice(0, 5) })
    t.strictSame(resultHalfSearch, {
      [phrases[0].doc]: []
    })
  })

  //testcase doesnt pass even after PR#580
  const words = [
    { id: 0, doc: 'apple' },
    { id: 1, doc: 'app' },
    { id: 2, doc: 'apply' },
    { id: 3, doc: 'apt' },
    { id: 4, doc: 'apex' },
    { id: 5, doc: 'about' },
    { id: 6, doc: 'again' }
  ]
  t.test('test search with tolerance. should match all with prefix.', async (t) => {
    const tree = await buildTree(words)

    const result1 = radixFind(tree, { term: 'app' })
    const expected1 = { apple: [0], app: [1], apply: [2] }
    t.strictSame(result1, expected1)

    const result2 = radixFind(tree, { term: 'app', exact: false, tolerance: 1 })
    const expected2 = { apple: [0], app: [1], apply: [2], apt: [3] }
    t.strictSame(result2, expected2)

    const result3 = radixFind(tree, { term: 'app', exact: false, tolerance: 2 })
    const expected3 = { apple: [0], app: [1], apply: [2], apt: [3], apex: [4] }
    t.strictSame(result3, expected3)

    t.end()
  })

  t.end()
})


t.test('test from trie for compatibility', async (t) => {
  // radixContains is not used at all
  t.test('should correctly index phrases into a prefix tree', { skip: true }, async (t) => {
    const tree = await buildTree()

    for (const phrase of phrases) {
      t.ok(radixContains(tree, phrase.doc))
    }
  })

  t.test('should correctly find an element by prefix', async (t) => {
    const tree = await buildTree()

    t.strictSame(radixFind(tree, { term: phrases[5].doc.slice(0, 5) }), { thought: [ 6 ] })
    t.strictSame(radixFind(tree, { term: 'th' }), {
      the: [ 1, 2 ],
      there: [ 4 ],
      this: [ 5, 7 ],
      thought: [ 6 ],
    })
  })

  t.test('should correctly delete a word from the trie', async (t) => {
    const tree = await buildTree()

    removeDocumentByWord(tree, 'the', phrases[0].id)

    t.strictSame(radixFind(tree, { term: 'the' }), {
      the: [
        2,
      ],
      there: [
        4,
      ]
    })
  })
})

