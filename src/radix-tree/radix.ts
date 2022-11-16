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

export function insert(root: Node, subWord: string, docId: string) {
  for (let i = 0; i < subWord.length; i++) {
    const currentCharacter = subWord[i];
    const wordAtIndex = subWord.substring(i);
    const rootChildCurrentChar = root.children[currentCharacter];

    if (currentCharacter in root.children) {
      const edgeLabel = rootChildCurrentChar.subWord;
      const commonPrefix = getCommonPrefix(edgeLabel, wordAtIndex);
      const commonPrefixLength = commonPrefix.length;
      const edgeLabelAtCommonPrefix = edgeLabel[commonPrefixLength];

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
        newNodeChild.subWord = edgeLabel.substring(commonPrefixLength);
        newNodeChild.key = edgeLabelAtCommonPrefix;

        root.children[currentCharacter] = newNode;

        updateParent(newNode, root);
        updateParent(newNodeChild, newNode);
        return;
      }

      if (commonPrefixLength < edgeLabelLength && commonPrefixLength < wordAtIndex.length) {
        const inbetweenNode = createNode(false, commonPrefix, currentCharacter);
        inbetweenNode.children[edgeLabelAtCommonPrefix] = rootChildCurrentChar;
        root.children[currentCharacter] = inbetweenNode;

        const inbetweenNodeChild = inbetweenNode.children[edgeLabelAtCommonPrefix];
        inbetweenNodeChild.subWord = edgeLabel.substring(commonPrefixLength);
        inbetweenNodeChild.key = edgeLabelAtCommonPrefix;

        const wordAtCommonPrefix = wordAtIndex[commonPrefixLength];
        const newNode = createNode(true, subWord.substring(i + commonPrefixLength), wordAtCommonPrefix);
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
  let subWord = "";
  for (let i = 0; i < term.length; i++) {
    const character = term[i];
    if (character in root.children) {
      const rootChildCurrentChar = root.children[character];
      const edgeLabel = rootChildCurrentChar.subWord;
      const termSubstring = term.substring(i);
      const commonPrefix = getCommonPrefix(edgeLabel, termSubstring);

      if (commonPrefix.length !== edgeLabel.length && commonPrefix.length !== termSubstring.length) {
        return {};
      }
      subWord = subWord.concat(rootChildCurrentChar.subWord);
      i += rootChildCurrentChar.subWord.length - 1;
      root = rootChildCurrentChar;
    } else {
      return {};
    }
  }
  const output: FindResult = {};

  findAllWords(root, output, subWord, exact, tolerance);

  if (exact && !Object.hasOwn(output, term)) {
    return {};
  }

  return output;
}

function findAllWords(node: Node, output: FindResult, subWord: string, exact?: boolean, tolerance?: number) {
  if (node.end) {
    const { subWord: nodeWord, docs: docIDs } = node;
    // always check in own property to prevent access to inherited properties
    // fix https://github.com/LyraSearch/lyra/issues/137
    if (!Object.hasOwn(output, subWord)) {
      if (tolerance) {
        // computing the absolute difference of letters between the term and the subWord
        const difference = Math.abs(subWord.length - nodeWord.length);

        // if the tolerance is set, check whether the edit distance is within tolerance.
        // In that case, we don't need to add the subWord to the output
        if (difference <= tolerance && boundedLevenshtein(subWord, nodeWord, tolerance).isBounded) {
          output[subWord] = [];
        }
      } else {
        // prevent default tolerance not set
        output[subWord] = [];
      }
    }
    // check if _output[subWord] exists and then add the doc to it
    // always check in own property to prevent access to inherited properties
    // fix https://github.com/LyraSearch/lyra/issues/137
    if (getOwnProperty(output, subWord) && docIDs.length) {
      output[subWord] = Array.from(new Set(docIDs));
    }
  }

  if (Object.keys(node.children).length === 0) {
    return {};
  }

  for (const character of Object.keys(node.children)) {
    findAllWords(node.children[character], output, subWord.concat(node.children[character].subWord), exact, tolerance);
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
  let subWord = "";
  for (let i = 0; i < term.length; i++) {
    const character = term[i];

    if (character in root.children) {
      const edgeLabel = root.children[character].subWord;
      const commonPrefix = getCommonPrefix(edgeLabel, term.substring(i));
      if (commonPrefix.length !== edgeLabel.length && commonPrefix.length !== term.substring(i).length) {
        return false;
      }
      subWord = subWord.concat(root.children[character].subWord);
      i += root.children[character].subWord.length - 1;
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

  let subWord = "";

  for (let i = 0; i < term.length; i++) {
    const character = term[i];
    const parent = root;
    if (character in root.children) {
      subWord = subWord.concat(root.children[character].subWord);
      i += root.children[character].subWord.length - 1;
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

  let subWord = "";
  for (let i = 0; i < term.length; i++) {
    const character = term[i];
    if (character in root.children) {
      const rootChildCurrentChar = root.children[character];
      subWord = subWord.concat(rootChildCurrentChar.subWord);
      i += rootChildCurrentChar.subWord.length - 1;
      root = rootChildCurrentChar;

      if (exact && subWord !== term) {
        continue;
      }

      removeDocument(root, docID);
    } else {
      return false;
    }
  }
  return true;
}
