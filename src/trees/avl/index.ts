import type { AVLNode } from "./node.js";
import { createAVLNode } from "./node.js";
import { BALANCE_STATE, getBalanceFactor, rotateLeft, rotateRight, findMin, getHeight } from "./utils.js";

export function create<K, V>(key: K, value: V): AVLNode<K, V> {
  return createAVLNode(key, value);
}

export function insert<K, V extends any[]>(node: AVLNode<K, V>, key: K, value: V): AVLNode<K, V> {
  if (!node) {
    return create(key, value);
  }

  if (key < node.key) {
    node.left = insert(node.left as AVLNode<K, V>, key, value);
  } else if (key > node.key) {
    node.right = insert(node.right as AVLNode<K, V>, key, value);
  } else {
    (node.value as string[]) = node.value.concat(value);
    return node;
  }

  const balanceFactor = getBalanceFactor(node);

  if (balanceFactor === BALANCE_STATE.UNBALANCED_LEFT) {
    if (key < (node.left as AVLNode<K, V>).key) {
      node = rotateRight(node);
    } else {
      node.left = rotateLeft(node.left as AVLNode<K, V>);
      node = rotateRight(node);
    }
  }

  if (balanceFactor === BALANCE_STATE.UNBALANCED_RIGHT) {
    if (key > (node.right as AVLNode<K, V>).key) {
      node = rotateLeft(node);
    } else {
      node.right = rotateRight(node.right as AVLNode<K, V>);
      node = rotateLeft(node);
    }
  }

  return node;
}

export function find<K, V>(node: AVLNode<K, V>, key: K): V | null {
  if (!node) {
    return null;
  }

  if (node.key === key) {
    return node.value;
  }

  if (key < node.key) {
    return node.left ? find(node.left, key) : null;
  }

  return node.right ? find(node.right, key) : null;
}

export function remove<K, V>(node: AVLNode<K, V>, key: K): AVLNode<K, V> | null {
  if (!node) {
    return null;
  }

  if (key < node.key) {
    node.left = remove(node.left as AVLNode<K, V>, key);
  } else if (key > node.key) {
    node.right = remove(node.right as AVLNode<K, V>, key);
  } else {
    if (!node.left && !node.right) {
      return null;
    }

    if (!node.left) {
      return node.right as AVLNode<K, V>;
    }

    if (!node.right) {
      return node.left as AVLNode<K, V>;
    }

    const temp = findMin(node.right as AVLNode<K, V>);
    node.key = temp.key;
    node.right = remove(node.right as AVLNode<K, V>, temp.key);
  }

  const balanceFactor = getBalanceFactor(node);

  const leftNode = node.left as AVLNode<K, V>
  const rightNode = node.right as AVLNode<K, V>

  if (balanceFactor === BALANCE_STATE.UNBALANCED_LEFT) {
    if (getBalanceFactor(leftNode) === BALANCE_STATE.BALANCED || getBalanceFactor(leftNode) === BALANCE_STATE.SLIGHTLY_UNBALANCED_LEFT) {
      return rotateRight(node);
    }

    if (getBalanceFactor(leftNode) === BALANCE_STATE.SLIGHTLY_UNBALANCED_RIGHT) {
      node.left = rotateLeft(leftNode);
      return rotateRight(node);
    }
  }

  if (balanceFactor === BALANCE_STATE.UNBALANCED_RIGHT) {
    if (getBalanceFactor(rightNode) === BALANCE_STATE.BALANCED || getBalanceFactor(rightNode) === BALANCE_STATE.SLIGHTLY_UNBALANCED_RIGHT) {
      return rotateLeft(node);
    }

    if (getBalanceFactor(rightNode) === BALANCE_STATE.SLIGHTLY_UNBALANCED_LEFT) {
      node.right = rotateRight(rightNode);
      return rotateLeft(node);
    }
  }

  return node;
}

export function contains<K, V>(node: AVLNode<K, V>, key: K): boolean {
  return !!find(node, key);
}

export function getSize<K, V>(node: AVLNode<K, V> | null): number {
  if (!node) {
    return 0;
  }

  return 1 + getSize(node.left) + getSize(node.right);
}

export function isBalanced<K, V>(node: AVLNode<K, V> | null): boolean {
  if (!node) {
    return true;
  }

  const heightDiff = Math.abs(getHeight(node.left) - getHeight(node.right));
  return heightDiff <= 1 && isBalanced(node.left) && isBalanced(node.right);
}

export function rangeSearch<K, V extends any[]>(node: AVLNode<K, V>, min: K, max: K): V {
  if (!node) {
    return [] as unknown as V;
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const result: V = [];

  function traverse(node: AVLNode<K, V>) {
    if (!node) {
      return;
    }

    if (node.key > min) {
      traverse(node.left as AVLNode<K, V>);
    }

    if (node.key >= min && node.key <= max) {
      result.push(...node.value as V[]);
    }

    if (node.key < max) {
      traverse(node.right as AVLNode<K, V>);
    }
  }

  traverse(node);

  return result;
}

export function greaterThan<K, V extends any[]>(node: AVLNode<K, V>, key: K, inclusive = false): V {
  if (!node) {
    return [] as unknown as V;
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const result: V = [];

  function traverse(node: AVLNode<K, V>) {
    if (!node) {
      return;
    }

    if (inclusive && node.key >= key) {
      result.push(...node.value);
    }

    if (!inclusive && node.key > key) {
      result.push(...node.value as V[]);
    }

    traverse(node.left as AVLNode<K, V>);
    traverse(node.right as AVLNode<K, V>);
  }

  traverse(node);

  return result;
}

export function lessThan<K, V extends any[]>(node: AVLNode<K, V>, key: K, inclusive = false): V {
  if (!node) {
    return [] as unknown as V;
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const result: V = [];

  function traverse(node: AVLNode<K, V>) {
    if (!node) {
      return;
    }

    if (inclusive && node.key <= key) {
      result.push(...node.value as V[]);
    }

    if (!inclusive && node.key < key) {
      result.push(...node.value as V[]);
    }

    traverse(node.left as AVLNode<K, V>);
    traverse(node.right as AVLNode<K, V>);
  }

  traverse(node);

  return result;
}