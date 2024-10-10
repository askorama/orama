import { Nullable } from '../types.js'

export class ZipNode<V = unknown> {
  // Node key
  k: number
  // Node value
  v: V
  // Node rank
  n: number
  // Left child
  l: Nullable<ZipNode<V>>
  // Right child
  r: Nullable<ZipNode<V>>
  // Parent node
  p: Nullable<ZipNode<V>>

  constructor(key: number, value: V, rank: number) {
    this.k = key
    this.v = value
    this.n = rank
    this.l = null
    this.r = null
    this.p = null
  }
}

export class ZipTree<V = unknown> {
  root: Nullable<ZipNode<V>>

  constructor() {
    this.root = null
  }

  private randomRank(): number {
    const r = Math.random()
    return Math.floor(Math.log(1 - r) / Math.log(1 - 0.5))
  }

  insert(key: number, value: V): void {
    const newNode = new ZipNode<V>(key, value, this.randomRank())
    if (!this.root) {
      this.root = newNode
      return
    }

    let currentNode: Nullable<ZipNode<V>> = this.root
    let parent: Nullable<ZipNode<V>> = null

    while (currentNode != null) {
      parent = currentNode
      if (key < currentNode.k) {
        currentNode = currentNode.l
      } else if (key > currentNode.k) {
        currentNode = currentNode.r
      } else {
        currentNode.v = value
        return
      }
    }

    newNode.p = parent
    if (parent != null) {
      if (key < parent.k) {
        parent.l = newNode
      } else {
        parent.r = newNode
      }
    }

    // Bubble up the new node to maintain heap property
    this.bubbleUp(newNode)
  }

  private bubbleUp(node: ZipNode<V>): void {
    while (node.p != null && node.p.n < node.n) {
      if (node === node.p.l) {
        this.rotateRight(node.p)
      } else {
        this.rotateLeft(node.p)
      }
    }

    if (node.p == null) {
      this.root = node
    }
  }

  private rotateLeft(node: ZipNode<V>): void {
    const r = node.r!
    node.r = r.l
    if (r.l != null) {
      r.l.p = node
    }
    r.l = node
    r.p = node.p
    if (node.p == null) {
      this.root = r
    } else if (node === node.p.l) {
      node.p.l = r
    } else {
      node.p.r = r
    }
    node.p = r
  }

  private rotateRight(node: ZipNode<V>): void {
    const l = node.l!
    node.l = l.r
    if (l.r != null) {
      l.r.p = node
    }
    l.r = node
    l.p = node.p
    if (node.p == null) {
      this.root = l
    } else if (node === node.p.l) {
      node.p.l = l
    } else {
      node.p.r = l
    }
    node.p = l
  }

  remove(key: number): void {
    const node = this.getNodeByKey(key)
    if (node == null) {
      return
    }
    this.removeNode(node)
  }

  private removeNode(node: ZipNode<V>): void {
    while (node.l != null || node.r != null) {
      if (node.l == null) {
        this.rotateLeft(node)
      } else if (node.r == null) {
        this.rotateRight(node)
      } else if (node.l.n > node.r.n) {
        this.rotateRight(node)
      } else {
        this.rotateLeft(node)
      }
    }

    if (node.p != null) {
      if (node === node.p.l) {
        node.p.l = null
      } else {
        node.p.r = null
      }
    } else {
      this.root = null
    }
  }

  find(key: number): Nullable<V> {
    const node = this.getNodeByKey(key)
    return node ? node.v : null
  }

  contains(key: number): boolean {
    return this.getNodeByKey(key) != null
  }

  private getNodeByKey(key: number): Nullable<ZipNode<V>> {
    let currentNode: Nullable<ZipNode<V>> = this.root

    while (currentNode !== null) {
      if (currentNode.k === key) {
        return currentNode
      }
      currentNode = key < currentNode.k ? currentNode.l : currentNode.r
    }

    return null
  }

  rangeSearch(min: number, max: number): V[] {
    const results: V[] = []
    this.inOrderTraversal(this.root, (node) => {
      if (node.k >= min && node.k <= max) {
        results.push(node.v)
      }
    })
    return results
  }

  greaterThan(key: number): V[] {
    const results: V[] = []
    this.inOrderTraversal(this.root, (node) => {
      if (node.k > key) {
        results.push(node.v)
      }
    })
    return results
  }

  lessThan(key: number): V[] {
    const results: V[] = []
    this.inOrderTraversal(this.root, (node) => {
      if (node.k < key) {
        results.push(node.v)
      }
    })
    return results
  }

  getSize(): number {
    let count = 0
    this.inOrderTraversal(this.root, () => {
      count++
    })
    return count
  }

  private inOrderTraversal(node: Nullable<ZipNode<V>>, callback: (node: ZipNode<V>) => void): void {
    if (node == null) {
      return
    }
    this.inOrderTraversal(node.l, callback)
    callback(node)
    this.inOrderTraversal(node.r, callback)
  }

  removeDocument(id: V, key: number): void {
    const node = this.getNodeByKey(key)

    if (node == null) return

    if (Array.isArray(node.v)) {
      const index = node.v.indexOf(id)
      if (index !== -1) {
        node.v.splice(index, 1)
        if (node.v.length === 0) {
          this.remove(key)
        }
      }
    } else {
      if (node.v === id) {
        this.remove(key)
      }
    }
  }

  toJSON(): any {
    return {
      root: this.nodeToJSON(this.root)
    }
  }

  private nodeToJSON(node: Nullable<ZipNode<V>>): any {
    if (node == null) {
      return null
    }
    return {
      k: node.k,
      v: node.v,
      n: node.n,
      l: this.nodeToJSON(node.l),
      r: this.nodeToJSON(node.r)
    }
  }

  static fromJSON<V>(json: any): ZipTree<V> {
    const tree = new ZipTree<V>()
    tree.root = tree.nodeFromJSON(json.root, null)
    return tree
  }

  private nodeFromJSON(jsonNode: any, parent: Nullable<ZipNode<V>>): Nullable<ZipNode<V>> {
    if (jsonNode == null) {
      return null
    }
    const node = new ZipNode<V>(jsonNode.k, jsonNode.v, jsonNode.n)
    node.p = parent
    node.l = this.nodeFromJSON(jsonNode.l, node)
    node.r = this.nodeFromJSON(jsonNode.r, node)
    return node
  }
}
