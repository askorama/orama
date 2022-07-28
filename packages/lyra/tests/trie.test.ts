import { create as createNode } from '../src/prefix-tree/node'
import { contains as trieContains, find as trieFind, insert as trieInsert, removeWord as trieRemoveWord } from '../src/prefix-tree/trie'

const phrases = [
  { id: '1', doc: 'the quick, brown fox' },
  { id: '2', doc: 'jumps over the lazy dog' },
  { id: '3', doc: 'just in time!' },
  { id: '4', doc: 'there is something wrong in there' },
  { id: '5', doc: 'this is me' },
  { id: '6', doc: 'thought it was sunday' },
  { id: '7', doc: "let's try this trie" }
]

describe('trie', () => {
  it('should correctly index phrases into a prefix tree', () => {
    const nodes = {}
    const trie = createNode()

    for (const { doc, id } of phrases) {
      trieInsert(nodes, trie, doc, id)
    }

    for (const phrase of phrases) {
      expect(trieContains(nodes, trie, phrase.doc)).toBeTruthy()
    }
  })

  it('should correctly find an element by prefix', () => {
    const nodes = {}
    const trie = createNode()

    for (const { doc, id } of phrases) {
      trieInsert(nodes, trie, doc, id)
    }

    expect(trieFind(nodes, trie, { term: phrases[5].doc.slice(0, 5) })).toStrictEqual({
      [phrases[5].doc]: [phrases[5].id]
    })
    expect(trieFind(nodes, trie, { term: 'th' })).toMatchInlineSnapshot(`
      Object {
        "the quick, brown fox": Array [
          "1",
        ],
        "there is something wrong in there": Array [
          "4",
        ],
        "this is me": Array [
          "5",
        ],
        "thought it was sunday": Array [
          "6",
        ],
      }
    `)
  })

  it('should correctly delete a word from the trie', () => {
    const nodes = {}
    const trie = createNode()

    for (const { doc, id } of phrases) {
      trieInsert(nodes, trie, doc, id)
    }

    trieRemoveWord(nodes, trie, phrases[0].doc)

    expect(trieContains(nodes, trie, phrases[0].doc)).toBeFalsy()
    expect(trieFind(nodes,  trie, { term: phrases[0].doc })).toStrictEqual({})
  })
})
