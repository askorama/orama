import { TrieNode } from "./node";

export type FindParams = {
  prefix: string;
  exact?: boolean;
};

export type FindResult = {
  [key: string]: Set<string>;
};

export class Trie {
  private root = new TrieNode("");

  insert(word: string, docId: string): void {
    const wordLength = word.length;
    let node = this.root;

    for (let i = 0; i < wordLength; i++) {
      const char = word[i];

      if (!node.children?.has(char)) {
        const newTrieNode = new TrieNode(char);
        newTrieNode.setParent(node);
        node.children!.set(char, newTrieNode);
      }

      // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
      node = node.children!.get(char)!;

      if (i === wordLength - 1) {
        node.setEnd(true);
        node.docs.add(docId);
      }
    }
  }

  contains(word: string): boolean {
    let node = this.root;

    for (const char of word) {
      if (node?.children?.has(char)) {
        node = node.children.get(char)!;
      } else {
        return false;
      }
    }

    return node.end;
  }

  find({ prefix, exact }: FindParams): FindResult {
    let node = this.root;
    const output: FindResult = {};

    for (const char of prefix) {
      if (node?.children?.has(char)) {
        node = node.children.get(char)!;
      } else {
        return output;
      }
    }

    findAllWords(node, output);

    function findAllWords(_node: TrieNode, _output: FindResult) {
      if (_node.end) {
        const [word, docIDs] = _node.getWord();

        if (exact && word !== prefix) {
          return output;
        }

        if (!(word in _output)) {
          _output[word] = new Set();
        }

        if (docIDs?.size) {
          for (const doc of docIDs) {
            _output[word].add(doc);
          }
        }
      }

      for (const childNode of _node.children?.values() ?? []) {
        findAllWords(childNode, _output);
      }
    }

    return output;
  }

  removeDocByWord(word: string, docID: string): boolean {
    const root = this.root;
    if (!word) return false;

    function removeWord(node: TrieNode, _word: string, docID: string): boolean {
      const [nodeWord /**_docs*/] = node.getWord();

      if (node.end && nodeWord === word) {
        node.removeDoc(docID);

        if (node.children?.size) {
          node.end = false;
        }

        return true;
      }

      for (const childNode of node.children!.values()) {
        if (childNode) {
          removeWord(childNode, _word, docID);
        }
      }

      return false;
    }

    return removeWord(root, word, docID);
  }

  remove(word: string): boolean {
    const root = this.root;
    if (!word) return false;

    function removeWord(node: TrieNode, _word: string): boolean {
      if (node.end && node.getWord()[0] === word) {
        if (node.children?.size) {
          node.end = false;
        } else {
          node.parent!.deleteChildren();
        }

        return true;
      }

      for (const childNode of node.children?.values() ?? []) {
        removeWord(childNode, _word);
      }

      return false;
    }

    return removeWord(root, word);
  }
}
