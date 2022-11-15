import t from "tap";
import { create, insert, save, load, search } from "../src/lyra";
import { contains as trieContains } from "../src/prefix-tree/trie";

function extractOriginalDoc(result: any) {
  return result.map(({ document }: any) => document);
}

t.test("Edge getters", t => {
  t.plan(3);

  t.test("should correctly enable edge index getter", t => {
    t.plan(2);

    const db = create({
      schema: {
        name: "string",
        age: "number",
      },
      edge: true,
    });

    insert(db, {
      name: "John",
      age: 30,
    });

    insert(db, {
      name: "Jane",
      age: 25,
    });

    const index = save(db).index;
    const nameIndex = index["name"];

    // Remember that tokenizers an stemmers sets content to lowercase
    t.ok(trieContains(db.nodes, nameIndex, "john"));
    t.ok(trieContains(db.nodes, nameIndex, "jane"));
  });

  t.test("should correctly enable edge docs getter", t => {
    t.plan(2);

    const db = create({
      schema: {
        name: "string",
        age: "number",
      },
      edge: true,
    });

    const doc1 = insert(db, {
      name: "John",
      age: 30,
    });

    const doc2 = insert(db, {
      name: "Jane",
      age: 25,
    });

    const docs = save(db).docs;

    t.strictSame(docs[doc1.id], { name: "John", age: 30 });
    t.strictSame(docs[doc2.id], { name: "Jane", age: 25 });
  });

  t.test("should correctly enable index setter", t => {
    t.plan(6);

    const db = create({
      schema: {
        name: "string",
        age: "number",
      },
      edge: true,
    });

    insert(db, {
      name: "John",
      age: 30,
    });

    insert(db, {
      name: "Jane",
      age: 25,
    });

    const db2 = create({
      schema: {
        name: "string",
        age: "number",
      },
      edge: true,
    });

    const id1 = insert(db2, {
      name: "Michele",
      age: 27,
    });

    const id2 = insert(db2, {
      name: "Paolo",
      age: 37,
    });

    const { index, docs, nodes, schema, frequencies, tokenOccurrencies } = save(db2);
    load(db, { index, docs, nodes, schema, frequencies, tokenOccurrencies });

    const search1 = search(db, { term: "Jane" });
    const search2 = search(db, { term: "John" });
    const search3 = search(db, { term: "Paolo" });
    const search4 = search(db, { term: "Michele" });

    t.equal(search1.count, 0);
    t.equal(search2.count, 0);
    t.equal(search3.count, 1);
    t.equal(search4.count, 1);

    t.matchSnapshot(extractOriginalDoc(search3.hits));
    t.matchSnapshot(extractOriginalDoc(search4.hits));
  });
});
