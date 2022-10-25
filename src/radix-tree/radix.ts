import { create as createNode, Node, updateParent } from "./radix-node";

export type Nodes = Record<string, Node>;

export type FindParams = {
  term: string;
  exact?: boolean;
  tolerance?: number;
};

export type FindResult = Record<string, string[]>;

export async function insert(subtree: Nodes, root: Node, word: string, docId: string) {
  word = word.toLowerCase();
  for (let i = 0; i < word.length; i++) {
    const currentCharacter = word[i];

    if (currentCharacter in root.children) {
      const edgeLabel = root.children[currentCharacter].word;

      const commonPrefix = getCommonPrefix(edgeLabel, word.substring(i));

      if (edgeLabel === word.substring(i)) {
        root.children[currentCharacter].end = true;

        return;
      }

      if (commonPrefix.length < edgeLabel.length && commonPrefix.length === word.substring(i).length) {
        const newNode = createNode(word.substring(i), true);

        newNode.docs.push(docId);

        newNode.children[edgeLabel[commonPrefix.length]] = root.children[currentCharacter];
        newNode.children[edgeLabel[commonPrefix.length]].word = edgeLabel.substring(commonPrefix.length);
        newNode.children[edgeLabel[commonPrefix.length]].docs.push(docId);

        updateParent(newNode, root);

        root.children[currentCharacter] = newNode;

        return;
      }

      if (commonPrefix.length < edgeLabel.length && commonPrefix.length < word.substring(i).length) {
        const inbetweenNode = createNode(commonPrefix);

        inbetweenNode.docs.push(docId);

        inbetweenNode.children[edgeLabel[commonPrefix.length]] = root.children[currentCharacter];

        updateParent(root.children[currentCharacter], inbetweenNode.children[edgeLabel[commonPrefix.length]]);

        inbetweenNode.children[edgeLabel[commonPrefix.length]].docs.push(docId);

        inbetweenNode.children[edgeLabel[commonPrefix.length]].word = edgeLabel.substring(commonPrefix.length);

        updateParent(inbetweenNode, root);

        root.children[currentCharacter] = inbetweenNode;

        const newNode = createNode(word.substring(i + commonPrefix.length), true);
        newNode.docs.push(docId);

        updateParent(newNode, inbetweenNode);

        inbetweenNode.children[word.substring(i)[commonPrefix.length]] = newNode;

        return;
      }
      i += edgeLabel.length - 1;
      root = root.children[currentCharacter];
    } else {
      const newNode = createNode(word.substring(i), true);
      newNode.docs.push(docId);
      updateParent(newNode, root);
      root.children[currentCharacter] = newNode;

      return;
    }
  }
}

export async function findAllWords(root: Node, prefix: string) {
  prefix = prefix.toLowerCase();
  let word = "";
  for (let i = 0; i < prefix.length; i++) {
    const character = prefix[i];

    if (character in root.children) {
      const edgeLabel = root.children[character].word;
      const commonPrefix = getCommonPrefix(edgeLabel, prefix.substring(i));
      if (commonPrefix.length !== edgeLabel.length && commonPrefix.length !== prefix.substring(i).length) {
        return [];
      }
      word = word.concat(root.children[character].word);
      i += root.children[character].word.length - 1;
      root = root.children[character];
    } else {
      return [];
    }
  }
  return find(root, word);
}

async function find(node: Node, word: string) {
  const result: string[] = [];
  await recursiveFind(node, word, result);
  return result;
}

async function recursiveFind(node: Node, word: string, result: string[]) {
  if (node.end) {
    result.push(word);
  }

  if (Object.keys(node.children).length === 0) {
    return;
  }

  for (const character of Object.keys(node.children)) {
    await recursiveFind(node.children[character], word.concat(node.children[character].word), result);
  }
}

function getCommonPrefix(a: string, b: string) {
  let commonPrefix = "";
  for (let i = 0; i < Math.min(a.length, b.length); i++) {
    if (a[i] !== b[i]) {
      return commonPrefix;
    }
    commonPrefix += a[i];
  }

  return commonPrefix;
}
