import t from "tap";
import { create } from "../src/methods/create.js";
import { addSynonyms, removeSynonyms, clearSynonyms, getSynonyms } from "../src/methods/synonyms.js";

t.test("add synonyms", async t => {
  t.plan(2);

  const db = await create({
    schema: {
      name: "string",
    },
  });

  await addSynonyms(db, {
    kind: "oneWay",
    word: "testOneWay",
    synonyms: ["testOneWay-1", "testOneWay-2"],
  });

  await addSynonyms(db, {
    kind: "twoWay",
    word: "testTwoWay",
    synonyms: ["testTwoWay-1", "testTwoWay-2"],
  });

  t.same(db.data.synonyms.oneWay.testOneWay, { 'testOneWay-1': 1, 'testOneWay-2': 1 });
  t.same(db.data.synonyms.twoWay.testTwoWay, { 'testTwoWay-1': 1, 'testTwoWay-2': 1 });

  t.end();
});

t.test("remove synonyms", async t => {
  t.plan(2);

  const db = await create({
    schema: {
      name: "string",
    },
  });

  await addSynonyms(db, {
    kind: "oneWay",
    word: "testOneWay",
    synonyms: ["testOneWay-1", "testOneWay-2"],
  });

  await addSynonyms(db, {
    kind: "twoWay",
    word: "testTwoWay",
    synonyms: ["testTwoWay-1", "testTwoWay-2"],
  });

  await removeSynonyms(db, {
    kind: "oneWay",
    word: "testOneWay",
    synonyms: ["testOneWay-1"],
  });

  await removeSynonyms(db, {
    kind: "twoWay",
    word: "testTwoWay",
    synonyms: ["testTwoWay-1"],
  });

  t.same(db.data.synonyms.oneWay.testOneWay, { "testOneWay-2": 1});
  t.same(db.data.synonyms.twoWay.testTwoWay, { "testTwoWay-2": 1});

  t.end();
});

t.test("clear synonyms", async t => {
  t.plan(2);

  const db = await create({
    schema: {
      name: "string",
    },
  });

  await addSynonyms(db, {
    kind: "oneWay",
    word: "testOneWay",
    synonyms: ["testOneWay-1", "testOneWay-2"],
  });

  await addSynonyms(db, {
    kind: "twoWay",
    word: "testTwoWay",
    synonyms: ["testTwoWay-1", "testTwoWay-2"],
  });

  await clearSynonyms(db, {
    kind: "oneWay",
    word: "testOneWay",
  });

  await clearSynonyms(db, {
    kind: "twoWay",
    word: "testTwoWay",
  });

  t.same(db.data.synonyms.oneWay.testOneWay, []);
  t.same(db.data.synonyms.twoWay.testTwoWay, []);

  t.end();
});

t.test("add synonyms with invalid kind", async t => {
  t.plan(3);

  const db = await create({
    schema: {
      name: "string",
    },
  });

  try {
    await addSynonyms(db, {
      // @ts-expect-error error case
      kind: "invalidKind",
      word: "testOneWay",
      synonyms: ["testOneWay-1", "testOneWay-2"],
    });
  } catch (error) {
    t.equal(
      error.message,
      "Invalid synonym kind. Expected one of the following: oneWay, twoWay, but got: invalidKind.",
    );
  }

  try {
    await removeSynonyms(db, {
      // @ts-expect-error error case
      kind: "invalidKind",
      word: "testOneWay",
      synonyms: ["testOneWay-1", "testOneWay-2"],
    });
  } catch (error) {
    t.equal(
      error.message,
      "Invalid synonym kind. Expected one of the following: oneWay, twoWay, but got: invalidKind.",
    );
  }

  try {
    await clearSynonyms(db, {
      // @ts-expect-error error case
      kind: "invalidKind",
      word: "testOneWay",
    });
  } catch (error) {
    t.equal(
      error.message,
      "Invalid synonym kind. Expected one of the following: oneWay, twoWay, but got: invalidKind.",
    );
  }

  t.end();
});

t.test("get synonyms", async t => {
  t.plan(2);

  const db = await create({
    schema: {
      name: "string",
    },
  });

  await addSynonyms(db, {
    kind: "oneWay",
    word: "testOneWay",
    synonyms: ["testOneWay-1", "testOneWay-2"],
  });

  await addSynonyms(db, {
    kind: "twoWay",
    word: "testTwoWay",
    synonyms: ["testTwoWay-1", "testTwoWay-2"],
  });

  t.same(await getSynonyms(db, { kind: "oneWay", word: "testOneWay" }), ["testOneWay-1", "testOneWay-2"]);
  t.same(await getSynonyms(db, { kind: "twoWay", word: "testTwoWay" }), ["testTwoWay-1", "testTwoWay-2"]);

  t.end();
});
