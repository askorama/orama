import { expect, test } from "@playwright/test";

test("works correctly", async ({ page }) => {
  await page.goto("/");

  const result = await page.evaluate(() => JSON.parse(document.getElementById("searchResult")!.innerHTML));

  expect(result).toMatchObject({
    hits: [
      {
        score: expect.any(Number),
        document: {
          title: "The prestige",
          director: "Christopher Nolan",
          plot: "Two friends and fellow magicians become bitter enemies after a sudden tragedy. As they devote themselves to this rivalry, they make sacrifices that bring them fame but with terrible consequences.",
          year: 2006,
          isFavorite: true,
        },
      },
    ],
    count: 1,
  });
});
