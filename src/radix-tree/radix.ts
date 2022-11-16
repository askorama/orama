import { create as createNode, Node, updateParent, removeDocument, addDocument } from "./node";
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
    const rootChildCurrentChar = root.children[currentCharacter];
    addDocument(root, docId);

    if (currentCharacter in root.children) {
      const edgeLabel = rootChildCurrentChar.word;
      const commonPrefix = getCommonPrefix(edgeLabel, wordAtIndex);
      const edgeLabelAtCommonPrefix = edgeLabel[commonPrefix.length];
      const commonPrefixLength = commonPrefix.length;
      const edgeLabelLength = edgeLabel.length;

      if (edgeLabel === wordAtIndex) {
        addDocument(rootChildCurrentChar, docId);
        rootChildCurrentChar.end = true;
        return;
      }

      if (commonPrefixLength < edgeLabelLength && commonPrefixLength === wordAtIndex.length) {
        const newNode = createNode(true, wordAtIndex, currentCharacter);
        newNode.children[edgeLabelAtCommonPrefix] = rootChildCurrentChar;
        addDocument(newNode, docId, rootChildCurrentChar.docs);

        const newNodeChild = newNode.children[edgeLabelAtCommonPrefix];
        newNodeChild.word = edgeLabel.substring(commonPrefixLength);
        newNodeChild.key = edgeLabelAtCommonPrefix;

        root.children[currentCharacter] = newNode;

        updateParent(newNode, root);
        updateParent(newNodeChild, newNode);
        return;
      }

      if (commonPrefixLength < edgeLabelLength && commonPrefixLength < wordAtIndex.length) {
        const inbetweenNode = createNode(false, commonPrefix, currentCharacter);
        inbetweenNode.children[edgeLabelAtCommonPrefix] = rootChildCurrentChar;
        addDocument(inbetweenNode, docId, rootChildCurrentChar.docs);

        const inbetweenNodeChild = inbetweenNode.children[edgeLabelAtCommonPrefix];
        inbetweenNodeChild.word = edgeLabel.substring(commonPrefixLength);
        inbetweenNodeChild.key = edgeLabelAtCommonPrefix;

        root.children[currentCharacter] = inbetweenNode;

        const wordAtCommonPrefix = wordAtIndex[commonPrefixLength];

        const newNode = createNode(true, word.substring(i + commonPrefixLength), wordAtCommonPrefix);
        addDocument(newNode, docId);

        inbetweenNode.children[wordAtCommonPrefix] = newNode;

        updateParent(inbetweenNode, root);
        updateParent(newNode, inbetweenNode);
        updateParent(inbetweenNodeChild, inbetweenNode);
        return;
      }

      i += edgeLabelLength - 1;
      root = rootChildCurrentChar;
    } else {
      const newNode = createNode(true, wordAtIndex, currentCharacter);
      addDocument(newNode, docId);

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
      const rootChildCurrentChar = root.children[character];
      const edgeLabel = rootChildCurrentChar.word;
      const termSubstring = term.substring(i);
      const commonPrefix = getCommonPrefix(edgeLabel, termSubstring);

      if (commonPrefix.length !== edgeLabel.length && commonPrefix.length !== termSubstring.length) {
        return {};
      }
      word = word.concat(rootChildCurrentChar.word);
      i += rootChildCurrentChar.word.length - 1;
      root = rootChildCurrentChar;
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
      const rootChildCurrentChar = root.children[character];
      word = word.concat(rootChildCurrentChar.word);
      i += rootChildCurrentChar.word.length - 1;
      root = rootChildCurrentChar;

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
