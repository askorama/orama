import type { Nullable } from "../types";
import { uniqueId } from "../utils";
export interface Node {
  id: string;
  key: string;
  word: string;
  parent: Nullable<string>;
  children: Record<string, string>;
  docs: string[];
  end: boolean;
}

export function create(key = ""): Node {
  const node = {
    id: uniqueId(),
    key,
    word: "",
    parent: null,
    children: {},
    docs: [],
    end: false,
  };

  Object.defineProperty(node, "toJSON", { value: serialize });
  return node;
}

export function updateParent(node: Node, parent: Node): void {
  node.parent = parent.id;
  node.word = parent.word + node.key;
}

export function removeDocument(node: Node, docID: string): boolean {
  const index = node.docs.findIndex(doc => doc === docID);

  /* c8 ignore next 3 */
  if (index === -1) {
    return false;
  }

  node.docs.splice(index, 1);

  return true;
}

/* c8 ignore next 5 */
function serialize(this: Node): object {
  const { key, word, children, docs, end } = this;

  return { key, word, children, docs, end };
}
