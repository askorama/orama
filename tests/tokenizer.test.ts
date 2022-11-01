import t from "tap";
import { create } from "../src/lyra";
import { tokenize, normalizationCache } from "../src/tokenizer";
import { stemmer as FRStemmer } from "../stemmer/lib/fr";
import { stemmer as NOStemmer } from "../stemmer/lib/no";
import { stemmer as ITStemmer } from "../stemmer/lib/it";
import { stemmer as PTStemmer } from "../stemmer/lib/pt";
import { stemmer as RUStemmer } from "../stemmer/lib/ru";
import { stemmer as SEStemmer } from "../stemmer/lib/se";
import { stemmer as ESStemmer } from "../stemmer/lib/es";
import { stemmer as NLStemmer } from "../stemmer/lib/nl";
import { stemmer as DEStemmer } from "../stemmer/lib/de";
import { stemmer as FIStemmer } from "../stemmer/lib/fi";
import { stemmer as DKStemmer } from "../stemmer/lib/dk";
import { stopWords } from "../src/tokenizer/stop-words/index";

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

  t.test("Should tokenize and stem correctly in french", t => {
    t.plan(2);

    const { tokenizer } = create({
      schema: {},
      defaultLanguage: "french",
      tokenizer: {
        stemmingFn: FRStemmer,
        customStopWords: stopWords.french,
      },
    });

    const I1 = "voyons quel temps il fait dehors";
    const I2 = "j'ai fait des gâteaux";

    const O1 = tokenize(I1, "french", false, tokenizer);
    const O2 = tokenize(I2, "french", false, tokenizer);

    t.matchSnapshot(O1, `${t.name}-O1`);
    t.matchSnapshot(O2, `${t.name}-O2`);
  });

  t.test("Should tokenize and stem correctly in italian", t => {
    t.plan(2);

    const { tokenizer } = create({
      schema: {},
      defaultLanguage: "italian",
      tokenizer: {
        stemmingFn: ITStemmer,
        customStopWords: stopWords.italian,
      },
    });

    const I1 = "ho cucinato delle torte";
    const I2 = "dormire è una cosa difficile quando i test non passano";

    const O1 = tokenize(I1, "italian", false, tokenizer);
    const O2 = tokenize(I2, "italian", false, tokenizer);

    t.matchSnapshot(O1, `${t.name}-O1`);
    t.matchSnapshot(O2, `${t.name}-O2`);
  });

  t.test("Should tokenize and stem correctly in norwegian", t => {
    t.plan(2);

    const { tokenizer } = create({
      schema: {},
      defaultLanguage: "norwegian",
      tokenizer: {
        stemmingFn: NOStemmer,
        customStopWords: stopWords.norwegian,
      },
    });

    const I1 = "Jeg kokte noen kaker";
    const I2 = "å sove er en vanskelig ting når testene mislykkes";

    const O1 = tokenize(I1, "norwegian", false, tokenizer);
    const O2 = tokenize(I2, "norwegian", false, tokenizer);

    t.matchSnapshot(O1, `${t.name}-O1`);
    t.matchSnapshot(O2, `${t.name}-O2`);
  });

  t.test("Should tokenize and stem correctly in portuguese", t => {
    t.plan(2);

    const { tokenizer } = create({
      schema: {},
      defaultLanguage: "portuguese",
      tokenizer: {
        stemmingFn: PTStemmer,
        customStopWords: stopWords.portuguese,
      },
    });

    const I1 = "Eu cozinhei alguns bolos";
    const I2 = "dormir é uma coisa difícil quando os testes falham";

    const O1 = tokenize(I1, "portuguese", false, tokenizer);
    const O2 = tokenize(I2, "portuguese", false, tokenizer);

    t.matchSnapshot(O1, `${t.name}-O1`);
    t.matchSnapshot(O2, `${t.name}-O2`);
  });

  t.test("Should tokenize and stem correctly in russian", t => {
    t.plan(2);

    const { tokenizer } = create({
      schema: {},
      defaultLanguage: "russian",
      tokenizer: {
        stemmingFn: RUStemmer,
        customStopWords: stopWords.russian,
      },
    });

    const I1 = "я приготовила пирожные";
    const I2 = "спать трудно, когда тесты не срабатывают";

    const O1 = tokenize(I1, "russian", false, tokenizer);
    const O2 = tokenize(I2, "russian", false, tokenizer);

    t.matchSnapshot(O1, `${t.name}-O1`);
    t.matchSnapshot(O2, `${t.name}-O2`);
  });

  t.test("Should tokenize and stem correctly in swedish", t => {
    t.plan(2);

    const { tokenizer } = create({
      schema: {},
      defaultLanguage: "swedish",
      tokenizer: {
        stemmingFn: SEStemmer,
        customStopWords: stopWords.swedish,
      },
    });

    const I1 = "Jag lagade några kakor";
    const I2 = "att sova är en svår sak när testerna misslyckas";

    const O1 = tokenize(I1, "swedish", false, tokenizer);
    const O2 = tokenize(I2, "swedish", false, tokenizer);

    t.matchSnapshot(O1, `${t.name}-O1`);
    t.matchSnapshot(O2, `${t.name}-O2`);
  });

  t.test("Should tokenize and stem correctly in spanish", t => {
    t.plan(2);

    const { tokenizer } = create({
      schema: {},
      defaultLanguage: "spanish",
      tokenizer: {
        stemmingFn: ESStemmer,
        customStopWords: stopWords.spanish,
      },
    });

    const I1 = "cociné unos pasteles";
    const I2 = "dormir es algo dificil cuando las pruebas fallan";

    const O1 = tokenize(I1, "spanish", false, tokenizer);
    const O2 = tokenize(I2, "spanish", false, tokenizer);

    t.matchSnapshot(O1, `${t.name}-O1`);
    t.matchSnapshot(O2, `${t.name}-O2`);
  });

  t.test("Should tokenize and stem correctly in dutch", t => {
    t.plan(2);

    const { tokenizer } = create({
      schema: {},
      defaultLanguage: "dutch",
      tokenizer: {
        stemmingFn: NLStemmer,
        customStopWords: stopWords.dutch,
      },
    });

    const I1 = "de kleine koeien";
    const I2 = "Ik heb wat taarten gemaakt";

    const O2 = tokenize(I2, "dutch", false, tokenizer);
    const O1 = tokenize(I1, "dutch", false, tokenizer);

    t.matchSnapshot(O1, `${t.name}-O1`);
    t.matchSnapshot(O2, `${t.name}-O2`);
  });

  t.test("Should tokenize and stem correctly in german", t => {
    t.plan(2);

    const { tokenizer } = create({
      schema: {},
      defaultLanguage: "german",
      tokenizer: {
        stemmingFn: DEStemmer,
        customStopWords: stopWords.german,
      },
    });

    const I1 = "Schlaf ist eine harte Sache, wenn Tests fehlschlagen";
    const I2 = "Ich habe ein paar Kekse gebacken";

    const O1 = tokenize(I1, "german", false, tokenizer);
    const O2 = tokenize(I2, "german", false, tokenizer);

    t.matchSnapshot(O1, `${t.name}-O1`);
    t.matchSnapshot(O2, `${t.name}-O2`);
  });

  t.test("Should tokenize and stem correctly in finnish", t => {
    t.plan(2);

    const { tokenizer } = create({
      schema: {},
      defaultLanguage: "finnish",
      tokenizer: {
        stemmingFn: FIStemmer,
        customStopWords: stopWords.finnish,
      },
    });

    const I1 = "Uni on vaikea asia, kun testit epäonnistuvat";
    const I2 = "Leivoin keksejä";

    const O1 = tokenize(I1, "finnish", false, tokenizer);
    const O2 = tokenize(I2, "finnish", false, tokenizer);

    t.matchSnapshot(O1, `${t.name}-O1`);
    t.matchSnapshot(O2, `${t.name}-O2`);
  });

  t.test("Should tokenize and stem correctly in danish", t => {
    t.plan(2);

    const { tokenizer } = create({
      schema: {},
      defaultLanguage: "danish",
      tokenizer: {
        stemmingFn: DKStemmer,
        customStopWords: stopWords.danish,
      },
    });

    const I1 = "Søvn er en svær ting, når prøver mislykkes";
    const I2 = "Jeg bagte småkager";

    const O1 = tokenize(I1, "danish", false, tokenizer);
    const O2 = tokenize(I2, "danish", false, tokenizer);

    t.matchSnapshot(O1, `${t.name}-O1`);
    t.matchSnapshot(O2, `${t.name}-O2`);
  });
});

t.test("Custom stop-words rules", t => {
  t.plan(5);

  t.test("custom array of stop-words", t => {
    t.plan(2);

    const { tokenizer } = create({
      schema: {},
      defaultLanguage: "english",
      tokenizer: {
        customStopWords: ["quick", "brown", "fox", "dog"],
      },
    });

    normalizationCache.clear();

    const I1 = "the quick brown fox jumps over the lazy dog";
    const I2 = "I baked some cakes";

    const O1 = tokenize(I1, "english", false, tokenizer);
    const O2 = tokenize(I2, "english", false, tokenizer);

    t.same(O1, ["the", "jump", "over", "lazi"]);
    t.same(O2, ["i", "bake", "some", "cake"]);
  });

  t.test("custom stop-words function", t => {
    t.plan(2);

    const { tokenizer } = create({
      schema: {},
      defaultLanguage: "english",
      tokenizer: {
        customStopWords(words: string[]): string[] {
          return [...words, "quick", "brown", "fox", "dog"];
        },
      },
    });

    normalizationCache.clear();

    const I1 = "the quick brown fox jumps over the lazy dog";
    const I2 = "I baked some cakes";

    const O1 = tokenize(I1, "english", false, tokenizer);
    const O2 = tokenize(I2, "english", false, tokenizer);

    t.same(O1, ["jump", "lazi"]);
    t.same(O2, ["bake", "cake"]);
  });

  t.test("disable stop-words", t => {
    t.plan(2);

    const db = create({
      schema: {},
      defaultLanguage: "english",
      tokenizer: {
        enableStopWords: false,
      },
    });

    normalizationCache.clear();

    const I1 = "the quick brown fox jumps over the lazy dog";
    const I2 = "I baked some cakes";

    const O1 = tokenize(I1, "english", false, db.tokenizer);
    const O2 = tokenize(I2, "english", false, db.tokenizer);

    t.same(O1, ["the", "quick", "brown", "fox", "jump", "over", "lazi", "dog"]);
    t.same(O2, ["i", "bake", "some", "cake"]);
  });

  t.test("disable stemming", t => {
    t.plan(2);

    const { tokenizer } = create({
      schema: {},
      defaultLanguage: "english",
      tokenizer: {
        enableStemming: false,
        customStopWords: stopWords.english,
      },
    });

    normalizationCache.clear();

    const I1 = "the quick brown fox jumps over the lazy dog";
    const I2 = "I baked some cakes";

    const O1 = tokenize(I1, "english", false, tokenizer);
    const O2 = tokenize(I2, "english", false, tokenizer);

    t.same(O1, ["quick", "brown", "fox", "jumps", "lazy", "dog"]);
    t.same(O2, ["baked", "cakes"]);
  });

  t.test("custom stemming function", t => {
    t.plan(2);

    const { tokenizer } = create({
      schema: {},
      defaultLanguage: "english",
      tokenizer: {
        customStopWords: stopWords.english,
        stemmingFn: word => `${word}-ish`,
      },
    });

    normalizationCache.clear();

    const I1 = "the quick brown fox jumps over the lazy dog";
    const I2 = "I baked some cakes";

    const O1 = tokenize(I1, "english", false, tokenizer);
    const O2 = tokenize(I2, "english", false, tokenizer);

    t.same(O1, ["quick-ish", "brown-ish", "fox-ish", "jumps-ish", "lazy-ish", "dog-ish"]);
    t.same(O2, ["baked-ish", "cakes-ish"]);
  });
});
