import { getCollection } from 'astro:content'
import { OGImageRoute } from 'astro-og-canvas'

const entries = await getCollection('docs')

const pages = Object.fromEntries(entries.map(({ data, id }) => [id, { data }]))

export const { getStaticPaths, GET } = OGImageRoute({
  pages,
  param: 'slug',
  getImageOptions: (_path, page: (typeof pages)[number]) => {
    return {
      title: page.data.title,
      description: page.data.description,
      logo: {
        path: './src/assets/logo.png',
        size: [120],
      },
      bgImage: {
        path: './src/assets/og-bg.png'
      },
      format: 'PNG',
      padding: 60,
      quality: 100,
    }
  }
})