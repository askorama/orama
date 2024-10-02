import { syncBoundedLevenshtein } from '../components/levenshtein.js'
import { InternalDocumentID } from '../components/internal-document-id-store.js'
import { getOwnProperty } from '../utils.js'

interface FindParams {
  term: string
  exact?: boolean
  tolerance?: number
}

type FindResult = Record<string, InternalDocumentID[]>

class Node {
  // Node key
  public k: string
  // Node subword
  public s: string
  // Node children
  public c: Map<string, Node> = new Map()
  // Node documents
  public d: Set<InternalDocumentID> = new Set()
  // Node end
  public e: boolean
  // Node word
  public w = ''

  constructor(key: string, subWord: string, end: boolean) {
    this.k = key
    this.s = subWord
    this.e = end
  }

  public updateParent(parent: Node): void {
    this.w = parent.w + this.s
  }

  public addDocument(docID: InternalDocumentID): void {
    this.d.add(docID)
  }

  public removeDocument(docID: InternalDocumentID): boolean {
    return this.d.delete(docID)
  }

  public findAllWords(output: FindResult, term: string, exact?: boolean, tolerance?: number): FindResult {
    if (this.e) {
      const { w, d: docIDs } = this

      if (exact && w !== term) {
        return {}
      }

      if (getOwnProperty(output, w) == null) {
        if (tolerance) {
          const difference = Math.abs(term.length - w.length)

          if (difference <= tolerance && syncBoundedLevenshtein(term, w, tolerance).isBounded) {
            output[w] = []
          }
        } else {
          output[w] = []
        }
      }

      if (getOwnProperty(output, w) != null && docIDs.size > 0) {
        const docs = new Set(output[w])

        for (const docID of docIDs) {
          docs.add(docID)
        }
        output[w] = Array.from(docs)
      }
    }

    for (const [, childNode] of this.c) {
      childNode.findAllWords(output, term, exact, tolerance)
    }
    return output
  }

  public toJSON(): object {
    return {
      w: this.w,
      s: this.s,
      e: this.e,
      k: this.k,
      d: Array.from(this.d),
      c: Array.from(this.c.entries()).map(([key, node]) => [key, node.toJSON()])
    }
  }

  public static fromJSON(json: any): Node {
    const node = new Node(json.k, json.s, json.e)
    node.w = json.w
    node.d = new Set(json.d)
    node.c = new Map(json.c.map(([key, nodeJson]: [string, any]) => [key, Node.fromJSON(nodeJson)]))
    return node
  }
}

export class RadixTree {
  public root: Node

  constructor() {
    this.root = new Node('', '', false)
  }

  public insert(word: string, docId: InternalDocumentID) {
    let root = this.root
    const wordLength = word.length
    for (let i = 0; i < wordLength; i++) {
      const currentCharacter = word[i]
      const wordAtIndex = word.substring(i)
      const rootChildCurrentChar = root.c.get(currentCharacter)

      if (rootChildCurrentChar) {
        const edgeLabel = rootChildCurrentChar.s
        const edgeLabelLength = edgeLabel.length

        const commonPrefix = RadixTree.getCommonPrefix(edgeLabel, wordAtIndex)
        const commonPrefixLength = commonPrefix.length

        if (edgeLabel === wordAtIndex) {
          rootChildCurrentChar.addDocument(docId)
          rootChildCurrentChar.e = true
          return
        }

        const edgeLabelAtCommonPrefix = edgeLabel[commonPrefixLength]
        if (commonPrefixLength < edgeLabelLength && commonPrefixLength === wordAtIndex.length) {
          const newNode = new Node(currentCharacter, wordAtIndex, true)
          newNode.c.set(edgeLabelAtCommonPrefix, rootChildCurrentChar)

          const newNodeChild = newNode.c.get(edgeLabelAtCommonPrefix)!
          newNodeChild.s = edgeLabel.substring(commonPrefixLength)
          newNodeChild.k = edgeLabelAtCommonPrefix

          root.c.set(currentCharacter, newNode)

          newNode.updateParent(root)
          newNodeChild.updateParent(newNode)
          newNode.addDocument(docId)
          return
        }

        if (commonPrefixLength < edgeLabelLength && commonPrefixLength < wordAtIndex.length) {
          const inbetweenNode = new Node(currentCharacter, commonPrefix, false)
          inbetweenNode.c.set(edgeLabel[commonPrefixLength], rootChildCurrentChar)
          root.c.set(currentCharacter, inbetweenNode)

          const inbetweenNodeChild = inbetweenNode.c.get(edgeLabel[commonPrefixLength])!
          inbetweenNodeChild.s = edgeLabel.substring(commonPrefixLength)
          inbetweenNodeChild.k = edgeLabel[commonPrefixLength]

          const wordAtCommonPrefix = wordAtIndex[commonPrefixLength]
          const newNode = new Node(wordAtCommonPrefix, word.substring(i + commonPrefixLength), true)
          newNode.addDocument(docId)

          inbetweenNode.c.set(wordAtCommonPrefix, newNode)

          inbetweenNode.updateParent(root)
          newNode.updateParent(inbetweenNode)
          inbetweenNodeChild.updateParent(inbetweenNode)
          return
        }

        i += edgeLabelLength - 1
        root = rootChildCurrentChar
      } else {
        const newNode = new Node(currentCharacter, wordAtIndex, true)
        newNode.addDocument(docId)

        root.c.set(currentCharacter, newNode)
        newNode.updateParent(root)
        return
      }
    }
  }

  private _findLevenshtein(
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
      node.findAllWords(output, term, false, 0)
      return
    }

    if (node.e) {
      const { w, d: docIDs } = node
      if (w) {
        if (syncBoundedLevenshtein(term, w, originalTolerance).isBounded) {
          output[w] = []
        }
        if (getOwnProperty(output, w) != null && docIDs.size > 0) {
          const docs = new Set(output[w])

          for (const docID of docIDs) {
            docs.add(docID)
          }
          output[w] = Array.from(docs)
        }
      }
    }

    if (index >= term.length) {
      return
    }

    if (node.c.has(term[index])) {
      this._findLevenshtein(node.c.get(term[index])!, term, index + 1, tolerance, originalTolerance, output)
    }

    this._findLevenshtein(node, term, index + 1, tolerance - 1, originalTolerance, output)

    for (const [, childNode] of node.c) {
      this._findLevenshtein(childNode, term, index, tolerance - 1, originalTolerance, output)
    }

    for (const [character, childNode] of node.c) {
      if (character !== term[index]) {
        this._findLevenshtein(childNode, term, index + 1, tolerance - 1, originalTolerance, output)
      }
    }
  }

  public find({ term, exact, tolerance }: FindParams): FindResult {
    if (tolerance && !exact) {
      const output: FindResult = {}
      this._findLevenshtein(this.root, term, 0, tolerance, tolerance, output)
      return output
    } else {
      let root = this.root
      const termLength = term.length
      for (let i = 0; i < termLength; i++) {
        const character = term[i]
        if (root.c.has(character)) {
          const rootChildCurrentChar = root.c.get(character)!
          const edgeLabel = rootChildCurrentChar.s
          const termSubstring = term.substring(i)

          const commonPrefix = RadixTree.getCommonPrefix(edgeLabel, termSubstring)
          const commonPrefixLength = commonPrefix.length
          if (commonPrefixLength !== edgeLabel.length && commonPrefixLength !== termSubstring.length) {
            if (tolerance) break
            return {}
          }

          i += rootChildCurrentChar.s.length - 1
          root = rootChildCurrentChar
        } else {
          return {}
        }
      }

      const output: FindResult = {}
      root.findAllWords(output, term, exact, tolerance)
      return output
    }
  }

  public contains(term: string): boolean {
    let root = this.root
    const termLength = term.length
    for (let i = 0; i < termLength; i++) {
      const character = term[i]

      if (root.c.has(character)) {
        const rootChildCurrentChar = root.c.get(character)!
        const edgeLabel = rootChildCurrentChar.s
        const termSubstring = term.substring(i)
        const commonPrefix = RadixTree.getCommonPrefix(edgeLabel, termSubstring)
        const commonPrefixLength = commonPrefix.length

        if (commonPrefixLength !== edgeLabel.length && commonPrefixLength !== termSubstring.length) {
          return false
        }
        i += rootChildCurrentChar.s.length - 1
        root = rootChildCurrentChar
      } else {
        return false
      }
    }
    return true
  }

  public removeWord(term: string): boolean {
    if (!term) {
      return false
    }

    let root = this.root
    const termLength = term.length
    for (let i = 0; i < termLength; i++) {
      const character = term[i]
      const parent = root
      if (root.c.has(character)) {
        i += root.c.get(character)!.s.length - 1
        root = root.c.get(character)!

        if (root.c.size === 0) {
          parent.c.delete(root.k)
          return true
        }
      } else {
        return false
      }
    }

    return false
  }

  public removeDocumentByWord(term: string, docID: InternalDocumentID, exact = true): boolean {
    if (!term) {
      return true
    }

    let root = this.root
    const termLength = term.length
    for (let i = 0; i < termLength; i++) {
      const character = term[i]
      if (root.c.has(character)) {
        const rootChildCurrentChar = root.c.get(character)!
        i += rootChildCurrentChar.s.length - 1
        root = rootChildCurrentChar

        if (exact && root.w !== term) {
          // Do nothing if the exact condition is not met.
        } else {
          root.removeDocument(docID)
        }
      } else {
        return false
      }
    }
    return true
  }

  public toJSON(): object {
    return {
      root: this.root.toJSON()
    }
  }

  public static fromJSON(json: any): RadixTree {
    const tree = new RadixTree()
    tree.root = Node.fromJSON(json.root)
    return tree
  }

  private static getCommonPrefix(a: string, b: string): string {
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
}
