import { create as createNode, removeDocument, updateParent, Node } from "./node";
import { boundedLevenshtein } from "../levenshtein";
import { getOwnProperty } from "../utils";

export type Nodes = Record<string, Node>;

export type FindParams = {
  term: string;
  exact?: boolean;
  tolerance?: number;
};

export type FindResult = Record<string, string[]>;

function findAllWords(nodes: Nodes, node: Node, output: FindResult, term: string, exact?: boolean, tolerance?: number) {
  if (node.end) {
    const { word, docs: docIDs } = node;

    if (exact && word !== term) {
      return;
    }

    // always check in own property to prevent access to inherited properties
    // fix https://github.com/LyraSearch/lyra/issues/137
    if (!Object.hasOwn(output, word)) {
      if (tolerance) {
        // computing the absolute difference of letters between the term and the word
        const difference = Math.abs(term.length - word.length);

        // if the tolerance is set, check whether the edit distance is within tolerance.
        // In that case, we don't need to add the word to the output
        if (difference <= tolerance && boundedLevenshtein(term, word, tolerance).isBounded) {
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
      const docs = new Set(output[word]);

      for (const doc of docIDs) {
        docs.add(doc);
      }

      output[word] = Array.from(docs);
    }
  }

  for (const childNode in node.children) {
    findAllWords(nodes, nodes[node.children[childNode]], output, term, exact, tolerance);
  }
}

export function insert(nodes: Nodes, node: Node, word: string, docId: string): void {
  const wordLength = word.length;

  for (let i = 0; i < wordLength; i++) {
    const char = word[i];

    if (!node.children?.[char]) {
      const newNode = createNode(char);
      updateParent(newNode, node);

      nodes[newNode.id] = newNode;
      node.children[char] = newNode.id;
    }

    node = nodes[node.children[char]];

    if (i === wordLength - 1) {
      node.end = true;
      node.docs.push(docId);
    }
  }
}

export function contains(nodes: Nodes, node: Node, word: string): boolean {
  const wordLength = word.length;

  for (let i = 0; i < wordLength; i++) {
    const char = word[i];
    const next = node.children?.[char];

    if(!next) {
      return false
    }

    node = nodes[next]
  }

  return node.end;
}

export function find(nodes: Nodes, node: Node, { term, exact, tolerance }: FindParams): FindResult {
  const output: FindResult = {};
  const termLength = term.length;

  for (let i = 0; i < termLength; i++) {
    const char = term[i];
    const next = node.children?.[char];

    if (next) {
      node = nodes[next];
    } else if (!tolerance) {
      return output;
    }
  }

  findAllWords(nodes, node, output, term, exact, tolerance);

  return output;
}

export function removeDocumentByWord(nodes: Nodes, node: Node, word: string, docID: string, exact = true): boolean {
  if (!word) {
    return false;
  }

  const { word: nodeWord, docs: docIDs } = node;

  if (exact && node.end && nodeWord === word) {
    removeDocument(node, docID);

    if (node.children?.size && docIDs.includes(docID)) {
      node.end = false;
    }

    return true;
  }

  for (const childNode in node.children) {
    removeDocumentByWord(nodes, nodes[node.children[childNode]], word, docID);
  }

  return false;
}

export function removeWord(nodes: Nodes, node: Node, word: string): boolean {
  if (!word) {
    return false;
  }

  if (node.end && node.word === word) {
    if (node.children?.size) {
      node.end = false;
    } else {
      nodes[node.parent!].children = {};
    }

    return true;
  }

  for (const childNode in node.children) {
    removeWord(nodes, nodes[node.children[childNode]], word);
  }

  return false;
}
