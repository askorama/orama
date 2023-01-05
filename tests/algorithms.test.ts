import t from "tap";
import { intersectTokenScores } from "../src/algorithms.js";

t.test("utils", t => {
  t.plan(1);

  t.test("should correctly intersect 2 or more arrays", async t => {
    t.plan(3);

    t.same(
      await intersectTokenScores([
        [
          ["foo", 1],
          ["bar", 1],
          ["baz", 2],
        ],
        [
          ["foo", 4],
          ["quick", 10],
          ["brown", 3],
          ["bar", 2],
        ],
        [
          ["fox", 12],
          ["foo", 4],
          ["jumps", 3],
          ["bar", 6],
        ],
      ]),
      [
        ["foo", 9],
        ["bar", 9],
      ],
    );

    t.same(
      await intersectTokenScores([
        [
          ["foo", 1],
          ["bar", 1],
          ["baz", 2],
        ],
        [
          ["quick", 10],
          ["brown", 3],
        ],
      ]),
      [],
    );

    t.same(await intersectTokenScores([]), []);
  });
});
