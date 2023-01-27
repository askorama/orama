import t from "tap";
import { create, insert, search } from "../src/index.js";

t.test("elapsed", t => {
  t.plan(2);

  t.test("should correctly set elapsed time to a human-readable form", async t => {
    t.plan(1);
    const db = await create({
      schema: {
        title: "string",
        body: "string",
      },
      components: {
        elapsed: {
          format: "human"
        }
      }
    });

    await insert(db, {
      title: "Hello world",
      body: "This is a test",
    });

    const results = await search(db, {
      term: "test"
    });

    t.same(typeof results.elapsed, "string");
  });

  t.test("should correctly set elapsed time to a raw, bigInt", async t => {
    t.plan(1);
    const db = await create({
      schema: {
        title: "string",
        body: "string",
      },
      components: {
        elapsed: {
          format: "raw"
        }
      }
    });

    await insert(db, {
      title: "Hello world",
      body: "This is a test",
    });

    const results = await search(db, {
      term: "test"
    });

    t.same(typeof results.elapsed, "bigint");
  });
});