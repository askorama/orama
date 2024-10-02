/* eslint-disable @typescript-eslint/no-this-alias */
import { Nullable } from '../types.js'

export class AVLNode<K, V> {
  public k: K
  public v: V
  public l: Nullable<AVLNode<K, V>> = null
  public r: Nullable<AVLNode<K, V>> = null
  public h: number = 1

  constructor(key: K, value: V) {
    this.k = key
    this.v = value
  }

  public updateHeight(): void {
    this.h = Math.max(AVLNode.getHeight(this.l), AVLNode.getHeight(this.r)) + 1
  }

  public static getHeight<K, V>(node: Nullable<AVLNode<K, V>>): number {
    return node ? node.h : 0
  }

  public getBalanceFactor(): number {
    return AVLNode.getHeight(this.l) - AVLNode.getHeight(this.r)
  }

  public rotateLeft(): AVLNode<K, V> {
    const newRoot = this.r as AVLNode<K, V>
    this.r = newRoot.l
    newRoot.l = this
    this.updateHeight()
    newRoot.updateHeight()
    return newRoot
  }

  public rotateRight(): AVLNode<K, V> {
    const newRoot = this.l as AVLNode<K, V>
    this.l = newRoot.r
    newRoot.r = this
    this.updateHeight()
    newRoot.updateHeight()
    return newRoot
  }

  public toJSON(): object {
    return {
      k: this.k,
      v: this.v,
      l: this.l ? this.l.toJSON() : null,
      r: this.r ? this.r.toJSON() : null,
      h: this.h,
    }
  }

  public static fromJSON<K, V>(json: any): AVLNode<K, V> {
    const node = new AVLNode<K, V>(json.k, json.v)
    node.l = json.l ? AVLNode.fromJSON<K, V>(json.l) : null
    node.r = json.r ? AVLNode.fromJSON<K, V>(json.r) : null
    node.h = json.h
    return node
  }
}

export class AVLTree<K, V> {
  public root: Nullable<AVLNode<K, V>> = null
  private insertCount = 0

  constructor(key?: K, value?: V) {
    if (key !== undefined && value !== undefined) {
      this.root = new AVLNode(key, value)
    }
  }

  public insert(key: K, value: V, rebalanceThreshold = 1000): void {
    this.root = this.insertNode(this.root, key, value, rebalanceThreshold)
  }

  // Rebalance the tree if the insert count reaches the threshold.
  // This will improve insertion performance since we won't be rebalancing the tree on every insert.
  // When inserting docs using `insertMultiple`, the threshold will be set to the number of docs being inserted.
  // We can force rebalancing the tree by setting the threshold to 1 (default).
  public rebalance() {
    if (this.root) {
      this.root = this.rebalanceNode(this.root!)
    }
  }

  public toJSON(): object {
    return {
      root: this.root ? this.root.toJSON() : null,
      insertCount: this.insertCount,
    }
  }

  public static fromJSON<K, V>(json: any): AVLTree<K, V> {
    const tree = new AVLTree<K, V>()
    tree.root = json.root ? AVLNode.fromJSON<K, V>(json.root) : null
    tree.insertCount = json.insertCount || 0
    return tree
  }

  private insertNode(node: Nullable<AVLNode<K, V>>, key: K, value: V, rebalanceThreshold: number): AVLNode<K, V> {
    if (node === null) {
      return new AVLNode(key, value)
    }

    if (key < node.k) {
      node.l = this.insertNode(node.l, key, value, rebalanceThreshold)
    } else if (key > node.k) {
      node.r = this.insertNode(node.r, key, value, rebalanceThreshold)
    } else {
      if (Array.isArray(node.v)) {
        if (Array.isArray(value)) {
          (node.v as any[]).push(...value as V[])
        } else {
          (node.v as any[]).push(value)
        }
      } else {
        node.v = value
      }
      return node
    }

    node.updateHeight()

    if (this.insertCount++ % rebalanceThreshold === 0) {
      return this.rebalanceNode(node)
    }

    return node
  }

  private rebalanceNode(node: AVLNode<K, V>): AVLNode<K, V> {
    const balanceFactor = node.getBalanceFactor()

    if (balanceFactor > 1) {
      // Left heavy
      if (node.l && node.l.getBalanceFactor() >= 0) {
        // Left Left Case
        return node.rotateRight()
      } else if (node.l) {
        // Left Right Case
        node.l = node.l.rotateLeft()
        return node.rotateRight()
      }
    }

    if (balanceFactor < -1) {
      // Right heavy
      if (node.r && node.r.getBalanceFactor() <= 0) {
        // Right Right Case
        return node.rotateLeft()
      } else if (node.r) {
        // Right Left Case
        node.r = node.r.rotateRight()
        return node.rotateLeft()
      }
    }

    return node
  }

  public find(key: K): Nullable<V> {
    const node = this.findNodeByKey(key)
    return node ? node.v : null
  }

  public contains(key: K): boolean {
    return this.find(key) !== null
  }

  public getSize(): number {
    const countNodes = (node: Nullable<AVLNode<K, V>>): number => {
      if (!node) return 0
      return 1 + countNodes(node.l) + countNodes(node.r)
    }
    return countNodes(this.root)
  }

  public isBalanced(): boolean {
    const checkBalanced = (node: Nullable<AVLNode<K, V>>): boolean => {
      if (!node) return true

      const balanceFactor = node.getBalanceFactor()
      if (Math.abs(balanceFactor) > 1) {
        return false
      }

      return checkBalanced(node.l) && checkBalanced(node.r)
    }
    return checkBalanced(this.root)
  }

  public remove(key: K): void {
    this.root = this.removeNode(this.root, key)
  }

  public removeDocument(key: K, id: V) {
    const node = this.findNodeByKey(key)

    if (!node) {
      return
    }

    if ((node.v as unknown as Set<V>).size === 1) {
      this.removeNode(node, key)
    }
   
    (node.v as unknown as Set<V>) = new Set([...(node.v as unknown as Set<V>).values()].filter((v) => v !== id))
  }

  private findNodeByKey(key: K): Nullable<AVLNode<K, V>> {
    let node = this.root
    while (node) {
      if (key < node.k) {
        node = node.l
      } else if (key > node.k) {
        node = node.r
      } else {
        return node
      }
    }
    return null
  }

  private removeNode(node: Nullable<AVLNode<K, V>>, key: K): Nullable<AVLNode<K, V>> {
    if (!node) return null

    if (key < node.k) {
      node.l = this.removeNode(node.l, key)
    } else if (key > node.k) {
      node.r = this.removeNode(node.r, key)
    } else {
      if (!node.l || !node.r) {
        node = node.l || node.r
      } else {
        const minLargerNode = this.findMinNode(node.r)
        node.k = minLargerNode.k
        node.v = minLargerNode.v
        node.r = this.removeNode(node.r, minLargerNode.k)
      }
    }

    if (!node) return null

    node.updateHeight()
    return this.rebalanceNode(node)
  }

  private findMinNode(node: AVLNode<K, V>): AVLNode<K, V> {
    while (node.l) {
      node = node.l
    }
    return node
  }

  public rangeSearch(min: K, max: K): V[] {
    const result: V[] = []
    const traverse = (node: Nullable<AVLNode<K, V>>) => {
      if (!node) return
      if (min < node.k) traverse(node.l)
      if (node.k >= min && node.k <= max) {
        if (Array.isArray(node.v)) {
          result.push(...node.v)
        } else {
          result.push(node.v)
        }
      }
      if (max > node.k) traverse(node.r)
    }
    traverse(this.root)
    return result
  }

  public greaterThan(key: K, inclusive = false): V[] {
    const result: V[] = []
    const traverse = (node: Nullable<AVLNode<K, V>>) => {
      if (!node) return
      if ((inclusive && node.k >= key) || (!inclusive && node.k > key)) {
        if (Array.isArray(node.v)) {
          result.push(...node.v)
        } else {
          result.push(node.v)
        }
        traverse(node.l)
        traverse(node.r)
      } else {
        traverse(node.r)
      }
    }
    traverse(this.root)
    return result
  }

  public lessThan(key: K, inclusive = false): V[] {
    const result: V[] = []
    const traverse = (node: Nullable<AVLNode<K, V>>) => {
      if (!node) return
      if ((inclusive && node.k <= key) || (!inclusive && node.k < key)) {
        if (Array.isArray(node.v)) {
          result.push(...node.v)
        } else {
          result.push(node.v)
        }
        traverse(node.l)
        traverse(node.r)
      } else {
        traverse(node.l)
      }
    }
    traverse(this.root)
    return result
  }
}
