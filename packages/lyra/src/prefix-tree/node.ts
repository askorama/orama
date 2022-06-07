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
    return this.docs.delete(docID);
  }
}
