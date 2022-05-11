import { Lyra } from "../src/lyra";

function getId({ id }: { id: string }) {
  return id;
}

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
