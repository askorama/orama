import t from 'tap'
import {
  contains as radixContains,
  create as createNode,
  find as radixFind,
  insert as radixInsert,
  removeDocumentByWord as radixRemoveDocumentByWord,
  removeWord as radixRemoveWord,
} from '../src/trees/radix.js'

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
  { id: 10, doc: 'prova' },
]

t.test('radix tree', t => {
  t.plan(7)

  t.test('should correctly find an element by prefix', t => {
    t.plan(1)
    const root = createNode()
    for (const { doc, id } of phrases) {
      radixInsert(root, doc, id)
    }
    const result = radixFind(root, { term: phrases[5].doc.slice(0, 5) })
    t.strictSame(result, {
      [phrases[5].doc]: [phrases[5].id],
    })
  })

  t.test('should correctly find a complete sentence', t => {
    t.plan(phrases.length)
    const root = createNode()
    for (const { doc, id } of phrases) {
      radixInsert(root, doc, id)
    }

    for (const phrase of phrases) {
      const result = radixFind(root, { term: phrase.doc })
      t.strictSame(result, {
        [phrase.doc]: [phrase.id],
      })
    }
  })

  t.test('exact works correctly', t => {
    t.plan(2)
    const root = createNode()
    for (const { doc, id } of phrases) {
      radixInsert(root, doc, id)
    }
    const exactResult = radixFind(root, { term: phrases[5].doc.slice(0, 5), exact: true })
    t.strictSame(exactResult, {})

    const result = radixFind(root, { term: phrases[5].doc, exact: true })
    t.strictSame(result, { [phrases[5].doc]: [phrases[5].id] })
  })

  t.test('should correctly index phrases into a prefix tree', t => {
    t.plan(phrases.length + 1)

    const root = createNode()

    for (const { doc, id } of phrases) {
      radixInsert(root, doc, id)
    }

    for (const phrase of phrases) {
      t.ok(radixContains(root, phrase.doc))
    }

    t.notOk(radixContains(root, 'thought it was saturday'))
  })

  t.test('should correctly delete a word from the tree', t => {
    t.plan(phrases.length + 2)

    const root = createNode()

    for (const { doc, id } of phrases) {
      radixInsert(root, doc, id)
    }

    const removedIndex = 0
    const removal = radixRemoveWord(root, phrases[removedIndex].doc)
    t.ok(removal)

    const invalidRemoval = radixRemoveWord(root, 'xyz')
    t.notOk(invalidRemoval)

    for (let i = 0; i < phrases.length; i++) {
      if (i === removedIndex) {
        t.notOk(radixContains(root, phrases[removedIndex].doc))
      } else {
        const result = radixFind(root, { term: phrases[i].doc })
        t.strictSame(result, {
          [phrases[i].doc]: [phrases[i].id],
        })
      }
    }
  })

  t.test('should correctly delete a id from the tree with exact=true', t => {
    t.plan(2)

    const root = createNode()

    for (const { doc, id } of phrases) {
      radixInsert(root, doc, id)
    }

    radixRemoveDocumentByWord(root, phrases[0].doc, phrases[0].id, true)

    const resultFullSearch = radixFind(root, { term: phrases[0].doc })

    t.strictSame(resultFullSearch, {
      [phrases[0].doc]: [],
    })

    const resultHalfSearch = radixFind(root, { term: 'the' })
    t.has(resultHalfSearch, {
      [phrases[0].doc]: [],
    })
  })

  t.test('should correctly delete a id from the tree', t => {
    t.plan(2)

    const root = createNode()

    for (const { doc, id } of phrases) {
      radixInsert(root, doc, id)
    }

    radixRemoveDocumentByWord(root, phrases[0].doc, phrases[0].id, false)

    const resultFullSearch = radixFind(root, { term: phrases[0].doc })
    t.strictSame(resultFullSearch, {
      [phrases[0].doc]: [],
    })

    const resultHalfSearch = radixFind(root, { term: phrases[0].doc.slice(0, 5) })
    t.strictSame(resultHalfSearch, {
      [phrases[0].doc]: [],
    })
  })
})

t.test('test from trie for compatibility', t => {
  t.plan(3)

  t.test('should correctly index phrases into a prefix tree', t => {
    t.plan(phrases.length)

    const trie = createNode()

    for (const { doc, id } of phrases) {
      radixInsert(trie, doc, id)
    }

    for (const phrase of phrases) {
      t.ok(radixContains(trie, phrase.doc))
    }
  })

  t.test('should correctly find an element by prefix', t => {
    t.plan(2)

    const trie = createNode()

    for (const { doc, id } of phrases) {
      radixInsert(trie, doc, id)
    }

    t.strictSame(radixFind(trie, { term: phrases[5].doc.slice(0, 5) }), { [phrases[5].doc]: [phrases[5].id] })
    t.strictSame(radixFind(trie, { term: 'th' }), {
      [phrases[0].doc]: [phrases[0].id],
      [phrases[3].doc]: [phrases[3].id],
      [phrases[4].doc]: [phrases[4].id],
      [phrases[5].doc]: [phrases[5].id],
    })
  })

  t.test('should correctly delete a word from the trie', t => {
    t.plan(2)

    const trie = createNode()

    for (const { doc, id } of phrases) {
      radixInsert(trie, doc, id)
    }

    radixRemoveWord(trie, phrases[0].doc)

    t.notOk(radixContains(trie, phrases[0].doc))
    t.strictSame(radixFind(trie, { term: phrases[0].doc }), {})
  })
})
