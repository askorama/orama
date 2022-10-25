import { uniqueId } from "../utils";

export type Nodes = Record<string, Node>;

export interface Node {
  id: string;
  word: string;
  children: Record<string, Node>;
  docs: string[];
  end: boolean;
}

export function create(word = "", end = false): Node {
  const node = {
    id: uniqueId(),
    word,
    children: {},
    docs: [],
    end,
  };

  Object.defineProperty(node, "toJSON", { value: serialize });
  return node;
}

/* c8 ignore next 5 */
function serialize(this: Node): object {
  const { word, children, docs, end } = this;
  return { word, children, docs, end };
}

export function insert(nodes: Nodes, word: string) {
  word = word.toLowerCase();

  for (let i = 0; i < word.length; i++) {
    const currentCharacter = word[i];

    if (currentCharacter in nodes) {
      const edgeLabel = nodes[currentCharacter].word;

      const commonPrefix = getCommonPrefix(edgeLabel, word.substring(i));

      if (edgeLabel === word.substring(i)) {
        nodes[currentCharacter].end = true;
        return;
      }

      if (commonPrefix.length < edgeLabel.length && commonPrefix.length === word.substring(i).length) {
        const newNode = create(word.substring(i), true);

        newNode.children[edgeLabel[commonPrefix.length]] = nodes[currentCharacter];

        newNode.children[edgeLabel[commonPrefix.length]].word = edgeLabel.substring(commonPrefix.length);

        nodes[currentCharacter] = newNode;
        return;
      }

      if (commonPrefix.length < edgeLabel.length && commonPrefix.length < word.substring(i).length) {
        const inbetweenNode = create(commonPrefix);

        inbetweenNode.children[edgeLabel[commonPrefix.length]] = nodes[currentCharacter];

        inbetweenNode.children[edgeLabel[commonPrefix.length]].word = edgeLabel.substring(commonPrefix.length);

        nodes[currentCharacter] = inbetweenNode;

        inbetweenNode.children[word.substring(i)[commonPrefix.length]] = create(
          word.substring(i + commonPrefix.length),
          true,
        );

        return;
      }
      i += edgeLabel.length - 1;
    } else {
      const newNode = create(word.substring(i), true);
      nodes[currentCharacter] = newNode;

      return;
    }
  }
}

export async function findAllWords(nodes: Nodes, sentence: string) {
  sentence = sentence.toLowerCase();
  let word = "";
  for (let i = 0; i < sentence.length; i++) {
    const character = sentence[i];

    if (character in nodes.children) {
      const edgeLabel = nodes[character].word;
      const commonPrefix = getCommonPrefix(edgeLabel, sentence.substring(i));
      if (commonPrefix.length !== edgeLabel.length && commonPrefix.length !== sentence.substring(i).length) {
        return [];
      }

      word = word.concat(nodes[character].word);
      i += nodes[character].word.length - 1;
    } else {
      return [];
    }
  }

  return find(nodes, word);
}

export async function find(nodes: Nodes, word: string) {
  const words: string[] = [];
  for (const character of Object.keys(nodes)) {
    await recursiveFind(word.concat(nodes[character].word), nodes[character], words);
  }
  return words;
}

export async function recursiveFind(word: string, startingNode: Node, words: string[]) {
  if (startingNode.end) {
    words.push(word);
  }

  if (Object.keys(startingNode.children).length === 0) {
    return;
  }

  for (const character of Object.keys(startingNode.children)) {
    await recursiveFind(word.concat(startingNode.children[character].word), startingNode.children[character], words);
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
