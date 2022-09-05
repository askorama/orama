import t from "tap";
import { readFileSync } from "fs";
import { join } from "path";
import { tokenize } from "../src/tokenizer";

t.test("Indonesian tokenizer", t => {
  t.plan(1);

  t.test("Should tokenize and stem correctly in indonesian", t => {
    const dictionary = readFileSync(join(__dirname, "./datasets/dictionaries/id.dic"), "utf8");
    const words = dictionary.split("\n");
    t.plan(words.length);

    for (const word of words) {
      const O = tokenize(word, "indonesian");
      t.matchSnapshot(O, `${t.name}-${word}`);
    }
  });
});
