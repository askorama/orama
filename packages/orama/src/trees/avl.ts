export type Node<K, V> = {
  key: K
  value: V
  left: Node<K, V> | undefined
  right: Node<K, V> | undefined
  height: number
}

type StackNode<K, V> = {
  node: Node<K, V>,
  checkedChildren: boolean
};

const BALANCE_STATE = {
  UNBALANCED_RIGHT: 1,
  SLIGHTLY_UNBALANCED_RIGHT: 2,
  BALANCED: 3,
  SLIGHTLY_UNBALANCED_LEFT: 4,
  UNBALANCED_LEFT: 5,
}

function getBalanceFactor<K, V>(node: Node<K, V>): number {
  const heightDifference = getHeight(node.left) - getHeight(node.right)

  switch (heightDifference) {
    case -2:
      return BALANCE_STATE.UNBALANCED_RIGHT
    case -1:
      return BALANCE_STATE.SLIGHTLY_UNBALANCED_RIGHT
    case 1:
      return BALANCE_STATE.SLIGHTLY_UNBALANCED_LEFT
    case 2:
      return BALANCE_STATE.UNBALANCED_LEFT
    default:
      return BALANCE_STATE.BALANCED
  }
}

function getHeight<K, V>(node: Node<K, V> | undefined): number {
  return node ? node.height : -1
}

function rotateLeft<K, V>(node: Node<K, V>): Node<K, V> {
  const right = node.right as Node<K, V>
  node.right = right.left
  right.left = node
  node.height = Math.max(getHeight(node.left), getHeight(node.right)) + 1
  right.height = Math.max(getHeight(right.left), getHeight(right.right)) + 1
  return right
}

function rotateRight<K, V>(node: Node<K, V>): Node<K, V> {
  const left = node.left as Node<K, V>
  node.left = left.right
  left.right = node
  node.height = Math.max(getHeight(node.left), getHeight(node.right)) + 1
  left.height = Math.max(getHeight(left.left), getHeight(left.right)) + 1
  return left
}

export function contains<K, V>(node: Node<K, V>, key: K): boolean {
  return !!find(node, key)
}

export function getSize<K, V>(root: Node<K, V> | undefined): number {
  let size = 0;
  const queue: Array<Node<K, V>> = [];

  if (root !== undefined) {
    queue.push(root);
  }

  while (queue.length > 0) {
    const node = queue.shift() as Node<K, V>;
    size++;

    if (node.left !== undefined) {
      queue.push(node.left);
    }

    if (node.right !== undefined) {
      queue.push(node.right);
    }
  }

  return size;
}

export function isBalanced<K, V>(root: Node<K, V> | undefined): boolean {
  const stack: StackNode<K, V>[] = [];

  if (root !== undefined) {
    stack.push({ node: root, checkedChildren: false });
  }

  while (stack.length > 0) {
    const top = stack[stack.length - 1];

    if (top.checkedChildren) {
      const heightDiff = getHeight(top.node.left) - getHeight(top.node.right);

      if (heightDiff < -1 || heightDiff > 1) {
        return false;
      }

      stack.pop();
    } else {
      top.checkedChildren = true;

      if (top.node.right !== undefined) {
        stack.push({ node: top.node.right, checkedChildren: false });
      }

      if (top.node.left !== undefined) {
        stack.push({ node: top.node.left, checkedChildren: false });
      }
    }
  }

  return true;
}

export function rangeSearch<K, V>(node: Node<K, V>, min: K, max: K): V {
  if (!node) {
    return [] as unknown as V
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const result: V[] = []

  function traverse(node: Node<K, V>) {
    if (!node) {
      return
    }

    if (node.key > min) {
      traverse(node.left as Node<K, V>)
    }

    if (node.key >= min && node.key <= max) {
      result.push(...(node.value as V[]))
    }

    if (node.key < max) {
      traverse(node.right as Node<K, V>)
    }
  }

  traverse(node)

  return result as V
}

export function greaterThan<K, V>(node: Node<K, V>, key: K, inclusive = false): V {
  if (!node) {
    return [] as unknown as V
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const result: V[] = []

  function traverse(node: Node<K, V>) {
    if (!node) {
      return
    }

    if (inclusive && node.key >= key) {
      result.push(...(node.value as V[]))
    }

    if (!inclusive && node.key > key) {
      result.push(...(node.value as V[]))
    }

    traverse(node.left as Node<K, V>)
    traverse(node.right as Node<K, V>)
  }

  traverse(node)

  return result as V
}

export function lessThan<K, V>(node: Node<K, V>, key: K, inclusive = false): V {
  if (!node) {
    return [] as unknown as V
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const result: V[] = []

  function traverse(node: Node<K, V>) {
    if (!node) {
      return
    }

    if (inclusive && node.key <= key) {
      result.push(...(node.value as V[]))
    }

    if (!inclusive && node.key < key) {
      result.push(...(node.value as V[]))
    }

    traverse(node.left as Node<K, V>)
    traverse(node.right as Node<K, V>)
  }

  traverse(node)

  return result as V
}

function getNodeByKey<K, V>(node: Node<K, V> | undefined, key: K): Node<K, V> | undefined {
  while (node !== undefined) {
    if (key < node.key) {
      node = node.left;
    } else if (key > node.key) {
      node = node.right;
    } else {
      return node;
    }
  }
}

export function create<K, V>(key: K, value: V): Node<K, V> {
  return {
    key,
    value,
    left: undefined,
    right: undefined,
    height: 0,
  }
}

export function insert<K, V>(root: Node<K, V>, key: K, value: V): Node<K, V> {
  let parent;
  let current = root;

  while (current !== undefined) {
    parent = current;
    if (key < current.key) {
        current = current.left as Node<K, V>;
    } else if (key > current.key) {
        current = current.right as Node<K, V>;
    } else {
      // assuming value is an array here
      (current.value as string[]).push(...value as string);
      return root;
    }
  }

  const newNode = create(key, value);

  if (!parent) {
      root = newNode; // tree was empty
  } else if (key < parent.key) {
      parent.left = newNode;
  } else {
      parent.right = newNode;
  }

  current = newNode;

  while (parent) {
    const balanceFactor = getBalanceFactor(parent);
    
    if (balanceFactor === BALANCE_STATE.UNBALANCED_LEFT) {
        if (key >= (parent.left as Node<K, V>).key) {
            parent.left = rotateLeft(parent.left as Node<K, V>);
        }

        parent = rotateRight(parent);
    }

    if (balanceFactor === BALANCE_STATE.UNBALANCED_RIGHT) {
        if (key <= (parent.right as Node<K, V>).key) {
            parent.right = rotateRight(parent.right as Node<K, V>);
        }

        parent = rotateLeft(parent);
    }

    if (parent === root) {
        break;
    }

    current = parent;
    parent = getNodeParent(root, current.key);
  }

  return root;
}

function getNodeParent<K, V>(root: Node<K, V>, key: K): Node<K, V> | undefined {
    let current = root;
    let parent;

    while (current !== undefined) {
        if (key < current.key) {
            parent = current;
            current = current.left as Node<K, V>;
        } else if (key > current.key) {
            parent = current;
            current = current.right as Node<K, V>;
        } else {
            break;
        }
    }

    return parent;
}

export function find<K, V>(root: Node<K, V>, key: K): V | undefined {
  let node = root;

  while (node) {
    if (key < node.key) {
      node = node.left as Node<K, V>;
    } else if (key > node.key) {
      node = node.right as Node<K, V>;
    } else {
      return node.value;
    }
  }
}

export function remove<K, V>(root: Node<K, V> | undefined, key: K): Node<K, V> | undefined {
  let node = root;
  let parentNode: Node<K, V> | undefined;

  while (node && node.key !== key) {
    parentNode = node;
    if (key < node.key) {
      node = node.left as Node<K, V>;
    } else {
      node = node.right as Node<K, V>;
    }
  }

  if (!node) {
    return undefined;
  }

  if (!node.left && !node.right) {
    if (!parentNode) {
      // Node to be deleted is root
      root = undefined;
    } else {
      if (parentNode.left === node) {
        parentNode.left = undefined;
      } else {
        parentNode.right = undefined;
      }
    }
  } else if (node.left && node.right) {
    let minValueNode = node.right;
    let minValueParent = node;

    while (minValueNode.left) {
      minValueParent = minValueNode;
      minValueNode = minValueNode.left;
    }

    node.key = minValueNode.key;

    if (minValueParent === node) {
      minValueParent.right = minValueNode.right;
    } else {
      minValueParent.left = minValueNode.right;
    }
  } else {
    const childNode = node.left ?? node.right;

    if (!parentNode) {
      root = childNode as Node<K, V>;
    } else {
      if (parentNode.left === node) {
        parentNode.left = childNode;
      } else {
        parentNode.right = childNode;
      }
    }
  }

  return root;
}

export function removeDocument<K>(root: Node<K, string[]>, id: string, key: K): void {
  const node = getNodeByKey(root, key)!

  if (node.value.length === 1) {
    remove(root, key)
    return
  }

  node.value.splice(node.value.indexOf(id), 1)
}
