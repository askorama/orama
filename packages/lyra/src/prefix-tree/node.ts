import type { Nullable } from "../types";

type Children = {
  [key: string]: TrieNode;
};

type Docs = Set<string>;

export class TrieNode {
  public key: string;
  public parent: Nullable<TrieNode> = null;
  public children: Nullable<Children> = {};
  public docs: Docs = new Set();
  public end = false;

  constructor(key: string) {
    this.key = key;
  }

  getWord(): [string, Docs] {
    const output = [];

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let node: TrieNode = this;

    while (node !== null) {
      output.unshift(node.key);
      node = node.parent!;
    }

    return [output.join(""), this.docs];
  }
}
