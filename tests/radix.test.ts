import t from "tap";
import { find as radixFind, insert as radixInsert, contains as radixContains } from "../src/radix-tree/radix";
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
  t.plan(4);

  t.test("should correctly find an element by prefix", async t => {
    t.plan(1);
    const root = createNode();
    const subTree = {};
    for (const { doc, id } of phrases) {
      radixInsert(subTree, root, doc, id);
    }
    const result = await radixFind(subTree, root, { term: phrases[5].doc.slice(0, 5) });
    t.strictSame(result, {
      [phrases[5].doc]: [phrases[5].id],
    });
  });

  t.test("should correctly find a complete sentence", async t => {
    const subTree = {};
    t.plan(phrases.length);
    const root = createNode();
    for (const { doc, id } of phrases) {
      radixInsert(subTree, root, doc, id);
    }

    for (const phrase of phrases) {
      const result = await radixFind(subTree, root, { term: phrase.doc });
      t.strictSame(result, {
        [phrase.doc]: [phrase.id],
      });
    }
  });

  t.test("exact works correctly", async t => {
    t.plan(2);
    const root = createNode();
    const subTree = {};
    for (const { doc, id } of phrases) {
      radixInsert(subTree, root, doc, id);
    }
    const exactResult = await radixFind(subTree, root, { term: phrases[5].doc.slice(0, 5), exact: true });
    t.notOk(exactResult);

    const result = await radixFind(subTree, root, { term: phrases[5].doc, exact: true });
    t.strictSame(result, { [phrases[5].doc]: [phrases[5].id] });
  });

  t.test("should correctly index phrases into a prefix tree", t => {
    t.plan(phrases.length + 1);

    const nodes = {};
    const root = createNode();

    for (const { doc, id } of phrases) {
      radixInsert(nodes, root, doc, id);
    }

    for (const phrase of phrases) {
      t.ok(radixContains(nodes, root, phrase.doc));
    }

    t.notOk(radixContains(nodes, root, "thought it was saturday"));
  });
});
