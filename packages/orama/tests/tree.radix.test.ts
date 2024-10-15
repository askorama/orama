import t from 'tap'
import { RadixTree } from '../src/trees/radix.js'

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

t.test('radix tree', (t) => {
  t.test('should correctly find an element by prefix', (t) => {
    t.plan(1)
    const tree = new RadixTree()
    for (const { doc, id } of phrases) {
      tree.insert(doc, id)
    }
    const result = tree.find({ term: phrases[5].doc.slice(0, 5) })
    t.strictSame(result, {
      [phrases[5].doc]: [phrases[5].id]
    })
  })

  t.test('should correctly find a complete sentence', (t) => {
    t.plan(phrases.length)
    const tree = new RadixTree()
    for (const { doc, id } of phrases) {
      tree.insert(doc, id)
    }

    for (const phrase of phrases) {
      const result = tree.find({ term: phrase.doc })
      t.strictSame(result, {
        [phrase.doc]: [phrase.id]
      })
    }
  })

  t.test('exact works correctly', (t) => {
    t.plan(2)
    const tree = new RadixTree()
    for (const { doc, id } of phrases) {
      tree.insert(doc, id)
    }
    const exactResult = tree.find({ term: phrases[5].doc.slice(0, 5), exact: true })
    t.strictSame(exactResult, {})

    const result = tree.find({ term: phrases[5].doc, exact: true })
    t.strictSame(result, { [phrases[5].doc]: [phrases[5].id] })
  })

  t.test('should correctly index phrases into a prefix tree', (t) => {
    t.plan(phrases.length + 1)

    const tree = new RadixTree()

    for (const { doc, id } of phrases) {
      tree.insert(doc, id)
    }

    for (const phrase of phrases) {
      t.equal(tree.contains(phrase.doc), true)
    }

    t.equal(tree.contains('thought it was saturday'), false)
  })

  t.test('should correctly delete a word from the tree', (t) => {
    t.plan(phrases.length + 2)

    const tree = new RadixTree()

    for (const { doc, id } of phrases) {
      tree.insert(doc, id)
    }

    const removedIndex = 0
    const removal = tree.removeWord(phrases[removedIndex].doc)
    t.ok(removal)

    const invalidRemoval = tree.removeWord('xyz')
    t.notOk(invalidRemoval)

    for (let i = 0; i < phrases.length; i++) {
      if (i === removedIndex) {
        t.notOk(tree.contains(phrases[removedIndex].doc))
      } else {
        const result = tree.find({ term: phrases[i].doc })
        t.strictSame(result, {
          [phrases[i].doc]: [phrases[i].id]
        })
      }
    }
  })

  t.test('should correctly delete a id from the tree with exact=true', (t) => {
    t.plan(2)

    const tree = new RadixTree()

    for (const { doc, id } of phrases) {
      tree.insert(doc, id)
    }

    tree.removeDocumentByWord(phrases[0].doc, phrases[0].id, true)

    const resultFullSearch = tree.find({ term: phrases[0].doc })

    t.strictSame(resultFullSearch, {
      [phrases[0].doc]: []
    })

    const resultHalfSearch = tree.find({ term: 'the' })
    t.has(resultHalfSearch, {
      [phrases[0].doc]: []
    })
  })

  t.test('should correctly delete a id from the tree', (t) => {
    t.plan(2)

    const tree = new RadixTree()

    for (const { doc, id } of phrases) {
      tree.insert(doc, id)
    }

    tree.removeDocumentByWord(phrases[0].doc, phrases[0].id, false)

    const resultFullSearch = tree.find({ term: phrases[0].doc })
    t.strictSame(resultFullSearch, {
      [phrases[0].doc]: []
    })

    const resultHalfSearch = tree.find({ term: phrases[0].doc.slice(0, 5) })
    t.strictSame(resultHalfSearch, {
      [phrases[0].doc]: []
    })
  })

  //testcase doesnt pass even after PR#580
  const words = [
    { id: 0, word: 'apple' },
    { id: 1, word: 'app' },
    { id: 2, word: 'apply' },
    { id: 3, word: 'apt' },
    { id: 4, word: 'apex' },
    { id: 5, word: 'about' },
    { id: 6, word: 'again' }
  ]
  t.test('test search with tolerance. should match all with prefix.', (t) => {
    const tree = new RadixTree()

    for (const { word, id } of words) {
      tree.insert(word, id)
    }
    const result1 = tree.find({ term: 'app' })
    const expected1 = { apple: [0], app: [1], apply: [2] }
    t.strictSame(result1, expected1)

    const result2 = tree.find({ term: 'app', exact: false, tolerance: 1 })
    const expected2 = { apple: [0], app: [1], apply: [2], apt: [3] }
    t.strictSame(result2, expected2)

    const result3 = tree.find({ term: 'app', exact: false, tolerance: 2 })
    const expected3 = { apple: [0], app: [1], apply: [2], apt: [3], apex: [4] }
    t.strictSame(result3, expected3)

    t.end()
  })

  t.end()
})

t.test('test from trie for compatibility', (t) => {
  t.plan(3)

  t.test('should correctly index phrases into a prefix tree', (t) => {
    t.plan(phrases.length)

    const tree = new RadixTree()

    for (const { doc, id } of phrases) {
      tree.insert(doc, id)
    }

    for (const phrase of phrases) {
      t.ok(tree.contains(phrase.doc))
    }
  })

  t.test('should correctly find an element by prefix', (t) => {
    t.plan(2)

    const tree = new RadixTree()

    for (const { doc, id } of phrases) {
      tree.insert(doc, id)
    }

    t.strictSame(tree.find({ term: phrases[5].doc.slice(0, 5) }), { [phrases[5].doc]: [phrases[5].id] })
    t.strictSame(tree.find({ term: 'th' }), {
      [phrases[0].doc]: [phrases[0].id],
      [phrases[3].doc]: [phrases[3].id],
      [phrases[4].doc]: [phrases[4].id],
      [phrases[5].doc]: [phrases[5].id]
    })
  })

  t.test('should correctly delete a word from the trie', (t) => {
    t.plan(2)

    const tree = new RadixTree()

    for (const { doc, id } of phrases) {
      tree.insert(doc, id)
    }

    tree.removeWord(phrases[0].doc)

    t.notOk(tree.contains(phrases[0].doc))
    t.strictSame(tree.find({ term: phrases[0].doc }), {})
  })
})
