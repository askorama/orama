/* eslint-disable @typescript-eslint/no-this-alias */
import { syncBoundedLevenshtein } from '../components/levenshtein.js'
import { InternalDocumentID } from '../components/internal-document-id-store.js'
import { getOwnProperty } from '../utils.js'

interface FindParams {
  term: string
  exact?: boolean
  tolerance?: number
}

type FindResult = Record<string, InternalDocumentID[]>

export class RadixNode {
  public k: string
  public s: string
  public c: Map<string, RadixNode> = new Map()
  public d: Set<InternalDocumentID> = new Set()
  public e: boolean
  public w = ''

  constructor(key: string, subWord: string, end: boolean) {
    this.k = key
    this.s = subWord
    this.e = end
  }

  public updateParent(parent: RadixNode): void {
    this.w = parent.w + this.s
  }

  public addDocument(docID: InternalDocumentID): void {
    this.d.add(docID)
  }

  public removeDocument(docID: InternalDocumentID): boolean {
    return this.d.delete(docID)
  }

  public findAllWords(
    output: FindResult,
    term: string,
    exact?: boolean,
    tolerance?: number
  ): FindResult {
    if (this.e) {
      const { w, d: docIDs } = this

      if (exact && w !== term) {
        return {}
      }

      if (getOwnProperty(output, w) == null) {
        if (tolerance) {
          const difference = Math.abs(term.length - w.length)

          if (
            difference <= tolerance &&
            syncBoundedLevenshtein(term, w, tolerance).isBounded
          ) {
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

  public insert(word: string, docId: InternalDocumentID): void {
    let node: RadixNode = this
    const wordLength = word.length
    for (let i = 0; i < wordLength; i++) {
      const currentCharacter = word[i]
      const wordAtIndex = word.substring(i)
      const childNode = node.c.get(currentCharacter)

      if (childNode) {
        const edgeLabel = childNode.s
        const edgeLabelLength = edgeLabel.length

        const commonPrefix = RadixNode.getCommonPrefix(edgeLabel, wordAtIndex)
        const commonPrefixLength = commonPrefix.length

        if (edgeLabel === wordAtIndex) {
          childNode.addDocument(docId)
          childNode.e = true
          return
        }

        const edgeLabelAtCommonPrefix = edgeLabel[commonPrefixLength]
        if (
          commonPrefixLength < edgeLabelLength &&
          commonPrefixLength === wordAtIndex.length
        ) {
          const newNode = new RadixNode(currentCharacter, wordAtIndex, true)
          newNode.c.set(edgeLabelAtCommonPrefix, childNode)

          const newNodeChild = newNode.c.get(edgeLabelAtCommonPrefix)!
          newNodeChild.s = edgeLabel.substring(commonPrefixLength)
          newNodeChild.k = edgeLabelAtCommonPrefix

          node.c.set(currentCharacter, newNode)

          newNode.updateParent(node)
          newNodeChild.updateParent(newNode)
          newNode.addDocument(docId)
          return
        }

        if (
          commonPrefixLength < edgeLabelLength &&
          commonPrefixLength < wordAtIndex.length
        ) {
          const inbetweenNode = new RadixNode(currentCharacter, commonPrefix, false)
          inbetweenNode.c.set(edgeLabel[commonPrefixLength], childNode)
          node.c.set(currentCharacter, inbetweenNode)

          const inbetweenNodeChild = inbetweenNode.c.get(edgeLabel[commonPrefixLength])!
          inbetweenNodeChild.s = edgeLabel.substring(commonPrefixLength)
          inbetweenNodeChild.k = edgeLabel[commonPrefixLength]

          const wordAtCommonPrefix = wordAtIndex[commonPrefixLength]
          const newNode = new RadixNode(
            wordAtCommonPrefix,
            word.substring(i + commonPrefixLength),
            true
          )
          newNode.addDocument(docId)

          inbetweenNode.c.set(wordAtCommonPrefix, newNode)

          inbetweenNode.updateParent(node)
          newNode.updateParent(inbetweenNode)
          inbetweenNodeChild.updateParent(inbetweenNode)
          return
        }

        i += edgeLabelLength - 1
        node = childNode
      } else {
        const newNode = new RadixNode(currentCharacter, wordAtIndex, true)
        newNode.addDocument(docId)

        node.c.set(currentCharacter, newNode)
        newNode.updateParent(node)
        return
      }
    }
  }

  private _findLevenshtein(
    term: string,
    index: number,
    tolerance: number,
    originalTolerance: number,
    output: FindResult
  ) {
    if (tolerance < 0) {
      return
    }

    if (this.w.startsWith(term)) {
      this.findAllWords(output, term, false, 0)
      return
    }

    if (this.e) {
      const { w, d: docIDs } = this
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

    if (this.c.has(term[index])) {
      this.c
        .get(term[index])!
        ._findLevenshtein(term, index + 1, tolerance, originalTolerance, output)
    }

    this._findLevenshtein(term, index + 1, tolerance - 1, originalTolerance, output)

    for (const [, childNode] of this.c) {
      childNode._findLevenshtein(term, index, tolerance - 1, originalTolerance, output)
    }

    for (const [character, childNode] of this.c) {
      if (character !== term[index]) {
        childNode._findLevenshtein(
          term,
          index + 1,
          tolerance - 1,
          originalTolerance,
          output
        )
      }
    }
  }

  public find(params: FindParams): FindResult {
    const { term, exact, tolerance } = params
    if (tolerance && !exact) {
      const output: FindResult = {}
      this._findLevenshtein(term, 0, tolerance, tolerance, output)
      return output
    } else {
      let node: RadixNode = this
      const termLength = term.length
      for (let i = 0; i < termLength; i++) {
        const character = term[i]
        if (node.c.has(character)) {
          const childNode = node.c.get(character)!
          const edgeLabel = childNode.s
          const termSubstring = term.substring(i)

          const commonPrefix = RadixNode.getCommonPrefix(edgeLabel, termSubstring)
          const commonPrefixLength = commonPrefix.length
          if (
            commonPrefixLength !== edgeLabel.length &&
            commonPrefixLength !== termSubstring.length
          ) {
            if (tolerance) break
            return {}
          }

          i += childNode.s.length - 1
          node = childNode
        } else {
          return {}
        }
      }

      const output: FindResult = {}
      node.findAllWords(output, term, exact, tolerance)
      return output
    }
  }

  public contains(term: string): boolean {
    let node: RadixNode = this
    const termLength = term.length
    for (let i = 0; i < termLength; i++) {
      const character = term[i]

      if (node.c.has(character)) {
        const childNode = node.c.get(character)!
        const edgeLabel = childNode.s
        const termSubstring = term.substring(i)
        const commonPrefix = RadixNode.getCommonPrefix(edgeLabel, termSubstring)
        const commonPrefixLength = commonPrefix.length

        if (
          commonPrefixLength !== edgeLabel.length &&
          commonPrefixLength !== termSubstring.length
        ) {
          return false
        }
        i += childNode.s.length - 1
        node = childNode
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

    let node: RadixNode = this
    const termLength = term.length
    const stack: { parent: RadixNode; character: string }[] = []
    for (let i = 0; i < termLength; i++) {
      const character = term[i]
      if (node.c.has(character)) {
        const childNode = node.c.get(character)!
        stack.push({ parent: node, character })
        i += childNode.s.length - 1
        node = childNode
      } else {
        return false
      }
    }

    // Remove documents from the node
    node.d.clear()
    node.e = false

    // Clean up any nodes that no longer lead to a word
    while (stack.length > 0 && node.c.size === 0 && !node.e && node.d.size === 0) {
      const { parent, character } = stack.pop()!
      parent.c.delete(character)
      node = parent
    }

    return true
  }

  public removeDocumentByWord(
    term: string,
    docID: InternalDocumentID,
    exact = true
  ): boolean {
    if (!term) {
      return true
    }

    let node: RadixNode = this
    const termLength = term.length
    for (let i = 0; i < termLength; i++) {
      const character = term[i]
      if (node.c.has(character)) {
        const childNode = node.c.get(character)!
        i += childNode.s.length - 1
        node = childNode

        if (exact && node.w !== term) {
          // Do nothing if the exact condition is not met.
        } else {
          node.removeDocument(docID)
        }
      } else {
        return false
      }
    }
    return true
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

  public static fromJSON(json: any): RadixNode {
    const node = new RadixNode(json.k, json.s, json.e)
    node.w = json.w
    node.d = new Set(json.d)
    node.c = new Map(
      json.c.map(([key, nodeJson]: [string, any]) => [key, RadixNode.fromJSON(nodeJson)])
    )
    return node
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

export class RadixTree extends RadixNode {
  constructor() {
    super('', '', false)
  }

  public static fromJSON(json: any): RadixTree {
    const tree = new RadixTree()
    tree.w = json.w
    tree.s = json.s
    tree.e = json.e
    tree.k = json.k
    tree.d = new Set(json.d)
    tree.c = new Map(
      json.c.map(([key, nodeJson]: [string, any]) => [key, RadixNode.fromJSON(nodeJson)])
    )
    return tree
  }

  public toJSON(): object {
    return super.toJSON()
  }
}
