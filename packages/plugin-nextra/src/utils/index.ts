import type { Orama, TypedDocument } from "@orama/orama";
import { create, insertMultiple } from "@orama/orama";

export type NextraOrama = Orama<typeof defaultSchema>;

const defaultSchema = {
  id: "string",
  title: "string",
  url: "string",
  content: "string",
} as const;

export async function createOramaIndex(basePath, locale): Promise<NextraOrama> {
  const response = await fetch(
    `${basePath}/_next/static/chunks/nextra-data-${locale}.json`
  );
  const data = await response.json();
  console.log(data);
  const index = await create({
    schema: defaultSchema,
  });

  const paths = Object.keys(data);
  const documents: TypedDocument<NextraOrama>[] = [];

  for (const path of paths) {
    const url = path;
    const title = data[path].title;
    const content = data[path].data[""];

    documents.push({
      id: url,
      title,
      url,
      content,
    });

    const sectionData = data[path].data;
    delete sectionData[""];

    for (const sectionTitle in sectionData) {
      const [hash, title] = sectionTitle.split("#");
      const content = sectionData[sectionTitle];

      documents.push({
        id: `${url}#${hash}`,
        title,
        url: `${url}#${hash}`,
        content,
      });
    }
  }

  await insertMultiple(index, documents);

  return index;
}
