import { FaSlack } from 'react-icons/fa'
import { Logo } from './components/Logo'
import { Search } from './components/Search'

const css = `
li > ul.nx-mt-6 {
  margin-top: 0;
}

li > ul.nx-mt-6 > li:first-child {
  margin-top: 0;
}
`

export default {
  project: {
    link: 'https://github.com/oramasearch/orama',
  },
  logo: <Logo />,
  chat: {
    link: 'https://join.slack.com/t/lyrasearch/shared_invite/zt-1gzvj0mmt-yJhJ6pnrSGuwqPmPx9uO5Q',
    icon: <FaSlack style={{ width: 24, height: 24 }} />,
  },
  footer: {
    text: <p>Apache 2.0 - 2023 © OramaSearch Inc.</p>,
  },
  docsRepositoryBase: 'https://github.com/oramasearch/orama/blob/packages/docs/pages',
  darkMode: false,
  useNextSeoProps() {
    return {
      titleTemplate: '%s – Orama',
    }
  },
  search: {
    component: Search
  },
  head: (
    <>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta property="og:title" content="Orama" />
      <meta property="og:description" content="Search, everywhere." />

      <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
      <link rel="manifest" href="/favicon/site.webmanifest" />
      <link rel="mask-icon" href="/favicon/safari-pinned-tab.svg" color="#000000" />
      <meta name="msapplication-TileColor" content="#000000" />
      <meta name="theme-color" content="#000000"></meta>

      <style dangerouslySetInnerHTML={{ __html: css }} />
    </>
  ),
}
