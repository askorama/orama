import { create as createNode, Node, updateParent, removeDocument } from "./node";
import { boundedLevenshtein } from "../levenshtein";
import { getOwnProperty } from "../utils";

export type Nodes = Record<string, Node>;

export type FindParams = {
  term: string;
  exact?: boolean;
  tolerance?: number;
};

export type FindResult = Record<string, string[]>;

export function insert(root: Node, word: string, docId: string) {
  for (let i = 0; i < word.length; i++) {
    const currentCharacter = word[i];
    const wordAtIndex = word.substring(i);
    root.docs.push(docId);
    const rootChildCurrentChar = root.children[currentCharacter];

    if (currentCharacter in root.children) {
      const edgeLabel = rootChildCurrentChar.word;
      const commonPrefix = getCommonPrefix(edgeLabel, wordAtIndex);
      const edgeLabelAtCommonPrefix = edgeLabel[commonPrefix.length];
      const commonPrefixLength = commonPrefix.length;

      if (edgeLabel === wordAtIndex) {
        rootChildCurrentChar.docs.push(docId);
        rootChildCurrentChar.end = true;
        return;
      }

      if (commonPrefixLength < edgeLabel.length && commonPrefixLength === wordAtIndex.length) {
        const newNode = createNode(true);
        newNode.word = wordAtIndex;

        newNode.children[edgeLabelAtCommonPrefix] = rootChildCurrentChar;
        const newNodeChild = newNode.children[edgeLabelAtCommonPrefix];

        newNodeChild.word = edgeLabel.substring(commonPrefixLength);
        newNode.docs.push(docId, ...rootChildCurrentChar.docs);

        root.children[currentCharacter] = newNode;

        newNode.key = currentCharacter;
        newNodeChild.key = edgeLabelAtCommonPrefix;

        updateParent(newNode, root);
        updateParent(newNodeChild, newNode);
        return;
      }

      if (commonPrefixLength < edgeLabel.length && commonPrefixLength < wordAtIndex.length) {
        const inbetweenNode = createNode();
        inbetweenNode.word = commonPrefix;

        inbetweenNode.children[edgeLabelAtCommonPrefix] = rootChildCurrentChar;
        const inbetweenNodeChild = inbetweenNode.children[edgeLabelAtCommonPrefix];

        inbetweenNodeChild.word = edgeLabel.substring(commonPrefixLength);
        inbetweenNode.docs.push(docId, ...rootChildCurrentChar.docs);
        root.children[currentCharacter] = inbetweenNode;

        const newNode = createNode(true);
        newNode.word = word.substring(i + commonPrefixLength);
        newNode.docs.push(docId);
        inbetweenNode.children[wordAtIndex[commonPrefixLength]] = newNode;

        inbetweenNode.key = currentCharacter;
        newNode.key = wordAtIndex[commonPrefixLength];
        inbetweenNodeChild.key = edgeLabelAtCommonPrefix;

        updateParent(inbetweenNode, root);
        updateParent(newNode, inbetweenNode);
        updateParent(inbetweenNodeChild, inbetweenNode);
        return;
      }

      i += edgeLabel.length - 1;
      root = rootChildCurrentChar;
    } else {
      const newNode = createNode(true);
      newNode.word = wordAtIndex;
      newNode.key = currentCharacter;
      newNode.docs.push(docId);
      root.children[currentCharacter] = newNode;
      updateParent(newNode, root);
      return;
    }
  }
}

export function find(root: Node, { term, exact, tolerance }: FindParams) {
  let word = "";
  for (let i = 0; i < term.length; i++) {
    const character = term[i];

    if (character in root.children) {
      const edgeLabel = root.children[character].word;
      const commonPrefix = getCommonPrefix(edgeLabel, term.substring(i));
      if (commonPrefix.length !== edgeLabel.length && commonPrefix.length !== term.substring(i).length) {
        return {};
      }
      word = word.concat(root.children[character].word);
      i += root.children[character].word.length - 1;
      root = root.children[character];
    } else {
      return {};
    }
  }
  const output: FindResult = {};

  findAllWords(root, output, word, exact, tolerance);

  if (exact && !Object.hasOwn(output, term)) {
    return {};
  }

  return output;
}

function findAllWords(node: Node, output: FindResult, word: string, exact?: boolean, tolerance?: number) {
  if (node.end) {
    const { word: nodeWord, docs: docIDs } = node;
    // always check in own property to prevent access to inherited properties
    // fix https://github.com/LyraSearch/lyra/issues/137
    if (!Object.hasOwn(output, word)) {
      if (tolerance) {
        // computing the absolute difference of letters between the term and the word
        const difference = Math.abs(word.length - nodeWord.length);

        // if the tolerance is set, check whether the edit distance is within tolerance.
        // In that case, we don't need to add the word to the output
        if (difference <= tolerance && boundedLevenshtein(word, nodeWord, tolerance).isBounded) {
          output[word] = [];
        }
      } else {
        // prevent default tolerance not set
        output[word] = [];
      }
    }
    // check if _output[word] exists and then add the doc to it
    // always check in own property to prevent access to inherited properties
    // fix https://github.com/LyraSearch/lyra/issues/137
    if (getOwnProperty(output, word) && docIDs.length) {
      output[word] = Array.from(new Set(docIDs));
    }
  }

  if (Object.keys(node.children).length === 0) {
    return {};
  }

  for (const character of Object.keys(node.children)) {
    findAllWords(node.children[character], output, word.concat(node.children[character].word), exact, tolerance);
  }
  return output;
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

export function contains(root: Node, term: string): boolean {
  let word = "";
  for (let i = 0; i < term.length; i++) {
    const character = term[i];

    if (character in root.children) {
      const edgeLabel = root.children[character].word;
      const commonPrefix = getCommonPrefix(edgeLabel, term.substring(i));
      if (commonPrefix.length !== edgeLabel.length && commonPrefix.length !== term.substring(i).length) {
        return false;
      }
      word = word.concat(root.children[character].word);
      i += root.children[character].word.length - 1;
      root = root.children[character];
    } else {
      return false;
    }
  }
  return true;
}

export function removeWord(root: Node, term: string): boolean {
  if (!term) {
    return false;
  }

  let word = "";

  for (let i = 0; i < term.length; i++) {
    const character = term[i];
    const parent = root;
    if (character in root.children) {
      word = word.concat(root.children[character].word);
      i += root.children[character].word.length - 1;
      root = root.children[character];

      if (Object.keys(root.children).length === 0) {
        delete parent.children[root.key];
        return true;
      }
    } else {
      return false;
    }
  }

  return false;
}

export function removeDocumentByWord(root: Node, term: string, docID: string, exact = true): boolean {
  if (!term) {
    return true;
  }

  let word = "";
  for (let i = 0; i < term.length; i++) {
    const character = term[i];
    if (character in root.children) {
      word = word.concat(root.children[character].word);
      i += root.children[character].word.length - 1;
      root = root.children[character];

      if (exact && word !== term) {
        continue;
      }

      removeDocument(root, docID);
    } else {
      return false;
    }
  }
  return true;
}
