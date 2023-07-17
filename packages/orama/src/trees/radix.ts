import { syncBoundedLevenshtein } from '../components/levenshtein.js';
import { getOwnProperty } from '../utils.js';

export class Node {
  constructor(
    key: string,
    subWord: string,
    end: boolean,
  ) {
    this.key = key
    this.subWord = subWord
    this.end = end
  }

  public key: string
  public subWord: string
  public children: Record<string, Node> = {}
  public docs: string[] = []
  public end: boolean
  public word = ''

  public toJSON(): object {
    return {
      word: this.word,
      subWord: this.subWord,
      children: this.children,
      docs: this.docs,
      end: this.end
    }
  }
}

type FindParams = {
  term: string
  exact?: boolean
  tolerance?: number
}

type FindResult = Record<string, string[]>

function updateParent(node: Node, parent: Node): void {
  node.word = parent.word + node.subWord
}

function addDocument(node: Node, docID: string): void {
  node.docs.push(docID)
}

function removeDocument(node: Node, docID: string): boolean {
  const index = node.docs.indexOf(docID)

  /* c8 ignore next 3 */
  if (index === -1) {
    return false
  }

  node.docs.splice(index, 1)

  return true
}

function findAllWords(node: Node, output: FindResult, term: string, exact?: boolean, tolerance?: number) {
  if (node.end) {
    const { word, docs: docIDs } = node

    if (exact && word !== term) {
      return {}
    }

    // always check in own property to prevent access to inherited properties
    // fix https://github.com/OramaSearch/orama/issues/137
    if (!getOwnProperty(output, word)) {
      if (tolerance) {
        // computing the absolute difference of letters between the term and the word
        const difference = Math.abs(term.length - word.length)

        // if the tolerance is set, check whether the edit distance is within tolerance.
        // In that case, we don't need to add the word to the output
        if (difference <= tolerance && syncBoundedLevenshtein(term, word, tolerance).isBounded) {
          output[word] = []
        }
      } else {
        // prevent default tolerance not set
        output[word] = []
      }
    }

    // check if _output[word] exists and then add the doc to it
    // always check in own property to prevent access to inherited properties
    // fix https://github.com/OramaSearch/orama/issues/137
    if (getOwnProperty(output, word) && docIDs.length) {
      const docs = new Set(output[word])

      const docIDsLength = docIDs.length
      for (let i = 0; i < docIDsLength; i++) {
        docs.add(docIDs[i])
      }
      output[word] = Array.from(docs)
    }
  }

  // recursively search the children
  for (const character of Object.keys(node.children)) {
    findAllWords(node.children[character], output, term, exact, tolerance)
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

export function create(end = false, subWord = '', key = ''): Node {
  return new Node(key, subWord, end)
}

export function insert(root: Node, word: string, docId: string) {
  for (let i = 0; i < word.length; i++) {
    const currentCharacter = word[i]
    const wordAtIndex = word.substring(i)
    const rootChildCurrentChar = root.children[currentCharacter]

    if (rootChildCurrentChar) {
      const edgeLabel = rootChildCurrentChar.subWord
      const edgeLabelLength = edgeLabel.length

      const commonPrefix = getCommonPrefix(edgeLabel, wordAtIndex)
      const commonPrefixLength = commonPrefix.length

      // the wordAtIndex matches exactly with an existing child node
      if (edgeLabel === wordAtIndex) {
        addDocument(rootChildCurrentChar, docId)
        rootChildCurrentChar.end = true
        return
      }

      const edgeLabelAtCommonPrefix = edgeLabel[commonPrefixLength]
      // the wordAtIndex is completely contained in the child node subword
      if (commonPrefixLength < edgeLabelLength && commonPrefixLength === wordAtIndex.length) {
        const newNode = create(true, wordAtIndex, currentCharacter) // Create a new node with end set to true
        newNode.children[edgeLabelAtCommonPrefix] = rootChildCurrentChar

        const newNodeChild = newNode.children[edgeLabelAtCommonPrefix]
        newNodeChild.subWord = edgeLabel.substring(commonPrefixLength)
        newNodeChild.key = edgeLabelAtCommonPrefix

        root.children[currentCharacter] = newNode

        updateParent(newNode, root)
        updateParent(newNodeChild, newNode)
        addDocument(newNode, docId)
        return
      }

      // the wordAtIndex is partially contained in the child node subword
      if (commonPrefixLength < edgeLabelLength && commonPrefixLength < wordAtIndex.length) {
        const inbetweenNode = create(false, commonPrefix, currentCharacter)
        inbetweenNode.children[edgeLabelAtCommonPrefix] = rootChildCurrentChar
        root.children[currentCharacter] = inbetweenNode

        const inbetweenNodeChild = inbetweenNode.children[edgeLabelAtCommonPrefix]
        inbetweenNodeChild.subWord = edgeLabel.substring(commonPrefixLength)
        inbetweenNodeChild.key = edgeLabelAtCommonPrefix

        const wordAtCommonPrefix = wordAtIndex[commonPrefixLength]
        const newNode = create(true, word.substring(i + commonPrefixLength), wordAtCommonPrefix)
        addDocument(newNode, docId)

        inbetweenNode.children[wordAtCommonPrefix] = newNode

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
      const newNode = create(true, wordAtIndex, currentCharacter)
      addDocument(newNode, docId)

      root.children[currentCharacter] = newNode
      updateParent(newNode, root)
      return
    }
  }
}

export function find(root: Node, { term, exact, tolerance }: FindParams): FindResult {
  // find the closest node to the term
  for (let i = 0; i < term.length; i++) {
    const character = term[i]
    if (character in root.children) {
      const rootChildCurrentChar = root.children[character]
      const edgeLabel = rootChildCurrentChar.subWord
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
      i += rootChildCurrentChar.subWord.length - 1
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

export function contains(root: Node, term: string): boolean {
  for (let i = 0; i < term.length; i++) {
    const character = term[i]

    if (character in root.children) {
      const rootChildrenChar = root.children[character]
      const edgeLabel = rootChildrenChar.subWord
      const termSubstring = term.substring(i)
      const commonPrefix = getCommonPrefix(edgeLabel, termSubstring)
      const commonPrefixLength = commonPrefix.length

      if (commonPrefixLength !== edgeLabel.length && commonPrefixLength !== termSubstring.length) {
        return false
      }
      i += rootChildrenChar.subWord.length - 1
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

  for (let i = 0; i < term.length; i++) {
    const character = term[i]
    const parent = root
    if (character in root.children) {
      i += root.children[character].subWord.length - 1
      root = root.children[character]

      if (Object.keys(root.children).length === 0) {
        delete parent.children[root.key]
        return true
      }
    } else {
      return false
    }
  }

  return false
}

export function removeDocumentByWord(root: Node, term: string, docID: string, exact = true): boolean {
  if (!term) {
    return true
  }

  for (let i = 0; i < term.length; i++) {
    const character = term[i]
    if (character in root.children) {
      const rootChildCurrentChar = root.children[character]
      i += rootChildCurrentChar.subWord.length - 1
      root = rootChildCurrentChar

      if (exact && root.word !== term) {
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
