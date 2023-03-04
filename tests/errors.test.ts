import t from "tap";
import { create, insert, remove } from "../src/index.js";
import * as ERRORS from "../src/errors.js";

t.test("errors", t => {
  t.plan(2);

  t.test("should throw if document doesn't exists", async t => {
    t.plan(1);

    const db = await create({
      schema: {
        name: "string",
      },
    });

    await insert(db, {
      name: "hello",
    });

    const docID = "L1tpqQxc0c2djrSN2a6TJ";

    await t.rejects(
      remove(db, docID),
      new Error(ERRORS.DOC_ID_DOES_NOT_EXISTS(docID)),
    );
  });

  t.test("should throw if hooks are not valid", async t => {
    t.plan(1);

    await t.rejects(
      create({
        schema: {
          name: "string",
        },
        // @ts-expect-error - invalid hooks
        hooks: "invalid",
      }),
      new Error(ERRORS.INVALID_HOOKS_OBJECT()),
    );
  });
});
