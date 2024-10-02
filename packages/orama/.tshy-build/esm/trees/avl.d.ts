import { Nullable } from '../types.js'
export interface Node<K, V> {
  k: K
  v: V
  l: Nullable<Node<K, V>>
  r: Nullable<Node<K, V>>
  h: number
}
export interface RootNode<K, V> {
  root: Node<K, V>
}
export declare function contains<K, V>(node: RootNode<K, V>, key: K): boolean
export declare function getSize<K, V>(root: Nullable<RootNode<K, V>>): number
export declare function isBalanced<K, V>(root: Nullable<RootNode<K, V>>): boolean
export declare function rangeSearch<K, V>(node: RootNode<K, V>, min: K, max: K): V
export declare function greaterThan<K, V>(node: RootNode<K, V>, key: K, inclusive?: boolean): V
export declare function lessThan<K, V>(node: RootNode<K, V>, key: K, inclusive?: boolean): V
export declare function create<K, V>(key: K, value: V): RootNode<K, V>
export declare function insert<K, V>(
  rootNode: RootNode<K, V[]>,
  key: K,
  newValue: V[],
  rebalanceThreshold?: number
): void
export declare function find<K, V>(root: RootNode<K, V>, key: K): Nullable<V>
export declare function remove<K, V>(rootNode: Nullable<RootNode<K, V>>, key: K): void
export declare function removeDocument<K, V>(root: RootNode<K, V[]>, id: V, key: K): void
