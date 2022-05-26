import type { Nullable } from "../types";

type Children = {
  [key: string]: TrieNode;
};

type Docs = Set<string>;

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

  getWord(): NodeContent {
    const output = [];

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let node: TrieNode = this;

    while (node !== null) {
      output.unshift(node.key);
      node = node.parent!;
    }

    return [output.join(""), this.docs];
  }

  removeDoc(docID: string): boolean {
    return this.docs.delete(docID);
  }
}
