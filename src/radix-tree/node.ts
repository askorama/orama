import type { Nullable } from "../types";
import { uniqueId } from "../utils";

export interface Node {
  id: string;
  key: string;
  subWord: string;
  parent: Nullable<string>;
  children: Record<string, Node>;
  docs: string[];
  end: boolean;
  word: string;
}

export function create(end = false, subWord = "", key = ""): Node {
  const node = {
    id: uniqueId(),
    key,
    subWord,
    parent: null,
    children: {},
    docs: [],
    end,
    word: "",
  };

  Object.defineProperty(node, "toJSON", { value: serialize });
  return node;
}

export function updateParent(node: Node, parent: Node): void {
  node.parent = parent.id;
  node.word = parent.subWord + node.subWord;
}

export function addDocument(node: Node, docID: string): void {
  node.docs.push(docID);
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
  const { word, subWord, children, docs, end } = this;

  return { word, subWord, children, docs, end };
}
