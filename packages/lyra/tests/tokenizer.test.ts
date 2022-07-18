import { stemArray } from "../src/stemmer";
import { tokenize } from "../src/tokenizer";

it("Should tokenize and stem correctly in english", () => {
  const I1 = "the quick brown fox jumps over the lazy dog";
  const I2 = "I baked some cakes";

  const O1 = tokenize(I1, "english");
  const O2 = tokenize(I2, "english");

  expect(O1).toMatchSnapshot();
  expect(O2).toMatchSnapshot();
});

it("Should tokenize and stem correctly in french", () => {
  const I1 = "voyons quel temps il fait dehors";
  const I2 = "j'ai fait des gâteaux";

  const O1 = tokenize(I1, "french");
  const O2 = tokenize(I2, "french");

  expect(O1).toMatchSnapshot();
  expect(O2).toMatchSnapshot();
});

it("Should tokenize and stem correctly in italian", () => {
  const I1 = "ho cucinato delle torte";
  const I2 = "dormire è una cosa difficile quando i test non passano";

  const O1 = tokenize(I1, "italian");
  const O2 = tokenize(I2, "italian");

  expect(O1).toMatchSnapshot();
  expect(O2).toMatchSnapshot();
});

it("Should tokenize and stem correctly in norwegian", () => {
  const I1 = "Jeg kokte noen kaker";
  const I2 = "å sove er en vanskelig ting når testene mislykkes";

  const O1 = tokenize(I1, "norwegian");
  const O2 = tokenize(I2, "norwegian");

  expect(O1).toMatchSnapshot();
  expect(O2).toMatchSnapshot();
});

it("Should tokenize and stem correctly in portugese", () => {
  const I1 = "Eu cozinhei alguns bolos";
  const I2 = "dormir é uma coisa difícil quando os testes falham";

  const O1 = tokenize(I1, "portugese");
  const O2 = tokenize(I2, "portugese");

  expect(O1).toMatchSnapshot();
  expect(O2).toMatchSnapshot();
});

it("Should tokenize and stem correctly in russian", () => {
  const I1 = "я приготовила пирожные";
  const I2 = "спать трудно, когда тесты не срабатывают";

  const O1 = tokenize(I1, "russian");
  const O2 = tokenize(I2, "russian");

  expect(O1).toMatchSnapshot();
  expect(O2).toMatchSnapshot();
});

it("Should tokenize and stem correctly in swedish", () => {
  const I1 = "Jag lagade några kakor";
  const I2 = "att sova är en svår sak när testerna misslyckas";

  const O1 = tokenize(I1, "swedish");
  const O2 = tokenize(I2, "swedish");

  expect(O1).toMatchSnapshot();
  expect(O2).toMatchSnapshot();
});

it.skip("Should tokenize and stem correctly in spanish", () => {
  const I1 = "cociné unos pasteles";
  const I2 = "dormir es algo dificil cuando las pruebas fallan";

  const O1 = tokenize(I1, "spanish");
  const O2 = tokenize(I2, "spanish");

  expect(O1).toMatchSnapshot();
  expect(O2).toMatchSnapshot();
});

it.skip("Should tokenize and stem correctly in dutch", () => {
  const I1 = "de kleine koeien";
  const I2 = "Ik heb wat taarten gemaakt";

  const O1 = tokenize(I1, "dutch");
  const O2 = tokenize(I2, "dutch");

  expect(O1).toMatchSnapshot();
  expect(O2).toMatchSnapshot();
});

it("Should stem an array correctly in dutch", async () => {
  // some words in dutch
  const input: string[] = ["banken"];

  // the expected output
  const expected = ["bank"];

  const output = stemArray(input, "dutch");

  expect(output).toEqual(expected);
});

it("Should stem an array correctly in english", async () => {
  // some words in english
  const input: string[] = ["awesome"];

  // the expected output
  const expected = ["awesom"];

  const output = stemArray(input, "english");

  expect(output).toEqual(expected);
});

it("Should stem an array correctly in french", async () => {
  // some words in french
  const input: string[] = ["haussant"];

  // the expected output
  const expected = ["hauss"];

  const output = stemArray(input, "french");

  expect(output).toEqual(expected);
});

it("Should stem an array correctly in italian", async () => {
  // some words in italian
  const input: string[] = ["indicatore"];

  // the expected output
  const expected = ["indic"];

  const output = stemArray(input, "italian");

  expect(output).toEqual(expected);
});

it("Should stem an array correctly in norwegian", async () => {
  // some words in norwegian
  const input: string[] = ["hjemlet"];

  // the expected output
  const expected = ["hjeml"];

  const output = stemArray(input, "norwegian");

  expect(output).toEqual(expected);
});

it("Should stem an array correctly in portugese", async () => {
  // some words in portugese
  const input: string[] = ["velhas"];

  // the expected output
  const expected = ["velh"];

  const output = stemArray(input, "portugese");

  expect(output).toEqual(expected);
});

it("Should stem an array correctly in russian", async () => {
  // some words in russian
  const input: string[] = ["вагоне"];

  // the expected output
  const expected = ["вагон"];

  const output = stemArray(input, "russian");

  expect(output).toEqual(expected);
});

it("Should stem an array correctly in spanish", async () => {
  // some words in spanish
  const input: string[] = ["avenida"];

  // the expected output
  const expected = ["aven"];

  const output = stemArray(input, "spanish");

  expect(output).toEqual(expected);
});

it("Should stem an array correctly in swedish", async () => {
  // some words in swedish
  const input: string[] = ["jemförelser"];

  // the expected output
  const expected = ["jemför"];

  const output = stemArray(input, "swedish");

  expect(output).toEqual(expected);
});
