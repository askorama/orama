import { syncBoundedLevenshtein } from '../components/levenshtein.js'
import { InternalDocumentID } from '../components/internal-document-id-store.js'
import { getOwnProperty } from '../utils.js'
import { Tokenizer } from '../types.js'

export class Node {
  constructor(key: string, subWord: string, end: boolean) {
    this.k = key
    this.s = subWord
    this.e = end
  }

  // Node key
  public k: string
  // Node subword
  public s: string
  // Node children
  public c: Record<string, Node> = {}
  // Node documents
  public d: InternalDocumentID[] = []
  // Node end
  public e: boolean
  // Node word
  public w = ''

  public toJSON(): object {
    return {
      w: this.w,
      s: this.s,
      c: this.c,
      d: this.d,
      e: this.e
    }
  }
}

interface FindParams {
  term: string
  exact?: boolean
  tolerance?: number
}

type FindResult = Record<string, InternalDocumentID[]>

function updateParent(node: Node, parent: Node): void {
  node.w = parent.w + node.s
}

function addDocument(node: Node, docID: InternalDocumentID): void {
  node.d.push(docID)
}

function removeDocument(node: Node, docID: InternalDocumentID): boolean {
  const index = node.d.indexOf(docID)

  /* c8 ignore next 3 */
  if (index === -1) {
    return false
  }

  node.d.splice(index, 1)

  return true
}

function findAllWords(node: Node, output: FindResult, term: string, exact?: boolean, tolerance?: number) {
  if (node.e) {
    const { w, d: docIDs } = node

    if (exact && w !== term) {
      return {}
    }

    // always check in own property to prevent access to inherited properties
    // fix https://github.com/askorama/orama/issues/137
    if (getOwnProperty(output, w) == null) {
      if (tolerance) {
        // computing the absolute difference of letters between the term and the word
        const difference = Math.abs(term.length - w.length)

        // if the tolerance is set, check whether the edit distance is within tolerance.
        // In that case, we don't need to add the word to the output
        if (difference <= tolerance && syncBoundedLevenshtein(term, w, tolerance).isBounded) {
          output[w] = []
        }
      } else {
        // prevent default tolerance not set
        output[w] = []
      }
    }

    // check if _output[w] exists and then add the doc to it
    // always check in own property to prevent access to inherited properties
    // fix https://github.com/askorama/orama/issues/137
    if (getOwnProperty(output, w) != null && docIDs.length > 0) {
      const docs = new Set(output[w])

      const docIDsLength = docIDs.length
      for (let i = 0; i < docIDsLength; i++) {
        docs.add(docIDs[i])
      }
      output[w] = Array.from(docs)
    }
  }

  // recursively search the children
  for (const character of Object.keys(node.c)) {
    findAllWords(node.c[character], output, term, exact, tolerance)
  }
  return output
}

function getCommonPrefix(a: string, b: string) {
  let commonPrefix = ''
  const len = Math.min(a.length, b.length)
  for (let i = 0; i < len; i++) {
    if (a[i] !== b[i]) {
      return commonPrefix
    }
    commonPrefix += a[i]
  }
  return commonPrefix
}

export const RadixType = 'Radix' as const
export interface RadixTree {
  type: typeof RadixType
  node: Node
  isArray: boolean
  tokensLength: Map<number, number>
  tokenQuantums: Record<number, Record<string, number>>
}

function createNode(end: boolean, subWord: string, key: string): Node {
  return new Node(key, subWord, end)
}

export function create(end: boolean, subWord: string, key: string, isArray: boolean): RadixTree {
  return {
    type: RadixType,
    node: new Node(key, subWord, end),
    isArray,
    tokensLength: new Map(),
    tokenQuantums: {}
  }
}

async function insertInner(tree: RadixTree, word: string, docId: InternalDocumentID) {
  let root = tree.node

  const wordLength = word.length
  for (let i = 0; i < wordLength; i++) {
    const currentCharacter = word[i]
    const wordAtIndex = word.substring(i)
    const rootChildCurrentChar = root.c[currentCharacter]

    if (rootChildCurrentChar) {
      const edgeLabel = rootChildCurrentChar.s
      const edgeLabelLength = edgeLabel.length

      const commonPrefix = getCommonPrefix(edgeLabel, wordAtIndex)
      const commonPrefixLength = commonPrefix.length

      // the wordAtIndex matches exactly with an existing child node
      if (edgeLabel === wordAtIndex) {
        addDocument(rootChildCurrentChar, docId)
        rootChildCurrentChar.e = true
        return
      }

      const edgeLabelAtCommonPrefix = edgeLabel[commonPrefixLength]
      // the wordAtIndex is completely contained in the child node subword
      if (commonPrefixLength < edgeLabelLength && commonPrefixLength === wordAtIndex.length) {
        const newNode = createNode(true, wordAtIndex, currentCharacter) // Create a new node with end set to true
        newNode.c[edgeLabelAtCommonPrefix] = rootChildCurrentChar

        const newNodeChild = newNode.c[edgeLabelAtCommonPrefix]
        newNodeChild.s = edgeLabel.substring(commonPrefixLength)
        newNodeChild.k = edgeLabelAtCommonPrefix

        root.c[currentCharacter] = newNode

        updateParent(newNode, root)
        updateParent(newNodeChild, newNode)
        addDocument(newNode, docId)
        return
      }

      // the wordAtIndex is partially contained in the child node subword
      if (commonPrefixLength < edgeLabelLength && commonPrefixLength < wordAtIndex.length) {
        const inbetweenNode = createNode(false, commonPrefix, currentCharacter)
        inbetweenNode.c[edgeLabelAtCommonPrefix] = rootChildCurrentChar
        root.c[currentCharacter] = inbetweenNode

        const inbetweenNodeChild = inbetweenNode.c[edgeLabelAtCommonPrefix]
        inbetweenNodeChild.s = edgeLabel.substring(commonPrefixLength)
        inbetweenNodeChild.k = edgeLabelAtCommonPrefix

        const wordAtCommonPrefix = wordAtIndex[commonPrefixLength]
        const newNode = createNode(true, word.substring(i + commonPrefixLength), wordAtCommonPrefix)
        addDocument(newNode, docId)

        inbetweenNode.c[wordAtCommonPrefix] = newNode

        updateParent(inbetweenNode, root)
        updateParent(newNode, inbetweenNode)
        updateParent(inbetweenNodeChild, inbetweenNode)
        return
      }

      // skip to the next divergent character
      i += edgeLabelLength - 1
      // navigate in the child node
      root = rootChildCurrentChar
    } else {
      // if the node for the current character doesn't exist create new node
      const newNode = createNode(true, wordAtIndex, currentCharacter)
      addDocument(newNode, docId)

      root.c[currentCharacter] = newNode
      updateParent(newNode, root)
      return
    }
  }
}

export async function insert(
  tree: RadixTree,
  value: string,
  docId: InternalDocumentID,
  tokenizer: Tokenizer,
  language: string | undefined,
  prop: string
) {
  const quantums = value.split(/\.|\?|!/)

  tree.tokenQuantums[docId] = {}

  let quantumIndex = 0
  let tokenNumber = 0
  for (const quantum of quantums) {
    const tokens = await tokenizer.tokenize(quantum, language, prop)

    for (const token of tokens) {
      tokenNumber++

      if (!tree.tokenQuantums[docId][token]) {
        tree.tokenQuantums[docId][token] = 0
      }

      const tokenBitIndex = Math.min(quantumIndex, 20)

      tree.tokenQuantums[docId][token] = calculateTokenQuantum(tree.tokenQuantums[docId][token], tokenBitIndex)
      if (tree.tokenQuantums[docId][token] < 0) {
        // console.log("Overflow", docId, token, data.tokenStats.description[docId][token], tokenBitIndex)
        throw new Error('Overflow')
      }

      insertInner(tree, token, docId)
    }

    // Don't increment the quantum index if the sentence is too short
    if (tokens.length > 1) {
      quantumIndex++
    }
  }

  tree.tokensLength.set(docId, tokenNumber)
}

export function calculateTokenQuantum(prevValue: number, bit: number) {
  if (prevValue < 0) {
    throw new Error('Overflow')
  }
  if (bit < 0 || bit > 20) {
    throw new Error('Invalid bit')
  }

  const currentCount = count(prevValue)
  const currentSentenceMask = bitmask_20(prevValue)
  const newSentenceMask = currentSentenceMask | (1 << bit)
  return ((currentCount + 1) << 20) | newSentenceMask
}

export function count(n: number) {
  return n >> 20
}
const BIT_MASK_20 = 0b11111111111111111111
export function bitmask_20(n: number) {
  return n & BIT_MASK_20
}

function _findLevenshtein(
  node: Node,
  term: string,
  index: number,
  tolerance: number,
  originalTolerance: number,
  output: FindResult
) {
  if (tolerance < 0) {
    return
  }

  if (node.w.startsWith(term)) {
    findAllWords(node, output, term, false, 0)
    return
  }

  if (node.e) {
    const { w, d: docIDs } = node
    if (w) {
      if (syncBoundedLevenshtein(term, w, originalTolerance).isBounded) {
        output[w] = []
      }
      if (getOwnProperty(output, w) != null && docIDs.length > 0) {
        const docs = new Set(output[w])

        const docIDsLength = docIDs.length
        for (let i = 0; i < docIDsLength; i++) {
          docs.add(docIDs[i])
        }
        output[w] = Array.from(docs)
      }
    }
  }

  if (index >= term.length) {
    return
  }

  // Match current character without consuming tolerance
  if (term[index] in node.c) {
    _findLevenshtein(node.c[term[index]], term, index + 1, tolerance, originalTolerance, output)
  }

  // If tolerance is still available, consider other branches:
  // 1. Deletion (skip the current term character)
  _findLevenshtein(node, term, index + 1, tolerance - 1, originalTolerance, output)

  // 2. Insertion (skip the current tree node character)
  for (const character in node.c) {
    _findLevenshtein(node.c[character], term, index, tolerance - 1, originalTolerance, output)
  }

  // 3. Substitution (skip both current term character and tree node character)
  for (const character in node.c) {
    if (character !== term[index]) {
      _findLevenshtein(node.c[character], term, index + 1, tolerance - 1, originalTolerance, output)
    }
  }
}

export function find(tree: RadixTree, { term, exact, tolerance }: FindParams): FindResult {
  let root = tree.node

  // Find the closest node to the term

  // Use `if` condition because tolerance `0` is supposed to match only prefix.
  // (allows infinite insertions at end, which is against normal levenshtein logic).
  // (new _findLevenshtein only handles not exact and tolerance>0 condition)
  if (tolerance && !exact) {
    const output: FindResult = {}
    tolerance = tolerance || 0

    _findLevenshtein(root, term, 0, tolerance || 0, tolerance, output)
    return output
  } else {
    const termLength = term.length
    for (let i = 0; i < termLength; i++) {
      const character = term[i]
      if (character in root.c) {
        const rootChildCurrentChar = root.c[character]
        const edgeLabel = rootChildCurrentChar.s
        const termSubstring = term.substring(i)

        // find the common prefix between two words ex: prime and primate = prim
        const commonPrefix = getCommonPrefix(edgeLabel, termSubstring)
        const commonPrefixLength = commonPrefix.length
        // if the common prefix length is equal to edgeLabel length (the node subword) it means they are a match
        // if the common prefix is equal to the term means it is contained in the node
        if (commonPrefixLength !== edgeLabel.length && commonPrefixLength !== termSubstring.length) {
          // if tolerance is set we take the current node as the closest
          if (tolerance) break
          return {}
        }

        // skip the subword length and check the next divergent character
        i += rootChildCurrentChar.s.length - 1
        // navigate into the child node
        root = rootChildCurrentChar
      } else {
        return {}
      }
    }

    const output: FindResult = {}
    // found the closest node we recursively search through children
    findAllWords(root, output, term, exact, tolerance)

    return output
  }
}

export function contains(root: Node, term: string): boolean {
  const termLength = term.length
  for (let i = 0; i < termLength; i++) {
    const character = term[i]

    if (character in root.c) {
      const rootChildrenChar = root.c[character]
      const edgeLabel = rootChildrenChar.s
      const termSubstring = term.substring(i)
      const commonPrefix = getCommonPrefix(edgeLabel, termSubstring)
      const commonPrefixLength = commonPrefix.length

      if (commonPrefixLength !== edgeLabel.length && commonPrefixLength !== termSubstring.length) {
        return false
      }
      i += rootChildrenChar.s.length - 1
      root = rootChildrenChar
    } else {
      return false
    }
  }
  return true
}

export function removeWord(root: Node, term: string): boolean {
  if (!term) {
    return false
  }

  const termLength = term.length
  for (let i = 0; i < termLength; i++) {
    const character = term[i]
    const parent = root
    if (character in root.c) {
      i += root.c[character].s.length - 1
      root = root.c[character]

      if (Object.keys(root.c).length === 0) {
        delete parent.c[root.k]
        return true
      }
    } else {
      return false
    }
  }

  return false
}

export function removeDocumentByWord(tree: RadixTree, term: string, docID: InternalDocumentID, exact = true): boolean {
  if (!term) {
    return true
  }
  let root = tree.node

  const termLength = term.length
  for (let i = 0; i < termLength; i++) {
    const character = term[i]
    if (character in root.c) {
      const rootChildCurrentChar = root.c[character]
      i += rootChildCurrentChar.s.length - 1
      root = rootChildCurrentChar

      if (exact && root.w !== term) {
        // Do nothing if the exact condition is not met.
      } else {
        removeDocument(root, docID)
      }
    } else {
      return false
    }
  }
  return true
}

interface RadixDump {
  type: typeof RadixType
  isArray: boolean
  node: Node
  tokenQuantums: Record<number, Record<string, number>>
  tokensLength: [number, number][]
}

export function load(dumpRaw: unknown): RadixTree {
  const dump = dumpRaw as RadixDump
  return {
    type: RadixType,
    isArray: dump.isArray,
    node: dump.node,
    tokenQuantums: dump.tokenQuantums,
    tokensLength: new Map(dump.tokensLength)
  }
}

export function save(node: RadixTree): unknown {
  const dump: RadixDump = {
    type: RadixType,
    isArray: node.isArray,
    node: node.node,
    tokenQuantums: node.tokenQuantums,
    tokensLength: Array.from(node.tokensLength)
  }
  return dump as unknown
}
