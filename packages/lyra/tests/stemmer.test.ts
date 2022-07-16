import { stemArray } from "../src/stemmer";

describe("stemmer", () => {
  it("Should stem correctly in dutch", async () => {
    // some words in dutch
    const input: string[] = ["banken"];

    // the expected output
    const expected = ["bank"];

    const output = stemArray(input, "dutch");

    expect(output).toEqual(expected);
  });

  it("Should stem correctly in english", async () => {
    // some words in english
    const input: string[] = ["awesome"];

    // the expected output
    const expected = ["awesom"];

    const output = stemArray(input, "english");

    expect(output).toEqual(expected);
  });

  it("Should stem correctly in french", async () => {
    // some words in french
    const input: string[] = ["haussant"];

    // the expected output
    const expected = ["hauss"];

    const output = stemArray(input, "french");

    expect(output).toEqual(expected);
  });

  it("Should stem correctly in italian", async () => {
    // some words in italian
    const input: string[] = ["indicatore"];

    // the expected output
    const expected = ["indic"];

    const output = stemArray(input, "italian");

    expect(output).toEqual(expected);
  });

  it("Should stem correctly in norwegian", async () => {
    // some words in norwegian
    const input: string[] = ["hjemlet"];

    // the expected output
    const expected = ["hjeml"];

    const output = stemArray(input, "norwegian");

    expect(output).toEqual(expected);
  });

  it("Should stem correctly in portugese", async () => {
    // some words in portugese
    const input: string[] = ["velhas"];

    // the expected output
    const expected = ["velh"];

    const output = stemArray(input, "portugese");

    expect(output).toEqual(expected);
  });

  it("Should stem correctly in russian", async () => {
    // some words in russian
    const input: string[] = ["вагоне"];

    // the expected output
    const expected = ["вагон"];

    const output = stemArray(input, "russian");

    expect(output).toEqual(expected);
  });

  it("Should stem correctly in spanish", async () => {
    // some words in spanish
    const input: string[] = ["avenida"];

    // the expected output
    const expected = ["aven"];

    const output = stemArray(input, "spanish");

    expect(output).toEqual(expected);
  });

  it("Should stem correctly in swedish", async () => {
    // some words in swedish
    const input: string[] = ["jemförelser"];

    // the expected output
    const expected = ["jemför"];

    const output = stemArray(input, "swedish");

    expect(output).toEqual(expected);
  });
});
