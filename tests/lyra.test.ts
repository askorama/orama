import t from "tap";
import {
  create,
  insert,
  insertBatch,
  insertWithHooks,
  PropertiesSchema,
  remove,
  RetrievedDoc,
  search,
} from "../src/lyra";

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
        defaultLanguage: "portuguese",
      });

      t.pass();
    } catch (e) {
      t.fail();
    }
  });
});

t.test("checkInsertDocSchema", t => {
  t.plan(3);

  t.test("should compare the inserted doc with the schema definition", t => {
    t.plan(2);

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
  });

  t.test("should allow doc with missing schema keys to be inserted without indexing those keys", t => {
    t.plan(6);
    const db = create({
      schema: {
        quote: "string",
        author: "string",
      },
    });
    insert(db, {
      quote: "hello, world!",
      // @ts-expect-error test error case
      authors: "author should be singular",
    });

    t.ok(Object.keys(db.docs).length === 1);

    const docWithExtraKey = { quote: "hello, world!", foo: { bar: 10 } };
    // @ts-expect-error test error case
    const insertedInfo = insert(db, docWithExtraKey);
    t.ok(insertedInfo.id);
    t.equal(Object.keys(db.docs).length, 2);
    t.ok(
      insertedInfo.id in db.docs &&
        // @ts-expect-error test error case
        "foo" in db.docs[insertedInfo.id],
    );
    // @ts-expect-error test error case
    t.same(docWithExtraKey.foo, db.docs[insertedInfo.id].foo);
    t.notOk(db.index.foo);
  });

  t.test(
    "should allow doc with missing schema keys to be inserted without indexing those keys - nested schema version",
    t => {
      t.plan(6);
      const db = create({
        schema: {
          quote: "string",
          author: {
            name: "string",
            surname: "string",
          },
          tag: {
            name: "string",
            description: "string",
          },
          isFavorite: "boolean",
          rating: "number",
        },
      });
      const nestedExtraKeyDoc = {
        quote: "So many books, so little time.",
        author: {
          name: "Frank",
          surname: "Zappa",
        },
        tag: {
          name: "books",
          description: "Quotes about books",
          unexpectedNestedProperty: "amazing",
        },
        isFavorite: false,
        rating: 5,
        unexpectedProperty: "wow",
      };
      const insertedInfo = insert(db, nestedExtraKeyDoc);

      t.ok(insertedInfo.id);
      t.equal(Object.keys(db.docs).length, 1);

      // @ts-expect-error test error case
      t.same(nestedExtraKeyDoc.unexpectedProperty, db.docs[insertedInfo.id].unexpectedProperty);
      // @ts-expect-error test error case
      t.same(nestedExtraKeyDoc.tag.unexpectedNestedProperty, db.docs[insertedInfo.id].tag.unexpectedNestedProperty);
      t.notOk(db.index.unexpectedProperty);
      t.notOk(db.index["tag.unexpectedProperty"]);
    },
  );
});
t.test("lyra", t => {
  t.plan(19);

  t.test("should correctly search for data", async t => {
    t.plan(8);

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
    const result1 = await search(db, { term: "fox", exact: true });
    const result2 = await search(db, { term: "dog", exact: true });

    t.equal(result1.count, 2);
    t.equal(result2.count, 3);

    // Prefix search
    const result3 = await search(db, { term: "fox", exact: false });
    const result4 = await search(db, { term: "dog", exact: false });

    t.equal(result3.count, 2);
    t.equal(result4.count, 3);

    // Typo-tolerant search
    const result5 = await search(db, { term: "fx", tolerance: 1 });
    const result6 = await search(db, { term: "dg", tolerance: 2 });

    t.equal(result5.count, 2);
    t.equal(result6.count, 4);

    // Long string search (Tests for https://github.com/LyraSearch/lyra/issues/159 )
    const result7 = await search(db, { term: "They are the best" });
    const result8 = await search(db, { term: "Foxes are nice animals" });

    t.equal(result7.count, 2);
    t.equal(result8.count, 1);
  });

  t.test("should correctly search for data returning doc including with unindexed keys", async t => {
    t.plan(4);

    const db = create({
      schema: {
        quote: "string",
        author: "string",
      },
    });

    const documentWithUnindexedField = {
      quote: "I like cats. They are the best.",
      author: "Jane Doe",
      unindexedField: "unindexedValue",
    };
    const documentWithNestedUnindexedField = {
      quote: "Foxes are nice animals. But I prefer having a dog.",
      author: "John Doe",
      nested: { unindexedNestedField: "unindexedNestedValue" },
    };

    insert(db, documentWithNestedUnindexedField);
    insert(db, documentWithUnindexedField);

    const result1 = await search(db, { term: "They are the best" });
    const result2 = await search(db, { term: "Foxes are nice animals" });

    t.equal(result1.count, 1);
    t.equal(result2.count, 1);
    t.same(result1.hits[0].document, documentWithUnindexedField);
    t.same(result2.hits[0].document, documentWithNestedUnindexedField);
  });

  t.test("should not found any doc if searching by unindexed field value", async t => {
    t.plan(2);

    const db = create({
      schema: {
        quote: "string",
        author: "string",
      },
    });

    insert(db, {
      quote: "I like dogs. They are the best.",
      author: "Jane Doe",
      //@ts-expect-error test error case
      nested: { unindexedNestedField: "unindexedNestedValue" },
    });
    //@ts-expect-error test error case
    insert(db, { quote: "I like cats. They are the best.", author: "Jane Doe", unindexedField: "unindexedValue" });

    const result1 = await search(db, { term: "unindexedNestedValue" });
    const result2 = await search(db, { term: "unindexedValue" });

    t.equal(result1.count, 0);
    t.equal(result2.count, 0);
  });

  t.test("should correctly insert and retrieve data", async t => {
    t.plan(4);

    const db = create({
      schema: {
        example: "string",
      },
    });

    const ex1Insert = insert(db, { example: "The quick, brown, fox" });
    const ex1Search = await search(db, {
      term: "quick",
      properties: ["example"],
    });

    t.ok(ex1Insert.id);
    t.equal(ex1Search.count, 1);
    t.ok(ex1Search.elapsed);
    t.equal(ex1Search.hits[0].document.example, "The quick, brown, fox");
  });

  t.test("should correctly paginate results", async t => {
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

    const search1 = await search(db, { term: "f", limit: 1, offset: 0 });
    const search2 = await search(db, { term: "f", limit: 1, offset: 1 });
    const search3 = await search(db, { term: "f", limit: 1, offset: 2 });
    const search4 = await search(db, { term: "f", limit: 2, offset: 2 });

    t.equal(search1.count, 4);
    t.equal(search1.hits[0].document.animal, "Quick brown fox");

    t.equal(search2.count, 4);
    t.equal(search2.hits[0].document.animal, "Fast chicken");

    t.equal(search3.count, 4);
    t.equal(search3.hits[0].document.animal, "Fabolous ducks");

    t.equal(search4.count, 4);
    t.equal(search4.hits[0].document.animal, "Fabolous ducks");
    t.equal(search4.hits[1].document.animal, "Fantastic horse");
  });

  t.test("Should throw an error when searching in non-existing indices", async t => {
    t.plan(1);

    const db = create({ schema: { foo: "string", baz: "string" } });

    try {
      await search(db, {
        term: "foo",
        //@ts-expect-error test error case
        properties: ["bar"],
      });
    } catch (e) {
      t.same(
        e,
        Error(
          `Invalid property name. Expected a wildcard string ("*") or array containing one of the following properties: foo, baz, but got: bar`,
        ),
      );
    }
  });

  t.test("Should correctly remove a document after its insertion", async t => {
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

    const searchResult = await search(db, {
      term: "Oscar",
      properties: ["author"],
    });

    t.ok(res);
    t.equal(searchResult.count, 1);
    t.equal(searchResult.hits[0].document.author, "Oscar Wilde");
    t.equal(
      searchResult.hits[0].document.quote,
      "To live is the rarest thing in the world. Most people exist, that is all.",
    );
    t.equal(searchResult.hits[0].id, id2);
  });

  // Tests for https://github.com/nearform/lyra/issues/52
  t.test("Should correctly remove documents via substring search", async t => {
    t.plan(1);

    const lyra = create({
      schema: {
        word: "string",
      },
    });

    const { id: halo } = insert(lyra, { word: "Halo" });
    insert(lyra, { word: "Halloween" });
    insert(lyra, { word: "Hal" });

    remove(lyra, halo);

    const searchResult = await search(lyra, {
      term: "Hal",
    });

    t.equal(searchResult.count, 2);
  });

  t.test("Should remove a document with a nested schema", async t => {
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

    const testSearch1 = await search(movieDB, {
      term: "Harry Potter",
      properties: ["title", "director", "plot"],
    });

    remove(movieDB, harryPotter);

    const testSearch2 = await search(movieDB, {
      term: "Harry Potter",
      properties: ["title", "director", "plot"],
    });

    t.ok(testSearch1);
    t.equal(testSearch1.hits[0].document.title, "Harry Potter and the Philosopher's Stone");

    t.ok(testSearch2);
    t.equal(testSearch2.count, 0);
  });

  t.test("Shouldn't returns deleted documents", async t => {
    t.plan(1);

    const db = create({
      schema: {
        txt: "string",
      },
    });

    insert(db, { txt: "stelle" });
    insert(db, { txt: "stellle" });
    insert(db, { txt: "scelte" });

    const searchResult = await search(db, { term: "stelle", exact: true });

    const { id } = searchResult.hits[0];

    remove(db, id);

    const searchResult2 = await search(db, { term: "stelle", exact: true });

    t.equal(searchResult2.count, 0);
  });

  t.test("Shouldn't affects other document when deleted one", async t => {
    t.plan(2);

    const db = create({
      schema: {
        txt: "string",
      },
    });

    insert(db, { txt: "abc" });
    insert(db, { txt: "abc" });
    insert(db, { txt: "abcd" });

    const searchResult = await search(db, { term: "abc", exact: true });

    const id = searchResult.hits[0].id;
    remove(db, id);

    const searchResult2 = await search(db, { term: "abc", exact: true });

    t.ok(searchResult2.hits.every(({ id: docID }) => docID !== id));
    t.equal(searchResult2.count, 1);
  });

  t.test("Should preserve identical docs after deletion", async t => {
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

    const searchResult = await search(db, {
      term: "Oscar",
      properties: ["author"],
    });

    const searchResult2 = await search(db, {
      term: "already",
      properties: ["quote"],
    });

    t.ok(res);
    t.equal(searchResult.count, 1);
    t.equal(searchResult.hits[0].document.author, "Oscar Wilde");
    t.equal(searchResult.hits[0].document.quote, "Be yourself; everyone else is already taken.");
    t.equal(searchResult.hits[0].id, id2);

    t.equal(searchResult2.count, 1);
    t.equal(searchResult2.hits[0].document.author, "Oscar Wilde");
    t.equal(searchResult2.hits[0].document.quote, "Be yourself; everyone else is already taken.");
    t.equal(searchResult2.hits[0].id, id2);
  });

  t.test("Should be able to insert documens with non-searchable fields", async t => {
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

    const searchResult = await search(db, {
      term: "frank",
    });

    t.equal(searchResult.count, 1);
    t.equal(searchResult.hits[0].document.author, "Frank Zappa");
  });

  t.test("Should exact match", async t => {
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

    const partialSearch = await search(db, {
      term: "alr",
      exact: true,
    });

    t.equal(partialSearch.count, 0);

    const exactSearch = await search(db, {
      term: "already",
      exact: true,
    });

    t.equal(exactSearch.count, 1);
    t.equal(exactSearch.hits[0].document.quote, "Be yourself; everyone else is already taken.");
    t.equal(exactSearch.hits[0].document.author, "Oscar Wilde");
  });

  t.test("Shouldn't tolerate typos", async t => {
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

    const searchResult = await search(db, {
      term: "seahrse",
      tolerance: 0,
    });

    t.equal(searchResult.count, 0);
  });

  t.test("Should tolerate typos", async t => {
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

    const tolerantSearch = await search(db, {
      term: "seahrse",
      tolerance: 2,
    });

    t.equal(tolerantSearch.count, 2);

    const moreTolerantSearch = await search(db, {
      term: "sahrse",
      tolerance: 5,
    });

    t.equal(moreTolerantSearch.count, 2);
  });

  t.test("Should support nested properties", async t => {
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

    const resultAuthorSurname = await search(db, {
      term: "Riddle",
      properties: ["author.surname"],
    });

    const resultAuthorName = await search(db, {
      term: "Riddle",
      properties: ["author.name"],
    });

    const resultSimpsonQuote = await search(db, {
      term: "Homer",
      properties: ["quote"],
    });

    const resultSimpsonAuthorName = await search(db, {
      term: "Homer",
      properties: ["author.name"],
    });

    t.equal(resultSimpsonAuthorName.count, 1);
    t.equal(resultSimpsonQuote.count, 1);
    t.equal(resultAuthorSurname.count, 1);
    t.equal(resultAuthorName.count, 0);
  });

  t.test("Should support multiple nested properties", async t => {
    t.plan(3);

    const db = create({
      schema: {
        quote: "string",
        author: {
          name: "string",
          surname: "string",
        },
        tag: {
          name: "string",
          description: "string",
        },
      },
    });

    insert(db, {
      quote: "Be yourself; everyone else is already taken.",
      author: {
        name: "Oscar",
        surname: "Wild",
      },
      tag: {
        name: "inspirational",
        description: "Inspirational quotes",
      },
    });

    insert(db, {
      quote: "So many books, so little time.",
      author: {
        name: "Frank",
        surname: "Zappa",
      },
      tag: {
        name: "books",
        description: "Quotes about books",
      },
    });

    insert(db, {
      quote: "A room without books is like a body without a soul.",
      author: {
        name: "Marcus",
        surname: "Tullius Cicero",
      },
      tag: {
        name: "books",
        description: "Quotes about books",
      },
    });

    const resultAuthor = await search(db, {
      term: "Oscar",
    });

    const resultTag = await search(db, {
      term: "books",
    });

    const resultQuotes = await search(db, {
      term: "quotes",
    });

    t.equal(resultAuthor.count, 1);
    t.equal(resultTag.count, 2);
    t.equal(resultQuotes.count, 3);
  });

  t.test("should suport batch insert of documents", async t => {
    t.plan(2);

    const db = create({
      schema: {
        date: "string",
        description: "string",
        lang: "string",
        category1: "string",
        category2: "string",
        granularity: "string",
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const docs = require("./datasets/events.json").result.events.slice(0, 4000);
    const wrongSchemaDocs = docs.map((doc: RetrievedDoc<PropertiesSchema>) => ({
      ...doc,
      date: +new Date(),
    }));

    try {
      await insertBatch(db, docs);
      t.equal(Object.keys(db.docs).length, 4000);

      // eslint-disable-next-line no-empty
    } catch (_e) {}

    t.rejects(insertBatch(db, wrongSchemaDocs));
  });
});

t.test("lyra - hooks", t => {
  t.plan(2);
  t.test("should validate on lyra creation", t => {
    t.plan(1);
    t.throws(() => {
      create({
        schema: { date: "string" },
        hooks: {
          ["anotherHookName" as string]: () => {
            t.fail("it shouldn't be called");
          },
        },
      });
    });
  });

  t.test("afterInsert hook", async t => {
    let callOrder = 0;
    const db = create({
      schema: {
        quote: "string",
        author: {
          name: "string",
          surname: "string",
        },
      },
      hooks: {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        afterInsert: function (_id: string): void {
          t.same(++callOrder, 1);
        },
      },
    });
    await insertWithHooks(db, {
      quote: "Harry Potter, the boy who lived, come to die. Avada kedavra.",
      author: {
        name: "Tom",
        surname: "Riddle",
      },
    });
    t.same(++callOrder, 2);
  });
});

t.test("custom tokenizer configuration", t => {
  t.plan(1);

  t.test("tokenizerFn", async t => {
    t.plan(2);
    const db = create({
      schema: {
        txt: "string",
      },
      tokenizer: {
        tokenizerFn: text => text.split(","),
      },
    });

    insert(db, {
      txt: "hello, world! How are you?",
    });

    const searchResult = await search(db, {
      term: " world! How are you?",
      exact: true,
    });

    const searchResult2 = await search(db, {
      term: "How are you?",
      exact: true,
    });

    t.same(searchResult.count, 1);
    t.same(searchResult2.count, 0);
  });
});

t.test("should access own properties exclusively", async t => {
  t.plan(1);

  const db = create({
    schema: {
      txt: "string",
    },
  });

  insert(db, {
    txt: "constructor",
  });

  await search(db, {
    term: "constructor",
    tolerance: 1,
  });

  t.same(1, 1);
});
