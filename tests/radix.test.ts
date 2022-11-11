import t from "tap";
import {
  find as radixFind,
  insert as radixInsert,
  contains as radixContains,
  removeWord as radixRemoveWord,
  removeDocumentByWord as radixRemoveDocumentByWord,
} from "../src/radix-tree/radix";
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
  t.plan(7);

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
    t.strictSame(exactResult, {});

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

  t.test("should correctly delete a word from the tree", async t => {
    t.plan(phrases.length + 2);

    const nodes = {};
    const root = createNode();

    for (const { doc, id } of phrases) {
      await radixInsert(nodes, root, doc, id);
    }

    const removedIndex = 0;
    const removal = radixRemoveWord(nodes, root, phrases[removedIndex].doc);
    t.ok(removal);

    const invalidRemoval = radixRemoveWord(nodes, root, "xyz");
    t.notOk(invalidRemoval);

    for (let i = 0; i < phrases.length; i++) {
      if (i === removedIndex) {
        t.notOk(radixContains(nodes, root, phrases[removedIndex].doc));
      } else {
        const result = await radixFind(nodes, root, { term: phrases[i].doc });
        t.strictSame(result, {
          [phrases[i].doc]: [phrases[i].id],
        });
      }
    }
  });

  t.test("should correctly delete a id from the tree with exact=true", async t => {
    t.plan(2);

    const nodes = {};
    const root = createNode();

    for (const { doc, id } of phrases) {
      await radixInsert(nodes, root, doc, id);
    }

    radixRemoveDocumentByWord(nodes, root, phrases[0].doc, phrases[0].id, true);

    const resultFullSearch = await radixFind(nodes, root, { term: phrases[0].doc });

    t.strictSame(resultFullSearch, {
      [phrases[0].doc]: [],
    });

    const resultHalfSearch = await radixFind(nodes, root, { term: "the" });
    t.has(resultHalfSearch, {
      [phrases[0].doc]: [],
    });
  });

  t.test("should correctly delete a id from the tree", async t => {
    t.plan(2);

    const nodes = {};
    const root = createNode();

    for (const { doc, id } of phrases) {
      await radixInsert(nodes, root, doc, id);
    }

    radixRemoveDocumentByWord(nodes, root, phrases[0].doc, phrases[0].id, false);

    const resultFullSearch = await radixFind(nodes, root, { term: phrases[0].doc });
    t.strictSame(resultFullSearch, {
      [phrases[0].doc]: [],
    });

    const resultHalfSearch = await radixFind(nodes, root, { term: phrases[0].doc.slice(0, 5) });
    t.strictSame(resultHalfSearch, {
      [phrases[0].doc]: [],
    });
  });
});
