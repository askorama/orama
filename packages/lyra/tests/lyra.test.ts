import { create, insert, search, remove } from "../src/lyra";

describe("defaultLanguage", () => {
  it("should throw an error if the desired language is not supported", () => {
    try {
      create({
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
      const db = create({
        schema: { foo: "string" },
      });

      insert(db, 
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
      create({
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
    const db = create({
      schema: {
        quote: "string",
        author: "string",
      },
    });

    expect(
      insert(db, { quote: "hello, world!", author: "me" }).id
    ).toBeDefined();

    try {
      // @ts-expect-error test error case
      insert(db, { quote: "hello, world!", author: true });
    } catch (err) {
      expect(err).toMatchSnapshot();
    }

    try {
      insert(db, {
        quote: "hello, world!",
        // @ts-expect-error test error case
        authors: "author should be singular",
      });
    } catch (err) {
      expect(err).toMatchSnapshot();
    }

    try {
      // @ts-expect-error test error case
      insert(db, { quote: "hello, world!", foo: { bar: 10 } });
    } catch (err) {
      expect(err).toMatchSnapshot();
    }
  });
});

describe("lyra", () => {
  it("should correctly insert and retrieve data", () => {
    const db = create({
      schema: {
        example: "string",
      },
    });

    const ex1Insert = insert(db, { example: "The quick, brown, fox" });
    const ex1Search = search(db, {
      term: "quick",
      properties: ["example"],
    });

    expect(ex1Insert.id).toBeDefined();
    expect(ex1Search.count).toBe(1);
    expect(ex1Search.elapsed).toBeDefined();
    expect(ex1Search.hits[0].example).toBe("The quick, brown, fox");
  });

  it("should correctly paginate results", () => {
    const db = create({
      schema: {
        animal: "string",
      },
    });

    insert(db, { animal: "Quick brown fox" });
    insert(db, { animal: "Lazy dog" });
    insert(db, { animal: "Jumping penguin" });
    insert(db, { animal: "Fast chicken" });
    insert(db, { animal: "Fabolous ducks" });
    insert(db, { animal: "Fantastic horse" });

    const search1 = search(db, { term: "f", limit: 1, offset: 0 });
    const search2 = search(db, { term: "f", limit: 1, offset: 1 });
    const search3 = search(db, { term: "f", limit: 1, offset: 2 });
    const search4 = search(db, { term: "f", limit: 2, offset: 2 });

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
    const db = create({ schema: { foo: "string", baz: "string" } });

    try {
      search(db, {
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
    const db = create({
      schema: {
        quote: "string",
        author: "string",
      },
    });

    const { id: id1 } = insert(db, {
      quote: "Be yourself; everyone else is already taken.",
      author: "Oscar Wilde",
    });

    const { id: id2 } = insert(db, {
      quote:
        "To live is the rarest thing in the world. Most people exist, that is all.",
      author: "Oscar Wilde",
    });

    insert(db, {
      quote: "So many books, so little time.",
      author: "Frank Zappa",
    });

    const res = remove(db, id1);

    const searchResult = search(db, {
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

  it("Shouldn't returns deleted documents", () => {
    const db = create({
      schema: {
        txt: "string",
      },
      stemming: false,
    });

    insert(db, { txt: "stelle" });
    insert(db, { txt: "stellle" });
    insert(db, { txt: "scelte" });

    const searchResult = search(db, { term: "stelle" });

    const id = searchResult.hits[0].id;

    remove(db, id);

    const searchResult2 = search(db, { term: "stelle" });

    expect(searchResult2.count).toBe(1);
  });

  it("Shouldn't affects other document when deleted one", () => {
    const db = create({
      schema: {
        txt: "string",
      },
      stemming: false,
    });

    insert(db, { txt: "abc" });
    insert(db, { txt: "abc" });
    insert(db, { txt: "abcd" });

    const searchResult = search(db, { term: "abc", exact: true });

    const id = searchResult.hits[0].id;
    remove(db, id);

    const searchResult2 = search(db, { term: "abc", exact: true });

    expect(searchResult2.hits.every(({ id: docID }) => docID !== id)).toBeTruthy();
    expect(searchResult2.count).toBe(1);
  });

  it("Should preserve identical docs after deletion", () => {
    const db = create({
      schema: {
        quote: "string",
        author: "string",
      },
    });

    const { id: id1 } = insert(db, {
      quote: "Be yourself; everyone else is already taken.",
      author: "Oscar Wilde",
    });

    const { id: id2 } = insert(db, {
      quote: "Be yourself; everyone else is already taken.",
      author: "Oscar Wilde",
    });

    insert(db, {
      quote: "So many books, so little time.",
      author: "Frank Zappa",
    });

    const res = remove(db, id1);

    const searchResult = search(db, {
      term: "Oscar",
      properties: ["author"],
    });

    const searchResult2 = search(db, {
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
    const db = create({
      schema: {
        quote: "string",
        author: "string",
        isFavorite: "boolean",
        rating: "number",
      },
    });

    insert(db, {
      quote: "Be yourself; everyone else is already taken.",
      author: "Oscar Wilde",
      isFavorite: false,
      rating: 4,
    });

    insert(db, {
      quote: "So many books, so little time.",
      author: "Frank Zappa",
      isFavorite: true,
      rating: 5,
    });

    const searchResult = search(db, {
      term: "frank",
    });

    expect(searchResult.count).toBe(1);
    expect(searchResult.hits[0].author).toBe("Frank Zappa");
  });

  it("Should exact match", () => {
    const db = create({
      schema: {
        author: "string",
        quote: "string",
      },
    });

    insert(db, {
      quote: "Be yourself; everyone else is already taken.",
      author: "Oscar Wilde",
    });

    const partialSearch = search(db, {
      term: "alr",
      exact: true,
    });

    expect(partialSearch.count).toBe(0);

    const exactSearch = search(db, {
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
    const db = create({
      schema: {
        quote: "string",
        author: "string",
      },
    });

    insert(db, {
      quote:
        "Absolutely captivating creatures, seahorses seem like a product of myth and imagination rather than of nature.",
      author: "Sara A. Lourie",
    });

    const searchResult = search(db, {
      term: "seahrse",
      tolerance: 0,
    });

    expect(searchResult.count).toBe(0);
  });

  it("Should tolerate typos", () => {
    const db = create({
      schema: {
        quote: "string",
        author: "string",
      },
    });

    insert(db, {
      quote:
        "Absolutely captivating creatures, seahorses seem like a product of myth and imagination rather than of nature.",
      author: "Sara A. Lourie",
    });

    insert(db, {
      quote:
        "Seahorses look mythical, like dragons, but these magnificent shy creatures are real.",
      author: "Jennifer Keats Curtis",
    });

    const tolerantSearch = search(db, {
      term: "seahrse",
      tolerance: 1,
    });

    expect(tolerantSearch.count).toBe(2);

    const moreTolerantSearch = search(db, {
      term: "sahrse",
      tolerance: 3,
    });

    expect(moreTolerantSearch.count).toBe(2);
  });

  it("Should support nested properties", () => {
    const db = create({
      schema: {
        quote: "string",
        author: {
          name: "string",
          surname: "string",
        },
      },
    });

    insert(db, {
      quote: "Harry Potter, the boy who lived, come to die. Avada kedavra.",
      author: {
        name: "Tom",
        surname: "Riddle",
      },
    });

    insert(db, {
      quote: "I am Homer Simpson.",
      author: {
        name: "Homer",
        surname: "Simpson",
      },
    });

    const resultAuthorSurname = search(db, {
      term: "Riddle",
      properties: ["author.surname"],
    });

    const resultAuthorName = search(db, {
      term: "Riddle",
      properties: ["author.name"],
    });

    const resultSimpsonQuote = search(db, {
      term: "Homer",
      properties: ["quote"],
    });

    const resultSimpsonAuthorName = search(db, {
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
    const db = create({
      schema: {
        quote: "string",
      },
      stemming: false,
    });

    insert(db, {
      quote: "I am baking some cakes",
    });

    const result1 = search(db, {
      term: "bake",
      exact: true,
    });

    const result2 = search(db, {
      term: "bak",
      tolerance: 10,
    });

    // Resoults should be empty as "baking" doesn't get reduced to "bake"
    expect(result1.count).toBe(0);
    expect(result2.count).toBe(1);
  });

  it("Should stem by default", () => {
    const db = create({
      schema: {
        quote: "string",
      },
    });

    insert(db, {
      quote: "I am baking some cakes",
    });

    const result1 = search(db, {
      term: "bake",
      exact: true,
    });

    expect(result1.count).toBe(1);
  });
});
