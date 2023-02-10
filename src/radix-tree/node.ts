import type { Nullable } from "../types/index.js";
import { uniqueId } from "../utils.js";

export interface RadixNode {
  id: string;
  key: string;
  subWord: string;
  parent: Nullable<string>;
  children: Record<string, RadixNode>;
  docs: string[];
  end: boolean;
  word: string;
}

export function create(end = false, subWord = "", key = ""): RadixNode {
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

export function updateParent(node: RadixNode, parent: RadixNode): void {
  node.parent = parent.id;
  node.word = parent.word + node.subWord;
}

export function addDocument(node: RadixNode, docID: string): void {
  node.docs.push(docID);
}

export function removeDocument(node: RadixNode, docID: string): boolean {
  const index = node.docs.indexOf(docID);

  /* c8 ignore next 3 */
  if (index === -1) {
    return false;
  }

  node.docs.splice(index, 1);

  return true;
}

/* c8 ignore next 5 */
function serialize(this: RadixNode): object {
  const { word, subWord, children, docs, end } = this;

  return { word, subWord, children, docs, end };
}
