import { TrieNode } from "./node";

export type FindResult = {
  [key: string]: Set<string>;
};

export class Trie {
  private root = new TrieNode("");

  insert(word: string, docId: string): void {
    const wordAsCharList = word.split("");
    let node = this.root;

    for (let i = 0; i < wordAsCharList.length; i++) {
      const char = wordAsCharList[i];

      if (!node.children?.[char]) {
        node.children![char] = new TrieNode(char);
        node.children![char].parent = node;
      }

      // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
      node = node?.children?.[char]!;

      if (i === wordAsCharList.length - 1) {
        node.end = true;
        node.docs.add(docId);
      }
    }
  }

  contains(word: string): boolean {
    const wordAsCharList = word.split("");
    let node = this.root;

    for (const char of wordAsCharList) {
      if (node?.children?.[char]) {
        node = node.children![char];
      } else {
        return false;
      }
    }

    return node.end;
  }

  find(prefix: string): FindResult {
    const prefixAsCharList = prefix.split("");
    let node = this.root;
    const output: FindResult = {};

    for (const char of prefixAsCharList) {
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
