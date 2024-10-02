import { Nullable } from '../types.js'
interface Node<V = unknown> {
  l: Nullable<Node<V>>
  r: Nullable<Node<V>>
  p: Nullable<Node<V>>
  k: number
  v: V
  n: number
}
export declare function create<V>(key: number, value: V): Node<V>
export declare function insert<V>(root: Node<V>, key: number, value: V): void
export declare function remove<V>(root: Nullable<Node<V>>, key: number): Nullable<Node<V>>
export declare function find<V>(root: Nullable<Node<V>>, key: number): Nullable<V>
export declare function contains<V>(root: Nullable<Node<V>>, key: number): boolean
export declare function rangeSearch<V>(root: Nullable<Node<V>>, min: number, max: number): V[]
export declare function greaterThan<V>(root: Nullable<Node<V>>, key: number): V[]
export declare function lessThan<V>(root: Nullable<Node<V>>, key: number): V[]
export declare function getSize<V>(root: Nullable<Node<V>>): number
export declare function removeDocument<V>(root: Node<V[]>, id: V, key: number): void
export {}
