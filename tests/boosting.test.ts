import t from "tap"
import { create, insert, search } from "../src/index.js";

t.test("boosting", t => {
  t.plan(1);

  t.test("field boosting", async t => {
    t.plan(1);

    const db1 = await create({
      schema: {
        id: "string",
        title: "string",
        description: "string"
      }
    });

    await insert(db1, {
      id: "1",
      title: "Powerful computer with 16GB RAM",
      description: "A powerful computer with 16GB RAM and a 1TB SSD, perfect for gaming and video editing."
    });

    await insert(db1, {
      id: "2",
      title: "PC with 8GB RAM. Good for gaming and browsing the web.",
      description: "A personal computer with 8GB RAM and a 500GB SSD, perfect for browsing the web and watching movies. This computer is also great for kids."
    });

    const { hits } = await search(db1, {
      term: "computer for gaming, browsing, and movies",
    });


    const db2 = await create({
      schema: {
        id: "string",
        title: "string",
        description: "string"
      },
      boost: {
        title: 0.5
      }
    });

    await insert(db2, {
      id: "1",
      title: "Powerful computer with 16GB RAM",
      description: "A powerful computer with 16GB RAM and a 1TB SSD, perfect for gaming and video editing."
    });

    await insert(db2, {
      id: "2",
      title: "PC with 8GB RAM. Good for gaming and browsing the web.",
      description: "A personal computer with 8GB RAM and a 500GB SSD, perfect for browsing the web and watching movies. This computer is also great for kids."
    });

    const { hits: hits2 } = await search(db2, {
      term: "computer for gaming, browsing, and movies",
    });

    console.log({
      hits,
      hits2
    })

    t.equal(hits[0].score < hits2[0].score, true);
  });
});