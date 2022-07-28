import { create, insert, save, load, search } from "../src/lyra";
import { contains as trieContains } from "../src/prefix-tree/trie";

describe("Edge getters", () => {
  it("should correctly enable edge index getter", () => {
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
    expect(trieContains(db.nodes, nameIndex, "john")).toBeTruthy();
    expect(trieContains(db.nodes, nameIndex, "jane")).toBeTruthy();
  });

  it("should correctly enable edge docs getter", () => {
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

    expect(docs[doc1.id]).toStrictEqual({ name: "John", age: 30 });
    expect(docs[doc2.id]).toStrictEqual({ name: "Jane", age: 25 });
  });

  it("should correctly enable index setter", () => {
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

    const {index, docs, nodes} = save(db2);
    load(db, {index, docs, nodes});

    const search1 = search(db, { term: "Jane" });
    const search2 = search(db, { term: "John" });
    const search3 = search(db, { term: "Paolo" });
    const search4 = search(db, { term: "Michele" });

    expect(search1.count).toBe(0);
    expect(search2.count).toBe(0);
    expect(search3.count).toBe(1);
    expect(search4.count).toBe(1);

    expect(search3.hits).toStrictEqual([
      {
        name: "Paolo",
        id: id2.id,
        age: 37,
      },
    ]);

    expect(search4.hits).toStrictEqual([
      {
        name: "Michele",
        id: id1.id,
        age: 27,
      },
    ]);
  });
});
