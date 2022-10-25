import t from "tap";
import { findAllWords as radixFind, insert as radixInsert } from "../src/radix-tree/radix";
import { create as createNode } from "../src/radix-tree/radix-node";
const phrases = [
  { id: "1", doc: "the quick, brown fox" },
  { id: "2", doc: "jumps over the lazy dog" },
  { id: "3", doc: "just in time!" },
  { id: "4", doc: "there is something wrong in there" },
  { id: "5", doc: "this is me" },
  { id: "6", doc: "thought it was sunday" },
  { id: "7", doc: "let's try this trie" },
];

t.test("radix tree", t => {
  t.plan(2);

  t.test("should correctly find an element by prefix", async t => {
    t.plan(1);
    const root = createNode();
    const subTree = {};
    for (const { doc, id } of phrases) {
      radixInsert(subTree, root, doc, id);
    }
    const result = await radixFind(root, phrases[5].doc.slice(0, 5));
    t.same(result, [phrases[5].doc]);
  });

  t.test("should correctly find a complete sentence", async t => {
    const subTree = {};
    t.plan(phrases.length);
    const root = createNode();
    for (const { doc, id } of phrases) {
      radixInsert(subTree, root, doc, id);
    }

    for (const phrase of phrases) {
      const result = await radixFind(root, phrase.doc);
      t.same(result, [phrase.doc]);
    }
  });
});
