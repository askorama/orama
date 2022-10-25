import t from "tap";
import { find as radixFind, insert as radixInsert, Nodes } from "../src/prefix-tree/radix";

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
  t.plan(3);

  t.test("should correctly find an element by prefix", async t => {
    t.plan(2);

    const nodes: Nodes = {};

    for (const { doc } of phrases) {
      radixInsert(nodes, doc);
    }
    console.log(JSON.stringify(nodes, null, 2));
    const result = await radixFind(nodes, phrases[5].doc.slice(0, 5));
    console.log(JSON.stringify(result, null, 2));
    console.log(JSON.stringify({ [phrases[5].doc]: [phrases[5].id] }, null, 2));
    t.strictSame(result, { [phrases[5].doc]: [phrases[5].id] });
  });

  t.test("should correctly delete a word from the trie", async t => {
    t.plan(2);

    const nodes = {};

    for (const { doc } of phrases) {
      radixInsert(nodes, doc);
    }

    t.strictSame(await radixFind(nodes, phrases[0].doc), {});
  });
});
