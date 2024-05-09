import type { Orama, TypedDocument } from "@orama/orama";
import { create, insertMultiple } from "@orama/orama";

export type NextraOrama = Orama<typeof defaultSchema>;

const defaultSchema = {
  id: "string",
  title: "string",
  path: "string",
  description: "string",
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
    const title = data[path].title;
    const description = data[path].data[""];

    documents.push({
      id: path,
      title,
      path,
      description,
    });

    const sectionData = data[path].data;
    delete sectionData[""];

    for (const sectionTitle in sectionData) {
      const [hash, title] = sectionTitle.split("#");
      const description = sectionData[sectionTitle];

      documents.push({
        id: `${path}#${hash}`,
        title,
        path: `${path}#${hash}`,
        description,
      });
    }
  }

  await insertMultiple(index, documents);

  return index;
}
