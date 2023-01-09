import t from "tap";
import { create } from "../src/lyra";
import { tokenize } from "../src/tokenizer";
import { stemmer as ITStemmer } from "../stemmer/lib/it";
import { stemmer as ESStemmer } from "../stemmer/lib/es";
import { stopWords } from "../src/tokenizer/stop-words/index";

t.test("Should handle diacritics and non-diacritics the same", async t => {
  const I1 = "jose josè josé josê josë josē josė josę josà josá josâ josä josæ josã joså josā";

  const languages = [
    {
      name: "english",
      stemmer: undefined,
      expected: ["jose", "jo", "jo", "jo", "jo", "jo", "jo", "jo", "jo", "jo", "jo", "jo", "jo", "jo", "jo", "jo"],
    },
    {
      name: "spanish",
      stemmer: ESStemmer,
      expected: [
        "jos",
        "jose",
        "jos",
        "jose",
        "jose",
        "jos",
        "jos",
        "jos",
        "jos",
        "jos",
        "josa",
        "josa",
        "josa",
        "josa",
        "josa",
        "jos",
      ],
    },
    {
      name: "italian",
      stemmer: ITStemmer,
      expected: [
        "jos",
        "jos",
        "jos",
        "jos",
        "jos",
        "jos",
        "jos",
        "jos",
        "jos",
        "jos",
        "jos",
        "jos",
        "jos",
        "jos",
        "jos",
        "jos",
      ],
    },
  ] as const;

  for (const language of languages) {
    t.test(`in ${language.name}`, async t => {
      t.plan(1);

      const instance = await create({
        schema: {},
        defaultLanguage: language.name,
        components: language.stemmer
          ? {
              tokenizer: {
                stemmingFn: language.stemmer,
                customStopWords: stopWords[language.name],
              },
            }
          : undefined,
      });

      const actual = tokenize(I1, language.name, true, instance.components?.tokenizer);

      t.same(language.expected, actual);
    });
  }
});
