import { create as createNode, Node, updateParent } from "./radix-node";
import { boundedLevenshtein } from "../levenshtein";
import { getOwnProperty } from "../utils";

export type Nodes = Record<string, Node>;

export type FindParams = {
  term: string;
  exact?: boolean;
  tolerance?: number;
};

export type FindResult = Record<string, string[]>;

export async function insert(nodes: Nodes, root: Node, word: string, docId: string) {
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
        const newNode = createNode(true);
        newNode.word = word.substring(i);

        newNode.children[edgeLabel[commonPrefix.length]] = root.children[currentCharacter];
        newNode.children[edgeLabel[commonPrefix.length]].word = edgeLabel.substring(commonPrefix.length);

        root.children[currentCharacter] = newNode;

        newNode.docs.push(docId);
        newNode.children[edgeLabel[commonPrefix.length]].docs.push(docId);

        newNode.key = currentCharacter;
        newNode.children[edgeLabel[commonPrefix.length]].key = edgeLabel[commonPrefix.length];

        updateParent(newNode, root);
        updateParent(newNode.children[edgeLabel[commonPrefix.length]], newNode);

        return;
      }

      if (commonPrefix.length < edgeLabel.length && commonPrefix.length < word.substring(i).length) {
        const inbetweenNode = createNode();
        inbetweenNode.word = commonPrefix;

        inbetweenNode.children[edgeLabel[commonPrefix.length]] = root.children[currentCharacter];
        inbetweenNode.children[edgeLabel[commonPrefix.length]].word = edgeLabel.substring(commonPrefix.length);
        root.children[currentCharacter] = inbetweenNode;

        const newNode = createNode(true);
        newNode.word = word.substring(i + commonPrefix.length);
        inbetweenNode.children[word.substring(i)[commonPrefix.length]] = newNode;

        inbetweenNode.key = currentCharacter;
        newNode.key = word.substring(i)[commonPrefix.length];
        inbetweenNode.children[edgeLabel[commonPrefix.length]].key = edgeLabel[commonPrefix.length];

        inbetweenNode.docs.push(docId);
        newNode.docs.push(docId);

        updateParent(inbetweenNode, root);
        updateParent(newNode, inbetweenNode);
        updateParent(inbetweenNode.children[edgeLabel[commonPrefix.length]], inbetweenNode);
        return;
      }

      i += edgeLabel.length - 1;
      root = root.children[currentCharacter];
    } else {
      const newNode = createNode(true);
      newNode.word = word.substring(i);
      newNode.docs.push(docId);
      newNode.key = currentCharacter;
      root.children[currentCharacter] = newNode;
      updateParent(newNode, root);
      return;
    }
  }
}

export async function find(nodes: Nodes, root: Node, { term, exact, tolerance }: FindParams) {
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

  await findAllWords(nodes, root, output, word, exact, tolerance);

  if (exact && !output[term]) {
    return;
  }

  return output;
}

async function findAllWords(
  nodes: Nodes,
  node: Node,
  output: FindResult,
  term: string,
  exact?: boolean,
  tolerance?: number,
) {
  if (node.end) {
    const { word, docs: docIDs } = node;
    // always check in own property to prevent access to inherited properties
    // fix https://github.com/LyraSearch/lyra/issues/137
    if (!Object.hasOwn(output, term)) {
      if (tolerance) {
        // computing the absolute difference of letters between the term and the word
        const difference = Math.abs(term.length - word.length);

        // if the tolerance is set, check whether the edit distance is within tolerance.
        // In that case, we don't need to add the word to the output
        if (difference <= tolerance && boundedLevenshtein(term, word, tolerance).isBounded) {
          output[term] = [];
        }
      } else {
        // prevent default tolerance not set
        output[term] = [];
      }
    }
    // check if _output[word] exists and then add the doc to it
    // always check in own property to prevent access to inherited properties
    // fix https://github.com/LyraSearch/lyra/issues/137
    if (getOwnProperty(output, term) && docIDs.length) {
      output[term] = Array.from(new Set(docIDs));
    }
  }

  if (Object.keys(node.children).length === 0) {
    return;
  }

  for (const character of Object.keys(node.children)) {
    await findAllWords(
      nodes,
      node.children[character],
      output,
      term.concat(node.children[character].word),
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

export function contains(nodes: Nodes, root: Node, term: string): boolean {
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

export function removeDocumentByWord(nodes: Nodes, node: Node, word: string, docID: string, exact = true): boolean {
  throw new Error("to be implemented");
}

export function removeWord(nodes: Nodes, node: Node, word: string): boolean {
  throw new Error("to be implemented");
}
