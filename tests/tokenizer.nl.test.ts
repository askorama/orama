import t from "tap";
import { readFileSync } from "fs";
import { join } from "path";
import { tokenize } from "../src/tokenizer";

t.test("Dutch tokenizer", t => {
  t.plan(1);

  t.test("Should tokenize and stem correctly in dutch", t => {
    const dictionary = readFileSync(join(__dirname, "./datasets/dictionaries/nl.dic"), "utf8");
    const words = dictionary.split("\n");
    t.plan(words.length);

    for (const word of words) {
      const O = tokenize(word, "dutch");
      t.matchSnapshot(O, `${t.name}-${word}`);
    }
  });
});
