import nextra from 'nextra'
import {nodeTypes} from '@mdx-js/mdx'
import rehypeRaw from 'rehype-raw'

const withNextra = nextra({
  theme: 'nextra-theme-docs',
  themeConfig: './theme.config.jsx',
  mdxOptions: {
    // See: https://github.com/mdx-js/mdx/issues/1820
    rehypePlugins: [[rehypeRaw, { passThrough: nodeTypes }]]
  }
})

export default withNextra()
