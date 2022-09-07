import t from "tap";
import { create, insert, search } from "../..";
// 👆 This test assumes the module has been built

t.test("lyra", t => {
  t.plan(1);

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

    t.equal(result1.count, 2);
    t.equal(result2.count, 3);

    // Prefix search
    const result3 = search(db, { term: "fox", exact: false });
    const result4 = search(db, { term: "dog", exact: false });

    t.equal(result3.count, 2);
    t.equal(result4.count, 3);

    // Typo-tolerant search
    const result5 = search(db, { term: "fx", tolerance: 1 });
    const result6 = search(db, { term: "dg", tolerance: 2 });

    t.equal(result5.count, 2);
    t.equal(result6.count, 4);
  });
});
