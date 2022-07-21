import type { Nullable } from "../types";

type Children = Record<string, TrieNode>;

type Docs = Set<string> | string[];

type NodeContent = [string, Docs];

export class TrieNode {
  public key: string;
  public parent: Nullable<TrieNode> = null;
  public children: Nullable<Children> = {};
  public docs: Docs = new Set();
  public end = false;

  constructor(key: string) {
    this.key = key;
  }

  setParent(newParent: TrieNode): void {
    this.parent = newParent;
  }

  setEnd(val: boolean): void {
    this.end = val;
  }

  deleteChildren() {
    this.children = null;
  }

  getWord(): NodeContent {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let node: TrieNode = this;
    let output = "";

    while (node !== null) {
      output = node.key + output;
      node = node.parent!;
    }

    return [output, this.docs];
  }

  removeDoc(docID: string): boolean {
    if (this.docs instanceof Set) {
      return this.docs.delete(docID);
    }

    if (this.docs instanceof Array) {
      const index = this.docs.indexOf(docID);

      if (index === -1) {
        return false;
      }

      this.docs.splice(index, 1);

      return true;
    }

    return false;
  }
}
