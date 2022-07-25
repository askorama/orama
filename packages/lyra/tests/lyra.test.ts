import { Lyra } from "../src/lyra";

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

  it("should throw an error if the desired language is not supported during insertion", () => {
    try {
      const db = new Lyra({
        schema: { foo: "string" },
      });

      db.insert(
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
  it("should compare the inserted doc with the schema definition", () => {
    const db = new Lyra({
      schema: {
        quote: "string",
        author: "string",
      },
    });

    expect(
      db.insert({ quote: "hello, world!", author: "me" }).id
    ).toBeDefined();

    try {
      // @ts-expect-error test error case
      db.insert({ quote: "hello, world!", author: true });
    } catch (err) {
      expect(err).toMatchSnapshot();
    }

    try {
      db.insert({
        quote: "hello, world!",
        // @ts-expect-error test error case
        authors: "author should be singular",
      });
    } catch (err) {
      expect(err).toMatchSnapshot();
    }

    try {
      // @ts-expect-error test error case
      db.insert({ quote: "hello, world!", foo: { bar: 10 } });
    } catch (err) {
      expect(err).toMatchSnapshot();
    }
  });
});

describe("lyra", () => {
  it("should correctly insert and retrieve data", () => {
    const db = new Lyra({
      schema: {
        example: "string",
      },
    });

    const ex1Insert = db.insert({ example: "The quick, brown, fox" });
    const ex1Search = db.search({
      term: "quick",
      properties: ["example"],
    });

    expect(ex1Insert.id).toBeDefined();
    expect(ex1Search.count).toBe(1);
    expect(ex1Search.elapsed).toBeDefined();
    expect(ex1Search.hits[0].example).toBe("The quick, brown, fox");
  });

  it("should correctly paginate results", () => {
    const db = new Lyra({
      schema: {
        animal: "string",
      },
    });

    db.insert({ animal: "Quick brown fox" });
    db.insert({ animal: "Lazy dog" });
    db.insert({ animal: "Jumping penguin" });
    db.insert({ animal: "Fast chicken" });
    db.insert({ animal: "Fabolous ducks" });
    db.insert({ animal: "Fantastic horse" });

    const search1 = db.search({ term: "f", limit: 1, offset: 0 });
    const search2 = db.search({ term: "f", limit: 1, offset: 1 });
    const search3 = db.search({ term: "f", limit: 1, offset: 2 });
    const search4 = db.search({ term: "f", limit: 2, offset: 2 });

    expect(search1.count).toBe(4);
    expect(search1.hits[0].animal).toBe("Quick brown fox");

    expect(search2.count).toBe(4);
    expect(search2.hits[0].animal).toBe("Fast chicken");

    expect(search3.count).toBe(4);
    expect(search3.hits[0].animal).toBe("Fabolous ducks");

    expect(search4.count).toBe(4);
    expect(search4.hits[0].animal).toBe("Fabolous ducks");
    expect(search4.hits[1].animal).toBe("Fantastic horse");
  });

  it("Should throw an error when searching in non-existing indices", () => {
    const db = new Lyra({ schema: { foo: "string", baz: "string" } });

    try {
      db.search({
        term: "foo",
        //@ts-expect-error test error case
        properties: ["bar"],
      });
    } catch (err) {
      expect(err).toMatchInlineSnapshot(
        `"Invalid property name. Expected a wildcard string (\\"*\\") or array containing one of the following properties: foo, baz, but got: bar"`
      );
    }
  });

  it("Should correctly remove a document after its insertion", () => {
    const db = new Lyra({
      schema: {
        quote: "string",
        author: "string",
      },
    });

    const { id: id1 } = db.insert({
      quote: "Be yourself; everyone else is already taken.",
      author: "Oscar Wilde",
    });

    const { id: id2 } = db.insert({
      quote:
        "To live is the rarest thing in the world. Most people exist, that is all.",
      author: "Oscar Wilde",
    });

    db.insert({
      quote: "So many books, so little time.",
      author: "Frank Zappa",
    });

    const res = db.delete(id1);

    const searchResult = db.search({
      term: "Oscar",
      properties: ["author"],
    });

    expect(res).toBeTruthy();
    expect(searchResult.count).toBe(1);
    expect(searchResult.hits[0].author).toBe("Oscar Wilde");
    expect(searchResult.hits[0].quote).toBe(
      "To live is the rarest thing in the world. Most people exist, that is all."
    );
    expect(searchResult.hits[0].id).toBe(id2);
  });

  it("Should preserve identical docs after deletion", () => {
    const db = new Lyra({
      schema: {
        quote: "string",
        author: "string",
      },
    });

    const { id: id1 } = db.insert({
      quote: "Be yourself; everyone else is already taken.",
      author: "Oscar Wilde",
    });

    const { id: id2 } = db.insert({
      quote: "Be yourself; everyone else is already taken.",
      author: "Oscar Wilde",
    });

    db.insert({
      quote: "So many books, so little time.",
      author: "Frank Zappa",
    });

    const res = db.delete(id1);

    const searchResult = db.search({
      term: "Oscar",
      properties: ["author"],
    });

    const searchResult2 = db.search({
      term: "already",
      properties: ["quote"],
    });

    expect(res).toBeTruthy();
    expect(searchResult.count).toBe(1);
    expect(searchResult.hits[0].author).toBe("Oscar Wilde");
    expect(searchResult.hits[0].quote).toBe(
      "Be yourself; everyone else is already taken."
    );
    expect(searchResult.hits[0].id).toBe(id2);

    expect(searchResult2.count).toBe(1);
    expect(searchResult2.hits[0].author).toBe("Oscar Wilde");
    expect(searchResult2.hits[0].quote).toBe(
      "Be yourself; everyone else is already taken."
    );
    expect(searchResult2.hits[0].id).toBe(id2);
  });

  it("Should be able to insert documens with non-searchable fields", () => {
    const db = new Lyra({
      schema: {
        quote: "string",
        author: "string",
        isFavorite: "boolean",
        rating: "number",
      },
    });

    db.insert({
      quote: "Be yourself; everyone else is already taken.",
      author: "Oscar Wilde",
      isFavorite: false,
      rating: 4,
    });

    db.insert({
      quote: "So many books, so little time.",
      author: "Frank Zappa",
      isFavorite: true,
      rating: 5,
    });

    const search = db.search({
      term: "frank",
    });

    expect(search.count).toBe(1);
    expect(search.hits[0].author).toBe("Frank Zappa");
  });

  it("Should exact match", () => {
    const db = new Lyra({
      schema: {
        author: "string",
        quote: "string",
      },
    });

    db.insert({
      quote: "Be yourself; everyone else is already taken.",
      author: "Oscar Wilde",
    });

    const partialSearch = db.search({
      term: "alr",
      exact: true,
    });

    expect(partialSearch.count).toBe(0);

    const exactSearch = db.search({
      term: "already",
      exact: true,
    });

    expect(exactSearch.count).toBe(1);
    expect(exactSearch.hits[0].quote).toBe(
      "Be yourself; everyone else is already taken."
    );
    expect(exactSearch.hits[0].author).toBe("Oscar Wilde");
  });

  it("Shouldn't tolerate typos", () => {
    const db = new Lyra({
      schema: {
        quote: "string",
        author: "string",
      },
    });

    db.insert({
      quote:
        "Absolutely captivating creatures, seahorses seem like a product of myth and imagination rather than of nature.",
      author: "Sara A. Lourie",
    });

    const search = db.search({
      term: "seahrse",
      tolerance: 0,
    });

    expect(search.count).toBe(0);
  });

  it("Should tolerate typos", () => {
    const db = new Lyra({
      schema: {
        quote: "string",
        author: "string",
      },
    });

    db.insert({
      quote:
        "Absolutely captivating creatures, seahorses seem like a product of myth and imagination rather than of nature.",
      author: "Sara A. Lourie",
    });

    db.insert({
      quote:
        "Seahorses look mythical, like dragons, but these magnificent shy creatures are real.",
      author: "Jennifer Keats Curtis",
    });

    const tolerantSearch = db.search({
      term: "seahrse",
      tolerance: 1,
    });

    expect(tolerantSearch.count).toBe(2);

    const moreTolerantSearch = db.search({
      term: "sahrse",
      tolerance: 3,
    });

    expect(moreTolerantSearch.count).toBe(2);
  });

  it("Should support nested properties", () => {
    const db = new Lyra({
      schema: {
        quote: "string",
        author: {
          name: "string",
          surname: "string",
        },
      },
    });

    db.insert({
      quote: "Harry Potter, the boy who lived, come to die. Avada kedavra.",
      author: {
        name: "Tom",
        surname: "Riddle",
      },
    });

    db.insert({
      quote: "I am Homer Simpson.",
      author: {
        name: "Homer",
        surname: "Simpson",
      },
    });

    const resultAuthorSurname = db.search({
      term: "Riddle",
      properties: ["author.surname"],
    });

    const resultAuthorName = db.search({
      term: "Riddle",
      properties: ["author.name"],
    });

    const resultSimpsonQuote = db.search({
      term: "Homer",
      properties: ["quote"],
    });

    const resultSimpsonAuthorName = db.search({
      term: "Homer",
      properties: ["author.name"],
    });

    expect(resultSimpsonAuthorName.count).toBe(1);
    expect(resultSimpsonQuote.count).toBe(1);
    expect(resultAuthorSurname.count).toBe(1);
    expect(resultAuthorName.count).toBe(0);
  });
});

describe("Disable stemming", () => {
  it("Should disable stemming globally", () => {
    const db = new Lyra({
      schema: {
        quote: "string",
      },
      stemming: false,
    });

    db.insert({
      quote: "I am baking some cakes",
    });

    const result1 = db.search({
      term: "bake",
      exact: true,
    });

    const result2 = db.search({
      term: "bak",
      tolerance: 10,
    });

    // Resoults should be empty as "baking" doesn't get reduced to "bake"
    expect(result1.count).toBe(0);
    expect(result2.count).toBe(1);
  });

  it("Should stem by default", () => {
    const db = new Lyra({
      schema: {
        quote: "string",
      },
    });

    db.insert({
      quote: "I am baking some cakes",
    });

    const result1 = db.search({
      term: "bake",
      exact: true,
    });

    expect(result1.count).toBe(1);
  });
});
