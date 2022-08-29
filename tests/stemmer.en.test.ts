import t from "tap";
import { stem } from "../src/tokenizer/stemmer/en";

t.test("ensligh stemmer", t => {
  t.plan(1);

  t.test("should correctly stem words", t => {
    t.plan(14);

    t.equal(stem("cats"), "cat");
    t.equal(stem("cars"), "car");
    t.equal(stem("beautiful"), "beauti");
    t.equal(stem("compressing"), "compress");
    t.equal(stem("inception"), "incep");
    t.equal(stem("searching"), "search");
    t.equal(stem("outragious"), "outragi");
    t.equal(stem("yelling"), "yell");
    t.equal(stem("overseed"), "overse");
    t.equal(stem("hopefully"), "hopefulli");
    t.equal(stem("mindfullness"), "mindful");
    t.equal(stem("mindfullness"), "mindful");
    t.equal(stem("chill"), "chill");
    t.equal(stem("rational"), "ration");
  });
});
