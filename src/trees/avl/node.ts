export type AVLNode<T> = {
  value: T;
  left: AVLNode<T> | null;
  right: AVLNode<T> | null;
  height: number;
};

export function createAVLNode<T>(value: T): AVLNode<T> {
  return {
    value,
    left: null,
    right: null,
    height: 0,
  };
}
