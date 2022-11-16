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
  let subWord = "";

  for (let i = 0; i < term.length; i++) {
    const character = term[i];
    if (character in root.children) {
      const rootChildCurrentChar = root.children[character];
      const edgeLabel = rootChildCurrentChar.subWord;
      const termSubstring = term.substring(i);

      const commonPrefix = getCommonPrefix(edgeLabel, termSubstring);

      if (commonPrefix.length !== edgeLabel.length && commonPrefix.length !== termSubstring.length) {
        if (tolerance) break;
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

  findAllWords(root, output, subWord, term, exact, tolerance);

  return output;
}

function findAllWords(
  node: Node,
  output: FindResult,
  subWord: string,
  term: string,
  exact?: boolean,
  tolerance?: number,
) {
  if (node.end) {
    const { word, docs: docIDs } = node;

    if (exact && word !== term) {
      return {};
    }

    if (!Object.hasOwn(output, word)) {
      if (tolerance) {
        const difference = Math.abs(term.length - word.length);

        if (difference <= tolerance && boundedLevenshtein(term, word, tolerance).isBounded) {
          output[word] = [];
        }
      } else {
        output[word] = [];
      }
    }

    if (getOwnProperty(output, word) && docIDs.length) {
      const docs = new Set(output[word]);

      const docIDsLength = docIDs.length;
      for (let i = 0; i < docIDsLength; i++) {
        docs.add(docIDs[i]);
      }
      output[word] = Array.from(docs);
    }
  }

  for (const character of Object.keys(node.children)) {
    findAllWords(
      node.children[character],
      output,
      subWord.concat(node.children[character].subWord),
      term,
      exact,
      tolerance,
    );
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
