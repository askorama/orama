import type { Nullable } from "../types";
import { uniqueId } from "../utils";

export interface Node {
  id: string;
  key: string;
  word: string;
  parent: Nullable<string>;
  children: Record<string, Node>;
  docs: string[];
  end: boolean;
}

export function create(end = false): Node {
  const node = {
    id: uniqueId(),
    key: "",
    word: "",
    parent: null,
    children: {},
    docs: [],
    end,
  };

  Object.defineProperty(node, "toJSON", { value: serialize });
  return node;
}

export function updateParent(node: Node, parent: Node): void {
  node.parent = parent.id;
}

export function removeDocument(node: Node, docID: string): boolean {
  const index = node.docs.indexOf(docID);

  /* c8 ignore next 3 */
  if (index === -1) {
    return false;
  }

  node.docs.splice(index, 1);

  return true;
}

/* c8 ignore next 5 */
function serialize(this: Node): object {
  const { word, children, docs, end } = this;

  return { word, children, docs, end };
}
