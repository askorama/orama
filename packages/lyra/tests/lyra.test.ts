import t from "tap";
import { create, insert, search, remove } from "../src/lyra";

t.test("defaultLanguage", t => {
  t.plan(3);

  t.test("should throw an error if the desired language is not supported", t => {
    t.plan(1);

    try {
      create({
        schema: {},
        // @ts-expect-error latin is not supported
        defaultLanguage: "latin",
      });
    } catch (e) {
      t.matchSnapshot(e, t.name);
    }
  });

  t.test("should throw an error if the desired language is not supported during insertion", t => {
    t.plan(1);

    try {
      const db = create({
        schema: { foo: "string" },
      });

      insert(
        db,
        {
          foo: "bar",
        },
        // @ts-expect-error latin is not supported
        { language: "latin" },
      );
    } catch (e) {
      t.matchSnapshot(e, t.name);
    }
  });

  t.test("should not throw if if the language is supported", t => {
    t.plan(1);

    try {
      create({
        schema: {},
        defaultLanguage: "portugese",
      });

      t.pass();
    } catch (e) {
      t.fail();
    }
  });
});

t.test("checkInsertDocSchema", t => {
  t.plan(1);

  t.test("should compare the inserted doc with the schema definition", t => {
    t.plan(4);

    const db = create({
      schema: {
        quote: "string",
        author: "string",
      },
    });

    t.ok(insert(db, { quote: "hello, world!", author: "me" }).id);

    try {
      // @ts-expect-error test error case
      insert(db, { quote: "hello, world!", author: true });
    } catch (err) {
      t.matchSnapshot(err, `${t.name} - 1`);
    }

    try {
      insert(db, {
        quote: "hello, world!",
        // @ts-expect-error test error case
        authors: "author should be singular",
      });
    } catch (err) {
      t.matchSnapshot(err, `${t.name} - 2`);
    }

    try {
      // @ts-expect-error test error case
      insert(db, { quote: "hello, world!", foo: { bar: 10 } });
    } catch (err) {
      t.matchSnapshot(err, `${t.name} - 3`);
    }
  });
});

t.test("lyra", t => {
  t.plan(14);

  t.test("should correctly search for data", t => {
    t.plan(6);

    const db = create({
      schema: {
        quote: "string",
        author: "string",
      },
    });

    insert(db, { quote: "the quick, brown fox jumps over the lazy dog. What a fox!", author: "John Doe" });
    insert(db, { quote: "Foxes are nice animals. But I prefer having a dog.", author: "John Doe" });
    insert(db, { quote: "I like dogs. They are the best.", author: "Jane Doe" });
    insert(db, { quote: "I like cats. They are the best.", author: "Jane Doe" });

    // Exact search
    const result1 = search(db, { term: "fox", exact: true });
    const result2 = search(db, { term: "dog", exact: true });

    t.equal(result1.count, 1);
    t.equal(result2.count, 2);

    // Prefix search
    const result3 = search(db, { term: "fox", exact: false });
    const result4 = search(db, { term: "dog", exact: false });

    t.equal(result3.count, 2);
    t.equal(result4.count, 3);

    // Typo-tolerant search
    const result5 = search(db, { term: "fx", tolerance: 1 });
    const result6 = search(db, { term: "dg", tolerance: 2 });

    t.equal(result5.count, 1);
    t.equal(result6.count, 4);
  });

  t.test("should correctly insert and retrieve data", t => {
    t.plan(4);

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

    t.ok(ex1Insert.id);
    t.equal(ex1Search.count, 1);
    t.ok(ex1Search.elapsed);
    t.equal(ex1Search.hits[0].example, "The quick, brown, fox");
  });

  t.test("should correctly paginate results", t => {
    t.plan(9);

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

    t.equal(search1.count, 4);
    t.equal(search1.hits[0].animal, "Quick brown fox");

    t.equal(search2.count, 4);
    t.equal(search2.hits[0].animal, "Fast chicken");

    t.equal(search3.count, 4);
    t.equal(search3.hits[0].animal, "Fabolous ducks");

    t.equal(search4.count, 4);
    t.equal(search4.hits[0].animal, "Fabolous ducks");
    t.equal(search4.hits[1].animal, "Fantastic horse");
  });

  t.test("Should throw an error when searching in non-existing indices", t => {
    t.plan(1);

    const db = create({ schema: { foo: "string", baz: "string" } });

    t.throws(() => {
      search(db, {
        term: "foo",
        //@ts-expect-error test error case
        properties: ["bar"],
      });
    }, `"Invalid property name. Expected a wildcard string (\\"*\\") or array containing one of the following properties: foo, baz, but got: bar"`);
  });

  t.test("Should correctly remove a document after its insertion", t => {
    t.plan(5);

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
      quote: "To live is the rarest thing in the world. Most people exist, that is all.",
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

    t.ok(res);
    t.equal(searchResult.count, 1);
    t.equal(searchResult.hits[0].author, "Oscar Wilde");
    t.equal(searchResult.hits[0].quote, "To live is the rarest thing in the world. Most people exist, that is all.");
    t.equal(searchResult.hits[0].id, id2);
  });

  t.test("Should remove a document with a nested schema", t => {
    t.plan(4);

    const movieDB = create({
      schema: {
        title: "string",
        director: "string",
        plot: "string",
        year: "number",
        isFavorite: "boolean",
      },
    });

    const { id: harryPotter } = insert(movieDB, {
      title: "Harry Potter and the Philosopher's Stone",
      director: "Chris Columbus",
      plot: "Harry Potter, an eleven-year-old orphan, discovers that he is a wizard and is invited to study at Hogwarts. Even as he escapes a dreary life and enters a world of magic, he finds trouble awaiting him.",
      year: 2001,
      isFavorite: false,
    });

    const testSearch1 = search(movieDB, {
      term: "Harry Potter",
      properties: ["title", "director", "plot"],
    });

    remove(movieDB, harryPotter);

    const testSearch2 = search(movieDB, {
      term: "Harry Potter",
      properties: ["title", "director", "plot"],
    });

    t.ok(testSearch1);
    t.equal(testSearch1.hits[0].title, "Harry Potter and the Philosopher's Stone");

    t.ok(testSearch2);
    t.equal(testSearch2.count, 0);
  });

  t.test("Shouldn't returns deleted documents", t => {
    t.plan(1);

    const db = create({
      schema: {
        txt: "string",
      },
    });

    insert(db, { txt: "stelle" });
    insert(db, { txt: "stellle" });
    insert(db, { txt: "scelte" });

    const searchResult = search(db, { term: "stelle", exact: true });

    const { id } = searchResult.hits[0];

    remove(db, id);

    const searchResult2 = search(db, { term: "stelle", exact: true });

    t.equal(searchResult2.count, 0);
  });

  t.test("Shouldn't affects other document when deleted one", t => {
    t.plan(2);

    const db = create({
      schema: {
        txt: "string",
      },
    });

    insert(db, { txt: "abc" });
    insert(db, { txt: "abc" });
    insert(db, { txt: "abcd" });

    const searchResult = search(db, { term: "abc", exact: true });

    const id = searchResult.hits[0].id;
    remove(db, id);

    const searchResult2 = search(db, { term: "abc", exact: true });

    t.ok(searchResult2.hits.every(({ id: docID }) => docID !== id));
    t.equal(searchResult2.count, 1);
  });

  t.test("Should preserve identical docs after deletion", t => {
    t.plan(9);

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

    t.ok(res);
    t.equal(searchResult.count, 1);
    t.equal(searchResult.hits[0].author, "Oscar Wilde");
    t.equal(searchResult.hits[0].quote, "Be yourself; everyone else is already taken.");
    t.equal(searchResult.hits[0].id, id2);

    t.equal(searchResult2.count, 1);
    t.equal(searchResult2.hits[0].author, "Oscar Wilde");
    t.equal(searchResult2.hits[0].quote, "Be yourself; everyone else is already taken.");
    t.equal(searchResult2.hits[0].id, id2);
  });

  t.test("Should be able to insert documens with non-searchable fields", t => {
    t.plan(2);

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

    t.equal(searchResult.count, 1);
    t.equal(searchResult.hits[0].author, "Frank Zappa");
  });

  t.test("Should exact match", t => {
    t.plan(4);

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

    t.equal(partialSearch.count, 0);

    const exactSearch = search(db, {
      term: "already",
      exact: true,
    });

    t.equal(exactSearch.count, 1);
    t.equal(exactSearch.hits[0].quote, "Be yourself; everyone else is already taken.");
    t.equal(exactSearch.hits[0].author, "Oscar Wilde");
  });

  t.test("Shouldn't tolerate typos", t => {
    t.plan(1);

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

    t.equal(searchResult.count, 0);
  });

  t.test("Should tolerate typos", t => {
    t.plan(2);

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
      quote: "Seahorses look mythical, like dragons, but these magnificent shy creatures are real.",
      author: "Jennifer Keats Curtis",
    });

    const tolerantSearch = search(db, {
      term: "seahrse",
      tolerance: 2,
    });

    t.equal(tolerantSearch.count, 2);

    const moreTolerantSearch = search(db, {
      term: "sahrse",
      tolerance: 5,
    });

    t.equal(moreTolerantSearch.count, 2);
  });

  t.test("Should support nested properties", t => {
    t.plan(4);

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

    t.equal(resultSimpsonAuthorName.count, 1);
    t.equal(resultSimpsonQuote.count, 1);
    t.equal(resultAuthorSurname.count, 1);
    t.equal(resultAuthorName.count, 0);
  });
});
