import t from "tap";
import { create } from "../src/methods/create.js";
import { addSynonyms, removeSynonyms, clearSynonyms } from "../src/methods/synonyms.js";

t.test("create Lyra instance with synonyms", async t => {
  t.plan(2)

  const db = await create({
    schema: {
      name: "string"
    },
    synonyms: {
      oneWay: {
        "testOneWay": ["testOneWay-1", "testOneWay-2"]
      },
      twoWay: {
        "testTwoWay": ["testTwoWay-1", "testTwoWay-2"]
      }
    }
  });

  t.same(db.synonyms.oneWay.testOneWay, ["testOneWay-1", "testOneWay-2"]);
  t.same(db.synonyms.twoWay.testTwoWay, ["testTwoWay-1", "testTwoWay-2"]);

  t.end();

});

t.test("add synonyms", async t => {
  t.plan(2)

  const db = await create({
    schema: {
      name: "string"
    }
  });

  addSynonyms(db, {
    kind: "oneWay",
    word: "testOneWay",
    synonyms: ["testOneWay-1", "testOneWay-2"]
  })

  addSynonyms(db, {
    kind: "twoWay",
    word: "testTwoWay",
    synonyms: ["testTwoWay-1", "testTwoWay-2"]
  })

  t.same(db.synonyms.oneWay.testOneWay, ["testOneWay-1", "testOneWay-2"]);
  t.same(db.synonyms.twoWay.testTwoWay, ["testTwoWay-1", "testTwoWay-2"]);

  t.end();
})

t.test("remove synonyms", async t => {
  t.plan(2)

  const db = await create({
    schema: {
      name: "string"
    },
    synonyms: {
      oneWay: {
        "testOneWay": ["testOneWay-1", "testOneWay-2"]
      },
      twoWay: {
        "testTwoWay": ["testTwoWay-1", "testTwoWay-2"]
      }
    }
  });

  removeSynonyms(db, {
    kind: "oneWay",
    word: "testOneWay",
    synonyms: ["testOneWay-1"]
  })

  removeSynonyms(db, {
    kind: "twoWay",
    word: "testTwoWay",
    synonyms: ["testTwoWay-1"]
  })

  t.same(db.synonyms.oneWay.testOneWay, ["testOneWay-2"]);
  t.same(db.synonyms.twoWay.testTwoWay, ["testTwoWay-2"]);

  t.end();
})

t.test("clear synonyms", async t => {
  t.plan(2)

  const db = await create({
    schema: {
      name: "string"
    },
    synonyms: {
      oneWay: {
        "testOneWay": ["testOneWay-1", "testOneWay-2"]
      },
      twoWay: {
        "testTwoWay": ["testTwoWay-1", "testTwoWay-2"]
      }
    }
  });

  clearSynonyms(db, {
    kind: "oneWay",
    word: "testOneWay"
  })

  clearSynonyms(db, {
    kind: "twoWay",
    word: "testTwoWay"
  })

  t.same(db.synonyms.oneWay.testOneWay, []);
  t.same(db.synonyms.twoWay.testTwoWay, []);

  t.end();
})