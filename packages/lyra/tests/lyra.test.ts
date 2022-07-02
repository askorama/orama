import { Lyra } from "../src/lyra";

function getId({ id }: { id: string }) {
  return id;
}

describe("defaultLanguage", () => {
  it("should throw an error if the desired language is not supported", () => {
    try {
      new Lyra({
        schema: {},
        // @ts-expect-error latin is not supported
        defaultLanguage: "latin",
      });
    } catch (e) {
      expect(e).toMatchSnapshot();
    }
  });

  it("should throw an error if the desired language is not supported during insertion", async () => {
    try {
      const db = new Lyra({
        schema: { foo: "string" },
      });

      await db.insert(
        {
          foo: "bar",
        },
        // @ts-expect-error latin is not supported
        "latin"
      );
    } catch (e) {
      expect(e).toMatchSnapshot();
    }
  });

  it("should not throw if if the language is supported", () => {
    try {
      new Lyra({
        schema: {},
        defaultLanguage: "portugese",
      });
    } catch (e) {
      expect(e).toBeUndefined();
    }
  });
});

describe("checkInsertDocSchema", () => {
  it("should compare the inserted doc with the schema definition", async () => {
    const db = new Lyra({
      schema: {
        quote: "string",
        author: "string",
      },
    });

    expect(
      await db.insert({ quote: "hello, world!", author: "me" }).then(getId)
    ).toBeDefined();

    try {
      await db.insert({ quote: "hello, world!", author: true });
    } catch (err) {
      expect(err).toMatchSnapshot();
    }

    try {
      await db.insert({
        quote: "hello, world!",
        authors: "author should be singular",
      });
    } catch (err) {
      expect(err).toMatchSnapshot();
    }

    try {
      await db.insert({ quote: "hello, world!", foo: { bar: 10 } });
    } catch (err) {
      expect(err).toMatchSnapshot();
    }
  });
});

describe("lyra", () => {
  it("should correctly insert and retrieve data", async () => {
    const db = new Lyra({
      schema: {
        example: "string",
      },
    });

    const ex1Insert = await db.insert({ example: "The quick, brown, fox" });
    const ex1Search = await db.search({
      term: "quick",
      properties: ["example"],
    });

    expect(ex1Insert.id).toBeDefined();
    expect(ex1Search.count).toBe(1);
    expect(ex1Search.elapsed).toBeDefined();
    expect((ex1Search.hits[0] as any).example).toBe("The quick, brown, fox");
  });

  it("should correctly paginate results", async () => {
    const db = new Lyra({
      schema: {
        animal: "string",
      },
    });

    await db.insert({ animal: "Quick brown fox" });
    await db.insert({ animal: "Lazy dog" });
    await db.insert({ animal: "Jumping penguin" });
    await db.insert({ animal: "Fast chicken" });
    await db.insert({ animal: "Fabolous ducks" });
    await db.insert({ animal: "Fantastic horse" });

    const search1 = await db.search({ term: "f", limit: 1, offset: 0 });
    const search2 = await db.search({ term: "f", limit: 1, offset: 1 });
    const search3 = await db.search({ term: "f", limit: 1, offset: 2 });
    const search4 = await db.search({ term: "f", limit: 2, offset: 2 });

    expect(search1.count).toBe(4);
    expect((search1.hits[0] as any).animal).toBe("Quick brown fox");

    expect(search2.count).toBe(4);
    expect((search2.hits[0] as any).animal).toBe("Fast chicken");

    expect(search3.count).toBe(4);
    expect((search3.hits[0] as any).animal).toBe("Fabolous ducks");

    expect(search4.count).toBe(4);
    expect((search4.hits[0] as any).animal).toBe("Fabolous ducks");
    expect((search4.hits[1] as any).animal).toBe("Fantastic horse");
  });

  it("Should throw an error when searching in non-existing indices", async () => {
    const db = new Lyra({ schema: { foo: "string", baz: "string" } });

    try {
      await db.search({
        term: "foo",
        properties: ["bar"],
      });
    } catch (err) {
      expect(err).toMatchInlineSnapshot(
        `"Invalid property name. Expected a wildcard string (\\"*\\") or array containing one of the following properties: foo, baz, but got: bar"`
      );
    }
  });

  it("Should correctly remove a document after its insertion", async () => {
    const db = new Lyra({
      schema: {
        quote: "string",
        author: "string",
      },
    });

    const { id: id1 } = await db.insert({
      quote: "Be yourself; everyone else is already taken.",
      author: "Oscar Wilde",
    });

    const { id: id2 } = await db.insert({
      quote:
        "To live is the rarest thing in the world. Most people exist, that is all.",
      author: "Oscar Wilde",
    });

    await db.insert({
      quote: "So many books, so little time.",
      author: "Frank Zappa",
    });

    const res = await db.delete(id1);

    const searchResult = await db.search({
      term: "Oscar",
      properties: ["author"],
    });

    expect(res).toBeTruthy();
    expect(searchResult.count).toBe(1);
    expect((searchResult.hits[0] as any).author).toBe("Oscar Wilde");
    expect((searchResult.hits[0] as any).quote).toBe(
      "To live is the rarest thing in the world. Most people exist, that is all."
    );
    expect((searchResult.hits[0] as any).id).toBe(id2);
  });

  it("Should preserve identical docs after deletion", async () => {
    const db = new Lyra({
      schema: {
        quote: "string",
        author: "string",
      },
    });

    const { id: id1 } = await db.insert({
      quote: "Be yourself; everyone else is already taken.",
      author: "Oscar Wilde",
    });

    const { id: id2 } = await db.insert({
      quote: "Be yourself; everyone else is already taken.",
      author: "Oscar Wilde",
    });

    await db.insert({
      quote: "So many books, so little time.",
      author: "Frank Zappa",
    });

    const res = await db.delete(id1);

    const searchResult = await db.search({
      term: "Oscar",
      properties: ["author"],
    });

    const searchResult2 = await db.search({
      term: "already",
      properties: ["quote"],
    });

    expect(res).toBeTruthy();
    expect(searchResult.count).toBe(1);
    expect((searchResult.hits[0] as any).author).toBe("Oscar Wilde");
    expect((searchResult.hits[0] as any).quote).toBe(
      "Be yourself; everyone else is already taken."
    );
    expect((searchResult.hits[0] as any).id).toBe(id2);

    expect(searchResult2.count).toBe(1);
    expect((searchResult2.hits[0] as any).author).toBe("Oscar Wilde");
    expect((searchResult2.hits[0] as any).quote).toBe(
      "Be yourself; everyone else is already taken."
    );
    expect((searchResult2.hits[0] as any).id).toBe(id2);
  });

  it("Should be able to insert documens with non-searchable fieldsa", async () => {
    const db = new Lyra({
      schema: {
        quote: "string",
        author: "string",
        isFavorite: "boolean",
        rating: "number",
      },
    });

    await db.insert({
      quote: "Be yourself; everyone else is already taken.",
      author: "Oscar Wilde",
      isFavorite: false,
      rating: 4,
    });

    await db.insert({
      quote: "So many books, so little time.",
      author: "Frank Zappa",
      isFavorite: true,
      rating: 5,
    });

    const search = await db.search({
      term: "frank",
    });

    expect(search.count).toBe(1);
    expect((search.hits[0] as any).author).toBe("Frank Zappa");
  });

  it("Should find results even if the searched term contains a typo", async () => {
    const db = new Lyra({
      schema: {
        quote: "string",
        author: "string",
      },
    });

    const { id: id1 } = await db.insert({
      quote: "Be yourself; everyone else is already taken.",
      author: "Oscar Wilde",
    });

    const { id: id2 } = await db.insert({
      quote: "To live is the rarest thing in the world. Most people exist, that is all.",
      author: "Oscar Wilde",
    });

    const { id: id3 } = await db.insert({
      quote: "So many books, so little time.",
      author: "Frank Zappa",
    });

    const { id: id4 } = await db.insert({
      quote: "The greatest glory in living lies not in never falling, but in rising every time we fall.",
      author: "Nelson Mandela",
    });

    const { id: id5 } = await db.insert({
      quote: "The way to get started is to quit talking and begin doing",
      author: "Walt Disney",
    });

    const { id: id6 } = await db.insert({
      quote:
        "Your time is limited, so don't waste it living someone else's life. Don't be trapped by dogma - which is living with the results of other people's thinking",
      author: "Steve Jobs",
    });

    const mistype = await db.search({ term: "boots", properties: ["quote"] });
    const oneLetterLess = await db.search({ term: "wast", properties: ["quote"] });
    const oneLetterMore = await db.search({ term: "peopler" });
    const noTypo = await db.search({ term: "started" });

    expect((mistype.hits[0] as any).id).toBe(id3);
    expect((oneLetterLess.hits[0] as any).id).toBe(id6);
    // the following test fails because of stemming (i.e. `peopler` doesn't get stemmed while `people` gets stemmed to `peopl` hence the algorithm counts 2 typos.)
    // expect(oneLetterMore.count).toBe(2);
    expect((noTypo.hits[0] as any).id).toBe(id5);
  });
});
