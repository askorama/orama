import type { AVLNode } from "./node.js";
import { createAVLNode } from "./node.js";
import { BALANCE_STATE, getBalanceFactor, rotateLeft, rotateRight, findMin, getHeight } from "./utils.js";


export function create<T>(value: T): AVLNode<T> {
  return createAVLNode(value);
}

export function insert<T>(node: AVLNode<T>, value: T): AVLNode<T> {
  if (!node) {
    return create(value);
  }

  if (value < node.value) {
    node.left = insert(node.left as AVLNode<T>, value);
  } else if (value > node.value) {
    node.right = insert(node.right as AVLNode<T>, value);
  } else {
    return node;
  }

  const balanceFactor = getBalanceFactor(node);

  if (balanceFactor === BALANCE_STATE.UNBALANCED_LEFT) {
    if (value < (node.left as AVLNode<T>).value) {
      node = rotateRight(node);
    } else {
      node.left = rotateLeft(node.left as AVLNode<T>);
      node = rotateRight(node);
    }
  }

  if (balanceFactor === BALANCE_STATE.UNBALANCED_RIGHT) {
    if (value > (node.right as AVLNode<T>).value) {
      node = rotateLeft(node);
    } else {
      node.right = rotateRight(node.right as AVLNode<T>);
      node = rotateLeft(node);
    }
  }

  return node;
}

export function find<T>(node: AVLNode<T>, value: T): T | null {
  if (!node) {
    return null;
  }

  if (node.value === value) {
    return node.value;
  }

  if (value < node.value) {
    return node.left ? find(node.left, value) : null;
  }

  return node.right ? find(node.right, value) : null;
}

export function remove<T>(node: AVLNode<T>, value: T): AVLNode<T> | null {
  if (!node) {
    return null;
  }

  if (value < node.value) {
    node.left = remove(node.left as AVLNode<T>, value);
  } else if (value > node.value) {
    node.right = remove(node.right as AVLNode<T>, value);
  } else {
    if (!node.left && !node.right) {
      return null;
    }

    if (!node.left) {
      return node.right as AVLNode<T>;
    }

    if (!node.right) {
      return node.left as AVLNode<T>;
    }

    const temp = findMin(node.right as AVLNode<T>);
    node.value = temp.value;
    node.right = remove(node.right as AVLNode<T>, temp.value);
  }

  const balanceFactor = getBalanceFactor(node);

  if (balanceFactor === BALANCE_STATE.UNBALANCED_LEFT) {
    if (getBalanceFactor(node.left as AVLNode<T>) === BALANCE_STATE.BALANCED || getBalanceFactor(node.left as AVLNode<T>) === BALANCE_STATE.SLIGHTLY_UNBALANCED_LEFT) {
      return rotateRight(node);
    }

    if (getBalanceFactor(node.left as AVLNode<T>) === BALANCE_STATE.SLIGHTLY_UNBALANCED_RIGHT) {
      node.left = rotateLeft(node.left as AVLNode<T>);
      return rotateRight(node);
    }
  }

  if (balanceFactor === BALANCE_STATE.UNBALANCED_RIGHT) {
    if (getBalanceFactor(node.right as AVLNode<T>) === BALANCE_STATE.BALANCED || getBalanceFactor(node.right as AVLNode<T>) === BALANCE_STATE.SLIGHTLY_UNBALANCED_RIGHT) {
      return rotateLeft(node);
    }

    if (getBalanceFactor(node.right as AVLNode<T>) === BALANCE_STATE.SLIGHTLY_UNBALANCED_LEFT) {
      node.right = rotateRight(node.right as AVLNode<T>);
      return rotateLeft(node);
    }
  }

  return node;
}

export function contains<T>(node: AVLNode<T>, value: T): boolean {
  return !!find(node, value);
}

export function getSize<T>(node: AVLNode<T> | null): number {
  if (!node) {
    return 0;
  }

  return 1 + getSize(node.left) + getSize(node.right);
}

export function isBalanced<T>(node: AVLNode<T> | null): boolean {
  if (!node) {
    return true;
  }

  const heightDiff = Math.abs(getHeight(node.left) - getHeight(node.right));
  return heightDiff <= 1 && isBalanced(node.left) && isBalanced(node.right);
}
