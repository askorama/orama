import t from "tap";
import { create, insert, search } from "../..";
// 👆 This test assumes the module has been built

t.test("lyra", t => {
  t.plan(1);

  t.test("should correctly search for data", async t => {
    t.plan(6);

    const db = await create({
      schema: {
        quote: "string",
        author: "string",
      },
    });

    await insert(db, { quote: "the quick, brown fox jumps over the lazy dog. What a fox!", author: "John Doe" });
    await insert(db, { quote: "Foxes are nice animals. But I prefer having a dog.", author: "John Doe" });
    await insert(db, { quote: "I like dogs. They are the best.", author: "Jane Doe" });
    await insert(db, { quote: "I like cats. They are the best.", author: "Jane Doe" });

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
  });
});
