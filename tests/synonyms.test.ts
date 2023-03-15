import t from "tap";
import { create } from "../src/methods/create.js";
import { addSynonyms, removeSynonyms, clearSynonyms } from "../src/methods/synonyms.js";

t.skip("create Lyra instance with synonyms", async t => {
  t.plan(2);

  const db = await create({
    schema: {
      name: "string",
    },
  });

  await addSynonyms(db, {
    oneWay: {
      testOneWay: ["testOneWay-1", "testOneWay-2"],
    },
    twoWay: {
      testTwoWay: ["testTwoWay-1", "testTwoWay-2"],
    },
  });

  t.same(db.data.synonyms.oneWay.testOneWay, ["testOneWay-1", "testOneWay-2"]);
  t.same(db.data.synonyms.twoWay.testTwoWay, ["testTwoWay-1", "testTwoWay-2"]);

  t.end();
});

t.skip("add synonyms", async t => {
  t.plan(2);

  const db = await create({
    schema: {
      name: "string",
    },
  });

  await addSynonyms(db, {
    oneWay: {
      testOneWay: ["testOneWay-1", "testOneWay-2"],
    },
    twoWay: {
      testTwoWay: ["testTwoWay-1", "testTwoWay-2"],
    },
  });

  t.same(db.data.synonyms.oneWay.testOneWay, ["testOneWay-1", "testOneWay-2"]);
  t.same(db.data.synonyms.twoWay.testTwoWay, ["testTwoWay-1", "testTwoWay-2"]);

  t.end();
});

t.skip("remove synonyms", async t => {
  t.plan(2);

  const db = await create({
    schema: {
      name: "string",
    },
  });

  await addSynonyms(db, {
    oneWay: {
      testOneWay: ["testOneWay-1", "testOneWay-2"],
    },
    twoWay: {
      testTwoWay: ["testTwoWay-1", "testTwoWay-2"],
    },
  });

  t.same(db.data.synonyms.oneWay.testOneWay, ["testOneWay-2"]);
  t.same(db.data.synonyms.twoWay.testTwoWay, ["testTwoWay-2"]);

  t.end();
});

t.skip("clear synonyms", async t => {
  t.plan(2);

  const db = await create({
    schema: {
      name: "string",
    },
  });

  await addSynonyms(db, {
    oneWay: {
      testOneWay: ["testOneWay-1", "testOneWay-2"],
    },
    twoWay: {
      testTwoWay: ["testTwoWay-1", "testTwoWay-2"],
    },
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

t.skip("add synonyms with invalid kind", async t => {
  const db = await create({
    schema: {
      name: "string",
    },
  });

  try {
    await addSynonyms(db, {
      oneWay: {
        testOneWay: ["testOneWay-1", "testOneWay-2"],
      },
      twoWay: {
        testTwoWay: ["testTwoWay-1", "testTwoWay-2"],
      },
    });
  } catch (error) {
    t.equal(
      error.message,
      "Invalid synonym kind. Expected one of the following: oneWay, twoWay, but got: invalidKind.",
    );
  }

  t.end();
});
