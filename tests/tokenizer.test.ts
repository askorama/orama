import t from "tap";
import { LANGUAGE_NOT_SUPPORTED } from "../src/errors.js";
import { defaultTokenizerConfig, normalizationCache, tokenize } from "../src/tokenizer/index.js";
import { stopWords } from "../src/tokenizer/stop-words/index.js";
import { stemmer as ENStemmer } from "../stemmer/lib/en.js";
import { stemmer as FRStemmer } from "../stemmer/lib/fr.js";
import { stemmer as ITStemmer } from "../stemmer/lib/it.js";
import { stemmer as NOStemmer } from "../stemmer/lib/no.js";
import { stemmer as PTStemmer } from "../stemmer/lib/pt.js";
import { stemmer as RUStemmer } from "../stemmer/lib/ru.js";
import { stemmer as SEStemmer } from "../stemmer/lib/se.js";
import { stemmer as ESStemmer } from "../stemmer/lib/es.js";
import { stemmer as NLStemmer } from "../stemmer/lib/nl.js";
import { stemmer as DEStemmer } from "../stemmer/lib/de.js";
import { stemmer as FIStemmer } from "../stemmer/lib/fi.js";
import { stemmer as DKStemmer } from "../stemmer/lib/dk.js";

t.test("Tokenizer", t => {
  t.plan(13);

  t.test("Should tokenize and stem correctly in english", t => {
    t.plan(2);

    const I1 = "the quick brown fox jumps over the lazy dog";
    const I2 = "I baked some cakes";

    const O1 = tokenize(I1, "english");
    const O2 = tokenize(I2, "english");

    t.matchSnapshot(O1, `${t.name}-O1`);
    t.matchSnapshot(O2, `${t.name}-O2`);
  });

  t.test("Should tokenize and stem correctly in english and allow duplicates", t => {
    t.plan(2);

    const I1 = "this is a test with test duplicates";
    const I2 = "it's alive! it's alive!";

    const O1 = tokenize(I1, "english", true);
    const O2 = tokenize(I2, "english", true);

    t.matchSnapshot(O1, `${t.name}-O1`);
    t.matchSnapshot(O2, `${t.name}-O2`);
  });

  t.test("Should tokenize and stem correctly in french", async t => {
    t.plan(2);

    const I1 = "voyons quel temps il fait dehors";
    const I2 = "j'ai fait des gâteaux";

    const O1 = tokenize(
      I1,
      "french",
      false,
      defaultTokenizerConfig("french", {
        stemmingFn: FRStemmer,
        customStopWords: stopWords.french,
      }),
    );
    const O2 = tokenize(
      I2,
      "french",
      false,
      defaultTokenizerConfig("french", {
        stemmingFn: FRStemmer,
        customStopWords: stopWords.french,
      }),
    );

    t.matchSnapshot(O1, `${t.name}-O1`);
    t.matchSnapshot(O2, `${t.name}-O2`);
  });

  t.test("Should tokenize and stem correctly in italian", async t => {
    t.plan(2);

    const I1 = "ho cucinato delle torte";
    const I2 = "dormire è una cosa difficile quando i test non passano";

    const O1 = tokenize(
      I1,
      "italian",
      false,
      defaultTokenizerConfig("italian", {
        stemmingFn: ITStemmer,
        customStopWords: stopWords.italian,
      }),
    );
    const O2 = tokenize(
      I2,
      "italian",
      false,
      defaultTokenizerConfig("italian", {
        stemmingFn: ITStemmer,
        customStopWords: stopWords.italian,
      }),
    );

    t.matchSnapshot(O1, `${t.name}-O1`);
    t.matchSnapshot(O2, `${t.name}-O2`);
  });

  t.test("Should tokenize and stem correctly in norwegian", async t => {
    t.plan(2);

    const I1 = "Jeg kokte noen kaker";
    const I2 = "å sove er en vanskelig ting når testene mislykkes";

    const O1 = tokenize(
      I1,
      "norwegian",
      false,
      defaultTokenizerConfig("norwegian", {
        stemmingFn: NOStemmer,
        customStopWords: stopWords.norwegian,
      }),
    );
    const O2 = tokenize(
      I2,
      "norwegian",
      false,
      defaultTokenizerConfig("norwegian", {
        stemmingFn: NOStemmer,
        customStopWords: stopWords.norwegian,
      }),
    );

    t.matchSnapshot(O1, `${t.name}-O1`);
    t.matchSnapshot(O2, `${t.name}-O2`);
  });

  t.test("Should tokenize and stem correctly in portuguese", async t => {
    t.plan(2);

    const I1 = "Eu cozinhei alguns bolos";
    const I2 = "dormir é uma coisa difícil quando os testes falham";

    const O1 = tokenize(
      I1,
      "portuguese",
      false,
      defaultTokenizerConfig("portuguese", {
        stemmingFn: PTStemmer,
        customStopWords: stopWords.portuguese,
      }),
    );
    const O2 = tokenize(
      I2,
      "portuguese",
      false,
      defaultTokenizerConfig("portuguese", {
        stemmingFn: PTStemmer,
        customStopWords: stopWords.portuguese,
      }),
    );

    t.matchSnapshot(O1, `${t.name}-O1`);
    t.matchSnapshot(O2, `${t.name}-O2`);
  });

  t.test("Should tokenize and stem correctly in russian", async t => {
    t.plan(2);

    const I1 = "я приготовила пирожные";
    const I2 = "спать трудно, когда тесты не срабатывают";

    const O1 = tokenize(
      I1,
      "russian",
      false,
      defaultTokenizerConfig("russian", {
        stemmingFn: RUStemmer,
        customStopWords: stopWords.russian,
      }),
    );
    const O2 = tokenize(
      I2,
      "russian",
      false,
      defaultTokenizerConfig("russian", {
        stemmingFn: RUStemmer,
        customStopWords: stopWords.russian,
      }),
    );

    t.matchSnapshot(O1, `${t.name}-O1`);
    t.matchSnapshot(O2, `${t.name}-O2`);
  });

  t.test("Should tokenize and stem correctly in swedish", async t => {
    t.plan(2);

    const I1 = "Jag lagade några kakor";
    const I2 = "att sova är en svår sak när testerna misslyckas";

    const O1 = tokenize(
      I1,
      "swedish",
      false,
      defaultTokenizerConfig("swedish", {
        stemmingFn: SEStemmer,
        customStopWords: stopWords.swedish,
      }),
    );
    const O2 = tokenize(
      I2,
      "swedish",
      false,
      defaultTokenizerConfig("swedish", {
        stemmingFn: SEStemmer,
        customStopWords: stopWords.swedish,
      }),
    );

    t.matchSnapshot(O1, `${t.name}-O1`);
    t.matchSnapshot(O2, `${t.name}-O2`);
  });

  t.test("Should tokenize and stem correctly in spanish", async t => {
    t.plan(2);

    const I1 = "cociné unos pasteles";
    const I2 = "dormir es algo dificil cuando las pruebas fallan";

    const O1 = tokenize(
      I1,
      "spanish",
      false,
      defaultTokenizerConfig("spanish", {
        stemmingFn: ESStemmer,
        customStopWords: stopWords.spanish,
      }),
    );
    const O2 = tokenize(
      I2,
      "spanish",
      false,
      defaultTokenizerConfig("spanish", {
        stemmingFn: ESStemmer,
        customStopWords: stopWords.spanish,
      }),
    );

    t.matchSnapshot(O1, `${t.name}-O1`);
    t.matchSnapshot(O2, `${t.name}-O2`);
  });

  t.test("Should tokenize and stem correctly in dutch", async t => {
    t.plan(2);

    const I1 = "de kleine koeien";
    const I2 = "Ik heb wat taarten gemaakt";

    const O2 = tokenize(
      I2,
      "dutch",
      false,
      defaultTokenizerConfig("dutch", {
        stemmingFn: NLStemmer,
        customStopWords: stopWords.dutch,
      }),
    );
    const O1 = tokenize(
      I1,
      "dutch",
      false,
      defaultTokenizerConfig("dutch", {
        stemmingFn: NLStemmer,
        customStopWords: stopWords.dutch,
      }),
    );

    t.matchSnapshot(O1, `${t.name}-O1`);
    t.matchSnapshot(O2, `${t.name}-O2`);
  });

  t.test("Should tokenize and stem correctly in german", async t => {
    t.plan(2);

    const I1 = "Schlaf ist eine harte Sache, wenn Tests fehlschlagen";
    const I2 = "Ich habe ein paar Kekse gebacken";

    const O1 = tokenize(
      I1,
      "german",
      false,
      defaultTokenizerConfig("german", {
        stemmingFn: DEStemmer,
        customStopWords: stopWords.german,
      }),
    );
    const O2 = tokenize(
      I2,
      "german",
      false,
      defaultTokenizerConfig("german", {
        stemmingFn: DEStemmer,
        customStopWords: stopWords.german,
      }),
    );

    t.matchSnapshot(O1, `${t.name}-O1`);
    t.matchSnapshot(O2, `${t.name}-O2`);
  });

  t.test("Should tokenize and stem correctly in finnish", async t => {
    t.plan(2);

    const I1 = "Uni on vaikea asia, kun testit epäonnistuvat";
    const I2 = "Leivoin keksejä";

    const O1 = tokenize(
      I1,
      "finnish",
      false,
      defaultTokenizerConfig("finnish", {
        stemmingFn: FIStemmer,
        customStopWords: stopWords.finnish,
      }),
    );
    const O2 = tokenize(
      I2,
      "finnish",
      false,
      defaultTokenizerConfig("finnish", {
        stemmingFn: FIStemmer,
        customStopWords: stopWords.finnish,
      }),
    );

    t.matchSnapshot(O1, `${t.name}-O1`);
    t.matchSnapshot(O2, `${t.name}-O2`);
  });

  t.test("Should tokenize and stem correctly in danish", async t => {
    t.plan(2);

    const I1 = "Søvn er en svær ting, når prøver mislykkes";
    const I2 = "Jeg bagte småkager";

    const O1 = tokenize(
      I1,
      "danish",
      false,
      defaultTokenizerConfig("danish", {
        stemmingFn: DKStemmer,
        customStopWords: stopWords.danish,
      }),
    );
    const O2 = tokenize(
      I2,
      "danish",
      false,
      defaultTokenizerConfig("danish", {
        stemmingFn: DKStemmer,
        customStopWords: stopWords.danish,
      }),
    );

    t.matchSnapshot(O1, `${t.name}-O1`);
    t.matchSnapshot(O2, `${t.name}-O2`);
  });
});

t.test("Custom stop-words rules", t => {
  t.plan(6);

  t.test("custom array of stop-words", async t => {
    t.plan(2);

    normalizationCache.clear();

    const I1 = "the quick brown fox jumps over the lazy dog";
    const I2 = "I baked some cakes";

    const O1 = tokenize(
      I1,
      "english",
      false,
      defaultTokenizerConfig("english", {
        stemmingFn: ENStemmer,
        customStopWords: ["quick", "brown", "fox", "dog"],
      }),
    );

    const O2 = tokenize(
      I2,
      "english",
      false,
      defaultTokenizerConfig("english", {
        stemmingFn: ENStemmer,
        customStopWords: ["quick", "brown", "fox", "dog"],
      }),
    );

    t.same(O1, ["the", "jump", "over", "lazi"]);
    t.same(O2, ["i", "bake", "some", "cake"]);
  });

  t.test("custom stop-words function", async t => {
    t.plan(2);

    normalizationCache.clear();

    const I1 = "the quick brown fox jumps over the lazy dog";
    const I2 = "I baked some cakes";

    const O1 = tokenize(
      I1,
      "english",
      false,
      defaultTokenizerConfig("english", {
        customStopWords(words: string[]): string[] {
          return [...words, "quick", "brown", "fox", "dog"];
        },
      }),
    );
    const O2 = tokenize(
      I2,
      "english",
      false,
      defaultTokenizerConfig("english", {
        customStopWords(words: string[]): string[] {
          return [...words, "quick", "brown", "fox", "dog"];
        },
      }),
    );

    t.same(O1, ["jump", "lazi"]);
    t.same(O2, ["bake", "cake"]);
  });

  t.test("disable stop-words", async t => {
    t.plan(2);

    normalizationCache.clear();

    const I1 = "the quick brown fox jumps over the lazy dog";
    const I2 = "I baked some cakes";

    const O1 = tokenize(I1, "english", false, defaultTokenizerConfig("english", { enableStopWords: false }));
    const O2 = tokenize(I2, "english", false, defaultTokenizerConfig("english", { enableStopWords: false }));

    t.same(O1, ["the", "quick", "brown", "fox", "jump", "over", "lazi", "dog"]);
    t.same(O2, ["i", "bake", "some", "cake"]);
  });

  t.test("disable stemming", async t => {
    t.plan(2);

    normalizationCache.clear();

    const I1 = "the quick brown fox jumps over the lazy dog";
    const I2 = "I baked some cakes";

    const O1 = tokenize(
      I1,
      "english",
      false,
      defaultTokenizerConfig("english", {
        enableStemming: false,
        customStopWords: stopWords.english,
      }),
    );
    const O2 = tokenize(
      I2,
      "english",
      false,
      defaultTokenizerConfig("english", {
        enableStemming: false,
        customStopWords: stopWords.english,
      }),
    );

    t.same(O1, ["quick", "brown", "fox", "jumps", "lazy", "dog"]);
    t.same(O2, ["baked", "cakes"]);
  });

  t.test("custom stemming function", async t => {
    t.plan(2);

    normalizationCache.clear();

    const I1 = "the quick brown fox jumps over the lazy dog";
    const I2 = "I baked some cakes";

    const O1 = tokenize(
      I1,
      "english",
      false,
      defaultTokenizerConfig("english", {
        customStopWords: stopWords.english,
        stemmingFn: word => `${word}-ish`,
      }),
    );
    const O2 = tokenize(
      I2,
      "english",
      false,
      defaultTokenizerConfig("english", {
        customStopWords: stopWords.english,
        stemmingFn: word => `${word}-ish`,
      }),
    );

    t.same(O1, ["quick-ish", "brown-ish", "fox-ish", "jumps-ish", "lazy-ish", "dog-ish"]);
    t.same(O2, ["baked-ish", "cakes-ish"]);
  });

  t.test("should validate options", async t => {
    t.plan(6);

    t.throws(() => defaultTokenizerConfig("english").assertSupportedLanguage("weird-language"), {
      message: LANGUAGE_NOT_SUPPORTED("weird-language"),
    });

    // @ts-expect-error testing validation
    t.throws(() => defaultTokenizerConfig("english", { tokenizerFn: "FOO" }), {
      message: "tokenizer.tokenizerFn must be a function.",
    });
    // @ts-expect-error testing validation
    t.throws(() => defaultTokenizerConfig("english", { stemmingFn: "FOO" }), {
      message: "tokenizer.stemmingFn property must be a function.",
    });
    // @ts-expect-error testing validation
    t.throws(() => defaultTokenizerConfig("english", { stemmingFn: ENStemmer, customStopWords: "FOO" }), {
      message: "Custom stop words must be a function or an array of strings.",
    });
    // @ts-expect-error testing validation
    t.throws(() => defaultTokenizerConfig("english", { stemmingFn: ENStemmer, customStopWords: [1, 2, 3] }), {
      message: "Custom stop words array must only contain strings.",
    });
    // @ts-expect-error testing validation
    t.throws(() => defaultTokenizerConfig("english", { stemmingFn: ENStemmer, customStopWords: {} }), {
      message: "Custom stop words must be a function or an array of strings.",
    });
  });
});
