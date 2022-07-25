import { Lyra } from "../src/lyra";

describe("Edge getters", () => {
  it("should correctly enable edge index getter", async () => {
    const db = new Lyra({
      schema: {
        name: "string",
        age: "number",
      },
      edge: true,
    });

    await db.insert({
      name: "John",
      age: 30,
    });

    await db.insert({
      name: "Jane",
      age: 25,
    });

    const index = db.getIndex;
    const nameIndex = index["name"];

    // Remember that tokenizers an stemmers sets content to lowercase
    expect(nameIndex?.contains("john")).toBeTruthy();
    expect(nameIndex?.contains("jane")).toBeTruthy();
  });

  it("should correctly enable edge docs getter", async () => {
    const db = new Lyra({
      schema: {
        name: "string",
        age: "number",
      },
      edge: true,
    });

    const doc1 = await db.insert({
      name: "John",
      age: 30,
    });

    const doc2 = await db.insert({
      name: "Jane",
      age: 25,
    });

    const docs = db.getDocs;

    expect(docs[doc1.id]).toStrictEqual({ name: "John", age: 30 });
    expect(docs[doc2.id]).toStrictEqual({ name: "Jane", age: 25 });
  });

  it("should correctly enable index setter", async () => {
    const db = new Lyra({
      schema: {
        name: "string",
        age: "number",
      },
      edge: true,
    });

    await db.insert({
      name: "John",
      age: 30,
    });

    await db.insert({
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

    const id1 = await db2.insert({
      name: "Michele",
      age: 27,
    });

    const id2 = await db2.insert({
      name: "Paolo",
      age: 37,
    });

    const index = db2.getIndex;
    const docs = db2.getDocs;

    db.setIndex = index;
    db.setDocs = docs;

    const search1 = await db.search({ term: "Jane" });
    const search2 = await db.search({ term: "John" });
    const search3 = await db.search({ term: "Paolo" });
    const search4 = await db.search({ term: "Michele" });

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
