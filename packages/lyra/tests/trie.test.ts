import { Trie } from "../src/prefix-tree/trie";

const phrases = [
  { id: "1", doc: "the quick, brown fox" },
  { id: "2", doc: "jumps over the lazy dog" },
  { id: "3", doc: "just in time!" },
  { id: "4", doc: "there is something wrong in there" },
  { id: "5", doc: "this is me" },
  { id: "6", doc: "thought it was sunday" },
  { id: "7", doc: "let's try this trie" },
];

describe("trie", () => {
  it("should correctly index phrases into a prefix tree", () => {
    const trie = new Trie();

    for (const { doc, id } of phrases) {
      trie.insert(doc, id);
    }

    for (const phrase of phrases) {
      expect(trie.contains(phrase.doc)).toBeTruthy();
    }
  });

  it("should correctly find an element by prefix", () => {
    const trie = new Trie();

    for (const { doc, id } of phrases) {
      trie.insert(doc, id);
    }

    expect(trie.find({ prefix: phrases[5].doc.slice(0, 5) })).toStrictEqual({
      [phrases[5].doc]: new Set(phrases[5].id),
    });
    expect(trie.find({ prefix: "th" })).toMatchInlineSnapshot(`
      Object {
        "the quick, brown fox": Set {
          "1",
        },
        "there is something wrong in there": Set {
          "4",
        },
        "this is me": Set {
          "5",
        },
        "thought it was sunday": Set {
          "6",
        },
      }
    `);
  });

  it("should correctly delete a word from the trie", () => {
    const trie = new Trie();

    for (const { doc, id } of phrases) {
      trie.insert(doc, id);
    }

    trie.remove(phrases[0].doc);

    expect(trie.contains(phrases[0].doc)).toBeFalsy();
    expect(trie.find({ prefix: phrases[0].doc })).toStrictEqual({});
  });
});
