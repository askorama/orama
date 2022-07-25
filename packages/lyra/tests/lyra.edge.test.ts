import { Lyra } from "../src/lyra";

describe("Edge getters", () => {
  it("should correctly enable edge index getter", () => {
    const db = new Lyra({
      schema: {
        name: "string",
        age: "number",
      },
      edge: true,
    });

    db.insert({
      name: "John",
      age: 30,
    });

    db.insert({
      name: "Jane",
      age: 25,
    });

    const index = db.save().index;
    const nameIndex = index["name"];

    // Remember that tokenizers an stemmers sets content to lowercase
    expect(nameIndex?.contains("john")).toBeTruthy();
    expect(nameIndex?.contains("jane")).toBeTruthy();
  });

  it("should correctly enable edge docs getter", () => {
    const db = new Lyra({
      schema: {
        name: "string",
        age: "number",
      },
      edge: true,
    });

    const doc1 = db.insert({
      name: "John",
      age: 30,
    });

    const doc2 = db.insert({
      name: "Jane",
      age: 25,
    });

    const docs = db.save().docs;

    expect(docs[doc1.id]).toStrictEqual({ name: "John", age: 30 });
    expect(docs[doc2.id]).toStrictEqual({ name: "Jane", age: 25 });
  });

  it("should correctly enable index setter", () => {
    const db = new Lyra({
      schema: {
        name: "string",
        age: "number",
      },
      edge: true,
    });

    db.insert({
      name: "John",
      age: 30,
    });

    db.insert({
      name: "Jane",
      age: 25,
    });

    const db2 = new Lyra({
      schema: {
        name: "string",
        age: "number",
      },
      edge: true,
    });

    const id1 = db2.insert({
      name: "Michele",
      age: 27,
    });

    const id2 = db2.insert({
      name: "Paolo",
      age: 37,
    });

    const {index, docs} = db2.save();
    db.load({index, docs});

    const search1 = db.search({ term: "Jane" });
    const search2 = db.search({ term: "John" });
    const search3 = db.search({ term: "Paolo" });
    const search4 = db.search({ term: "Michele" });

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
