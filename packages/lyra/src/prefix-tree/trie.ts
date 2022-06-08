import { TrieNode } from "./node";

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

      if (!node.children?.[char]) {
        node.children![char] = new TrieNode(char);
        node.children![char].parent = node;
      }

      // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
      node = node?.children?.[char]!;

      if (i === wordLength - 1) {
        node.end = true;
        node.docs.add(docId);
      }
    }
  }

  contains(word: string): boolean {
    let node = this.root;

    for (const char of word) {
      if (node?.children?.[char]) {
        node = node.children![char];
      } else {
        return false;
      }
    }

    return node.end;
  }

  find(prefix: string): FindResult {
    let node = this.root;
    const output: FindResult = {};

    for (const char of prefix) {
      if (node?.children?.[char]) {
        node = node.children![char];
      } else {
        return output;
      }
    }

    findAllWords(node, output);

    function findAllWords(_node: TrieNode, _output: FindResult) {
      if (_node.end) {
        const [word, docIDs] = _node.getWord();

        if (!(word in _output)) {
          _output[word] = new Set();
        }

        if (docIDs?.size) {
          for (const doc of docIDs) {
            _output[word].add(doc);
          }
        }
      }

      for (const child in _node.children) {
        findAllWords(_node.children[child], _output);
      }
    }

    return output;
  }

  removeDocByWord(word: string, docID: string): boolean {
    const root = this.root;
    if (!word) return false;

    function removeWord(node: TrieNode, _word: string, docID: string): boolean {
      const [nodeWord, _docs] = node.getWord();

      if (node.end && nodeWord === word) {
        const hasChildren = Object.keys(node.children!).length > 0;
        node.removeDoc(docID);

        if (hasChildren) {
          node.end = false;
        }

        return true;
      }

      for (const key in node.children) {
        const ch = node?.children?.[key];
        if (ch) {
          removeWord(ch, _word, docID);
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
        const hasChildren = Object.keys(node.children!).length > 0;

        if (hasChildren) {
          node.end = false;
        } else {
          node.parent!.children = null;
        }

        return true;
      }

      for (const key in node.children) {
        removeWord(node.children[key], _word);
      }

      return false;
    }

    return removeWord(root, word);
  }
}
