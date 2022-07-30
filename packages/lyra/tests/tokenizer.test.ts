import t from "tap";
import { tokenize } from "../src/tokenizer";

t.test("Tokenizer", t => {
  t.plan(11);

  t.test("Should tokenize and stem correctly in english", t => {
    t.plan(2);

    const I1 = "the quick brown fox jumps over the lazy dog";
    const I2 = "I baked some cakes";

    const O1 = tokenize(I1, "english");
    const O2 = tokenize(I2, "english");

    t.matchSnapshot(O1, `${t.name}-O1`);
    t.matchSnapshot(O2, `${t.name}-O2`);
  });

  t.test("Should tokenize and stem correctly in french", t => {
    t.plan(2);

    const I1 = "voyons quel temps il fait dehors";
    const I2 = "j'ai fait des gâteaux";

    const O1 = tokenize(I1, "french");
    const O2 = tokenize(I2, "french");

    t.matchSnapshot(O1, `${t.name}-O1`);
    t.matchSnapshot(O2, `${t.name}-O2`);
  });

  t.test("Should tokenize and stem correctly in italian", t => {
    t.plan(2);

    const I1 = "ho cucinato delle torte";
    const I2 = "dormire è una cosa difficile quando i test non passano";

    const O1 = tokenize(I1, "italian");
    const O2 = tokenize(I2, "italian");

    t.matchSnapshot(O1, `${t.name}-O1`);
    t.matchSnapshot(O2, `${t.name}-O2`);
  });

  t.test("Should tokenize and stem correctly in norwegian", t => {
    t.plan(2);

    const I1 = "Jeg kokte noen kaker";
    const I2 = "å sove er en vanskelig ting når testene mislykkes";

    const O1 = tokenize(I1, "norwegian");
    const O2 = tokenize(I2, "norwegian");

    t.matchSnapshot(O1, `${t.name}-O1`);
    t.matchSnapshot(O2, `${t.name}-O2`);
  });

  t.test("Should tokenize and stem correctly in portugese", t => {
    t.plan(2);

    const I1 = "Eu cozinhei alguns bolos";
    const I2 = "dormir é uma coisa difícil quando os testes falham";

    const O1 = tokenize(I1, "portugese");
    const O2 = tokenize(I2, "portugese");

    t.matchSnapshot(O1, `${t.name}-O1`);
    t.matchSnapshot(O2, `${t.name}-O2`);
  });

  t.test("Should tokenize and stem correctly in russian", t => {
    t.plan(2);

    const I1 = "я приготовила пирожные";
    const I2 = "спать трудно, когда тесты не срабатывают";

    const O1 = tokenize(I1, "russian");
    const O2 = tokenize(I2, "russian");

    t.matchSnapshot(O1, `${t.name}-O1`);
    t.matchSnapshot(O2, `${t.name}-O2`);
  });

  t.test("Should tokenize and stem correctly in swedish", t => {
    t.plan(2);

    const I1 = "Jag lagade några kakor";
    const I2 = "att sova är en svår sak när testerna misslyckas";

    const O1 = tokenize(I1, "swedish");
    const O2 = tokenize(I2, "swedish");

    t.matchSnapshot(O1, `${t.name}-O1`);
    t.matchSnapshot(O2, `${t.name}-O2`);
  });

  t.test("Should tokenize and stem correctly in spanish", t => {
    t.plan(2);

    const I1 = "cociné unos pasteles";
    const I2 = "dormir es algo dificil cuando las pruebas fallan";

    const O1 = tokenize(I1, "spanish");
    const O2 = tokenize(I2, "spanish");

    t.matchSnapshot(O1, `${t.name}-O1`);
    t.matchSnapshot(O2, `${t.name}-O2`);
  });

  t.test("Should tokenize and stem correctly in dutch", t => {
    t.plan(2);

    const I1 = "de kleine koeien";
    const I2 = "Ik heb wat taarten gemaakt";

    const O1 = tokenize(I1, "dutch");
    const O2 = tokenize(I2, "dutch");

    t.matchSnapshot(O1, `${t.name}-O1`);
    t.matchSnapshot(O2, `${t.name}-O2`);
  });

  t.test("Should tokenize maintaining duplicates", t => {
    t.plan(2);

    const I1 = "This phrase contains some duplicates. Duplicates you said?";
    const I2 = "It's alive! It's alive!";

    const O1 = tokenize(I1, "english", true);
    const O2 = tokenize(I2, "english", true);

    t.matchSnapshot(O1, `${t.name}-O1`);
    t.matchSnapshot(O2, `${t.name}-O2`);
  });

  t.test("Should tokenize disabling duplicates", t => {
    t.plan(2);

    const I1 = "This phrase contains some duplicates. Duplicates you said?";
    const I2 = "It's alive! It's alive!";

    const O1 = tokenize(I1, "english", false);
    const O2 = tokenize(I2, "english", false);

    t.matchSnapshot(O1, `${t.name}-O1`);
    t.matchSnapshot(O2, `${t.name}-O2`);
  });
});
