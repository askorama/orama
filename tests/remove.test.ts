import t from "tap";
import { remove } from "../src/methods/remove.js";
import { create } from "../src/methods/create.js";
import { insert } from "../src/methods/insert.js";

t.test("remove method", t => {
  t.plan(1);
  
  t.test("should remove a document and update field length", async t => {
    t.plan(2);

    const db = await create({
      schema: {
        quote: "string",
        author: "string",
        meta: {
          tags: "string",
        }
      }
    });

    await insert(db, {
      quote: "Life is what happens when you're busy making other plans",
      author: "John Lennon",
      meta: {
        tags: "music, life, music",
      }
    });

    await insert(db, {
      quote: "What I cannot create, I do not understand",
      author: "Richard Feynman",
      meta: {
        tags: "physics, science, philosophy",
      }
    });

    await insert(db, {
      quote: "Go confidently in the direction of your dreams! Live the life you've imagined",
      author: "Henry Thoreau",
      meta: {
        tags: "life, philosophy, dreams, imagination",
      }
    });

    const fieldLengths = {...db.fieldLengths};
    const avgFieldLength = {...db.avgFieldLength};

    const d1 = await insert(db, {
      quote: "It is during our darkest moments that we must focus to see the light.",
      author: "Aristotle",
      meta: {
        tags: "philosophy, life, light",
      }
    });

    await remove(db, d1.id);

    t.same(db.fieldLengths, fieldLengths);
    t.same(db.avgFieldLength, avgFieldLength);
  });
});