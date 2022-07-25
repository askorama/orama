import type { Nullable } from "../types";

type Children = Record<string, TrieNode>;

type Docs = string[];

type NodeContent = [string, Docs];

export class TrieNode {
  public key: string;
  public word: string;
  public parent: Nullable<TrieNode> = null;
  public children: Nullable<Children> = {};
  public docs: Docs = [];
  public end = false;

  constructor(key: string) {
    this.key = key;
    this.word = '';
  }

  get content(): NodeContent {
    return [this.word, this.docs];
  }

  setParent(newParent: TrieNode): void {
    this.parent = newParent;
    this.word = newParent.word + this.key;
  }

  setEnd(val: boolean): void {
    this.end = val;
  }

  deleteChildren() {
    this.children = null;
  }

  removeDoc(docID: string): boolean {
    const index = this.docs.indexOf(docID);

    if (index === -1) {
      return false;
    }

    this.docs.splice(index, 1);

    return true;
  }
}
