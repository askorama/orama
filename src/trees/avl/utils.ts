import type { AVLNode } from './node.js';

export const BALANCE_STATE = {
  UNBALANCED_RIGHT: 1,
  SLIGHTLY_UNBALANCED_RIGHT: 2,
  BALANCED: 3,
  SLIGHTLY_UNBALANCED_LEFT: 4,
  UNBALANCED_LEFT: 5,
};

export function getBalanceFactor<K, V>(node: AVLNode<K, V>): number {
  const heightDifference = getHeight(node.left) - getHeight(node.right);

  switch (heightDifference) {
    case -2:
      return BALANCE_STATE.UNBALANCED_RIGHT;
    case -1:
      return BALANCE_STATE.SLIGHTLY_UNBALANCED_RIGHT;
    case 1:
      return BALANCE_STATE.SLIGHTLY_UNBALANCED_LEFT;
    case 2:
      return BALANCE_STATE.UNBALANCED_LEFT;
    default:
      return BALANCE_STATE.BALANCED;
  }
}

export function getHeight<K, V>(node: AVLNode<K, V> | null): number {
  return node ? node.height : -1;
}

export function rotateLeft<K, V>(node: AVLNode<K, V>): AVLNode<K, V> {
  const right = node.right as AVLNode<K, V>;
  node.right = right.left;
  right.left = node;
  node.height = Math.max(getHeight(node.left), getHeight(node.right)) + 1;
  right.height = Math.max(getHeight(right.left), getHeight(right.right)) + 1;
  return right;
}

export function rotateRight<K, V>(node: AVLNode<K, V>): AVLNode<K, V> {
  const left = node.left as AVLNode<K, V>;
  node.left = left.right;
  left.right = node;
  node.height = Math.max(getHeight(node.left), getHeight(node.right)) + 1;
  left.height = Math.max(getHeight(left.left), getHeight(left.right)) + 1;
  return left;
}

export function leftHeight<K, V>(node: AVLNode<K, V>): number {
  return getHeight(node.left);
}

export function rightHeight<K, V>(node: AVLNode<K, V>): number {
  return getHeight(node.right);
}

export function findMin<K, V>(node: AVLNode<K, V>): AVLNode<K, V> {
  return node.left ? findMin(node.left) : node;
}