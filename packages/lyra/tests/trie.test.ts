import t from "tap";
import { create as createNode } from "../src/prefix-tree/node";
import {
  contains as trieContains,
  find as trieFind,
  insert as trieInsert,
  removeWord as trieRemoveWord,
} from "../src/prefix-tree/trie";

const phrases = [
  { id: "1", doc: "the quick, brown fox" },
  { id: "2", doc: "jumps over the lazy dog" },
  { id: "3", doc: "just in time!" },
  { id: "4", doc: "there is something wrong in there" },
  { id: "5", doc: "this is me" },
  { id: "6", doc: "thought it was sunday" },
  { id: "7", doc: "let's try this trie" },
];

t.test("trie", t => {
  t.plan(3);

  t.test("should correctly index phrases into a prefix tree", t => {
    t.plan(phrases.length);

    const nodes = {};
    const trie = createNode();

    for (const { doc, id } of phrases) {
      trieInsert(nodes, trie, doc, id);
    }

    for (const phrase of phrases) {
      t.ok(trieContains(nodes, trie, phrase.doc));
    }
  });

  t.test("should correctly find an element by prefix", t => {
    t.plan(2);

    const nodes = {};
    const trie = createNode();

    for (const { doc, id } of phrases) {
      trieInsert(nodes, trie, doc, id);
    }

    t.strictSame(trieFind(nodes, trie, { term: phrases[5].doc.slice(0, 5) }), { [phrases[5].doc]: [phrases[5].id] });
    t.matchSnapshot(trieFind(nodes, trie, { term: "Th" }), t.name);
  });

  t.test("should correctly delete a word from the trie", t => {
    t.plan(2);

    const nodes = {};
    const trie = createNode();

    for (const { doc, id } of phrases) {
      trieInsert(nodes, trie, doc, id);
    }

    trieRemoveWord(nodes, trie, phrases[0].doc);

    t.notOk(trieContains(nodes, trie, phrases[0].doc));
    t.strictSame(trieFind(nodes, trie, { term: phrases[0].doc }), {});
  });
});
