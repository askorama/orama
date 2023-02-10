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
  const RadixNode = {
    id: uniqueId(),
    key,
    subWord,
    parent: null,
    children: {},
    docs: [],
    end,
    word: "",
  };

  Object.defineProperty(RadixNode, "toJSON", { value: serialize });
  return RadixNode;
}

export function updateParent(RadixNode: RadixNode, parent: RadixNode): void {
  RadixNode.parent = parent.id;
  RadixNode.word = parent.word + RadixNode.subWord;
}

export function addDocument(RadixNode: RadixNode, docID: string): void {
  RadixNode.docs.push(docID);
}

export function removeDocument(RadixNode: RadixNode, docID: string): boolean {
  const index = RadixNode.docs.indexOf(docID);

  /* c8 ignore next 3 */
  if (index === -1) {
    return false;
  }

  RadixNode.docs.splice(index, 1);

  return true;
}

/* c8 ignore next 5 */
function serialize(this: RadixNode): object {
  const { word, subWord, children, docs, end } = this;

  return { word, subWord, children, docs, end };
}
