import t from "tap";
import { create } from "../src/methods/create.js";
import { addSynonyms, removeSynonyms, clearSynonyms, getSynonyms, getAlternateQueries } from "../src/methods/synonyms.js";

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

  t.same(db.data.synonyms.oneWay.testOneWay, { "testOneWay-1": 1, "testOneWay-2": 1 });
  t.same(db.data.synonyms.twoWay.testTwoWay, { "testTwoWay-1": 1, "testTwoWay-2": 1 });

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

  t.same(db.data.synonyms.oneWay.testOneWay, { "testOneWay-2": 1 });
  t.same(db.data.synonyms.twoWay.testTwoWay, { "testTwoWay-2": 1 });

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

t.test("get alternate queries", async t => {
  t.plan(1);

  const db = await create({
    schema: {
      name: "string",
    }
  });

  await addSynonyms(db, {
    kind: "twoWay",
    word: "smartphone",
    synonyms: ["phone", "mobile", "telephone", "iPhone"],
  });

  await addSynonyms(db, {
    kind: "oneWay",
    word: "cheap",
    synonyms: ["inexpensive", "low cost", "low priced", "affordable"],
  });

  const result = await getAlternateQueries(db, ["this", "iPhone", "is", "not", "cheap"]);

  t.same(result, [
    "this smartphone is not cheap",
    "this iPhone is not inexpensive",
    "this iPhone is not low cost",
    "this iPhone is not low priced",
    "this iPhone is not affordable",
  ]);

});

t.test("get alternate queries - more complex synonyms and query", async t => {
  t.plan(1);

  const db = await create({
    schema: {
      name: "string",
    }
  });

  await addSynonyms(db, {
    kind: "twoWay",
    word: "fox",
    synonyms: ["red cat", "red dog", "chicken eater"],
  });

  await addSynonyms(db, {
    kind: "twoWay",
    word: "quick",
    synonyms: ["fast", "speedy", "rapid"],
  });

  await addSynonyms(db, {
    kind: "twoWay",
    word: "brown",
    synonyms: ["dark", "dark brown", "dark yellow"],
  });

  await addSynonyms(db, {
    kind: "twoWay",
    word: "lazy",
    synonyms: ["slow", "slow moving", "slow moving animal"],
  });

  await addSynonyms(db, {
    kind: "twoWay",
    word: "dog",
    synonyms: ["animal", "pet", "puppy"],
  });

  await addSynonyms(db, {
    kind: "twoWay",
    word: "jumps",
    synonyms: ["leaps", "hops", "bounces"],
  });

  const result = await getAlternateQueries(db, ["the", "quick", "brown", "fox", "jumps", "over", "the", "lazy", "dog"], {
    limit: 20,
  });

  t.same(result, [
    "the fast brown fox jumps over the lazy dog",
    "the speedy brown fox jumps over the lazy dog",
    "the rapid brown fox jumps over the lazy dog",
    "the quick dark fox jumps over the lazy dog",
    "the quick dark brown fox jumps over the lazy dog",
    "the quick dark yellow fox jumps over the lazy dog",
    "the quick brown red cat jumps over the lazy dog",
    "the quick brown red dog jumps over the lazy dog",
    "the quick brown chicken eater jumps over the lazy dog",
    "the quick brown fox leaps over the lazy dog",
    "the quick brown fox hops over the lazy dog",
    "the quick brown fox bounces over the lazy dog",
    "the quick brown fox jumps over the slow dog",
    "the quick brown fox jumps over the slow moving dog",
    "the quick brown fox jumps over the slow moving animal dog",
    "the quick brown fox jumps over the lazy animal",
    "the quick brown fox jumps over the lazy pet",
    "the quick brown fox jumps over the lazy puppy",
  ]);

});