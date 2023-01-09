import t from "tap";
import { create, insert, load, save, search } from "../src/index.js";
import { RetrievedDoc } from "../src/methods/search.js";
import { contains as trieContains } from "../src/radix-tree/radix.js";
import { PropertiesSchema, ResolveSchema } from "../src/types.js";

function extractOriginalDoc<T extends PropertiesSchema>(result: RetrievedDoc<T>[]): ResolveSchema<T>[] {
  return result.map(({ document }: RetrievedDoc<T>) => document);
}

t.test("Edge getters", t => {
  t.plan(4);

  t.test("should correctly enable edge index getter", async t => {
    t.plan(2);

    const db = await create({
      schema: {
        name: "string",
        age: "number",
      },
      edge: true,
    });

    await insert(db, {
      name: "John",
      age: 30,
    });

    await insert(db, {
      name: "Jane",
      age: 25,
    });

    const { index } = await save(db);
    const nameIndex = index["name"];

    // Remember that tokenizers an stemmers sets content to lowercase
    t.ok(trieContains(nameIndex, "john"));
    t.ok(trieContains(nameIndex, "jane"));
  });

  t.test("should correctly enable edge docs getter", async t => {
    t.plan(2);

    const db = await create({
      schema: {
        name: "string",
        age: "number",
      },
      edge: true,
    });

    const doc1 = await insert(db, {
      name: "John",
      age: 30,
    });

    const doc2 = await insert(db, {
      name: "Jane",
      age: 25,
    });

    const { docs } = await save(db);

    t.strictSame(docs[doc1.id], { name: "John", age: 30 });
    t.strictSame(docs[doc2.id], { name: "Jane", age: 25 });
  });

  t.test("should correctly enable index setter", async t => {
    t.plan(6);

    const db = await create({
      schema: {
        name: "string",
        age: "number",
      },
      edge: true,
    });

    await insert(db, {
      name: "John",
      age: 30,
    });

    await insert(db, {
      name: "Jane",
      age: 25,
    });

    const db2 = await create({
      schema: {
        name: "string",
        age: "number",
      },
      edge: true,
    });

    await insert(db2, {
      name: "Michele",
      age: 27,
    });

    await insert(db2, {
      name: "Paolo",
      age: 37,
    });

    const dbData = await save(db2);
    await load(db, dbData);

    const search1 = await search(db, { term: "Jane" });
    const search2 = await search(db, { term: "John" });
    const search3 = await search(db, { term: "Paolo" });
    const search4 = await search(db, { term: "Michele" });

    t.equal(search1.count, 0);
    t.equal(search2.count, 0);
    t.equal(search3.count, 1);
    t.equal(search4.count, 1);

    t.matchSnapshot(extractOriginalDoc(search3.hits));
    t.matchSnapshot(extractOriginalDoc(search4.hits));
  });

  t.test("It should correctly save and load data", async t => {
    t.plan(2);

    const originalDB = await create({
      schema: {
        name: "string",
        age: "number",
      },
    });

    await insert(originalDB, {
      name: "Michele",
      age: 27,
    });

    await insert(originalDB, {
      name: "Paolo",
      age: 37,
    });

    const DBData = await save(originalDB);

    const newDB = await create({
      schema: {
        name: "string",
        age: "number",
      },
      edge: true,
    });

    load(newDB, DBData);

    const search1 = await search(originalDB, { term: "Michele" });
    const search2 = await search(newDB, { term: "Michele" });

    const search3 = await search(originalDB, { term: "P" });
    const search4 = await search(newDB, { term: "P" });

    t.strictSame(search1.hits, search2.hits);
    t.strictSame(search3.hits, search4.hits);
  });
});
