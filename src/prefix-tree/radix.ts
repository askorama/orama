import { uniqueId } from "../utils";

export type Nodes = Record<string, Node>;

export interface RadixNode {
  id: string;
  word: string;
  children: Record<string, RadixNode>;
  docs: string[];
  end: boolean;
}

export function create(word = "", end = false): RadixNode {
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
function serialize(this: RadixNode): object {
  const { word, children, docs, end } = this;
  return { word, children, docs, end };
}

export async function insert(root: RadixNode, word: string) {
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
        const newNode = create(word.substring(i), true);

        newNode.children[edgeLabel[commonPrefix.length]] = root.children[currentCharacter];

        newNode.children[edgeLabel[commonPrefix.length]].word = edgeLabel.substring(commonPrefix.length);

        root.children[currentCharacter] = newNode;

        return;
      }

      if (commonPrefix.length < edgeLabel.length && commonPrefix.length < word.substring(i).length) {
        const inbetweenNode = create(commonPrefix);

        inbetweenNode.children[edgeLabel[commonPrefix.length]] = root.children[currentCharacter];

        inbetweenNode.children[edgeLabel[commonPrefix.length]].word = edgeLabel.substring(commonPrefix.length);

        root.children[currentCharacter] = inbetweenNode;

        inbetweenNode.children[word.substring(i)[commonPrefix.length]] = create(
          word.substring(i + commonPrefix.length),
          true,
        );
        return;
      }
      i += edgeLabel.length - 1;
      root = root.children[currentCharacter];
    } else {
      const newNode = create(word.substring(i), true);
      root.children[currentCharacter] = newNode;

      return;
    }
  }
}

export async function findAllWords(root: RadixNode, prefix: string) {
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

async function find(node: RadixNode, word: string) {
  const result: string[] = [];
  await recursiveFind(node, word, result);
  return result;
}

async function recursiveFind(node: RadixNode, word: string, result: string[]) {
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
