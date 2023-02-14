export type AVLNode<K, V> = {
  key: K,
  value: V;
  left: AVLNode<K, V> | null;
  right: AVLNode<K, V> | null;
  height: number;
};

export function createAVLNode<K, V>(key: K, value: V): AVLNode<K, V> {
  return {
    key,
    value,
    left: null,
    right: null,
    height: 0,
  };
}
