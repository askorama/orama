import t from "tap";
import { create, insert, save, load, search } from "../src/lyra";
import { contains as trieContains } from "../src/radix-tree/radix";

function extractOriginalDoc(result: any) {
  return result.map(({ document }: any) => document);
}

t.test("Edge getters", t => {
  t.plan(4);

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
    t.ok(trieContains(nameIndex, "john"));
    t.ok(trieContains(nameIndex, "jane"));
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

    insert(db2, {
      name: "Michele",
      age: 27,
    });

    insert(db2, {
      name: "Paolo",
      age: 37,
    });

    const dbData = save(db2);
    load(db, dbData);

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

  t.test("It should correctly save and load data", t => {
    t.plan(2);

    const originalDB = create({
      schema: {
        name: "string",
        age: "number",
      },
    });

    insert(originalDB, {
      name: "Michele",
      age: 27,
    });

    insert(originalDB, {
      name: "Paolo",
      age: 37,
    });

    const DBData = save(originalDB);

    const newDB = create({
      schema: {
        name: "string",
        age: "number",
      },
      edge: true,
    });

    load(newDB, DBData);

    const search1 = search(originalDB, { term: "Michele" });
    const search2 = search(newDB, { term: "Michele" });

    const search3 = search(originalDB, { term: "P" });
    const search4 = search(newDB, { term: "P" });

    t.strictSame(search1.hits, search2.hits);
    t.strictSame(search3.hits, search4.hits);
  });
});
