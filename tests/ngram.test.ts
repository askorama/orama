import t from "tap";
import { nGram } from "../src/tokenizer/ngram";

t.test("ngram", t => {
  t.plan(1);

  t.test("should correctly split text into ngrams of a given size", t => {
    t.plan(3);

    t.same(nGram("hello", 2), ["he", "el", "ll", "lo"]);
    t.same(nGram("quick", 3), ["qui", "uic", "ick"]);
    t.same(nGram("terence", 4), ["tere", "eren", "renc", "ence"]);
  });
});
