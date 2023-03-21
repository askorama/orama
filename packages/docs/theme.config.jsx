export default {
  project: {
    link: 'https://github.com/oramasearch/orama',
  },
  logo: <strong>Orama</strong>,
  footer: <p>Apache 2.0 - 2023 © OramaSearch Inc.</p>,
  docsRepositoryBase: 'https://github.com/oramasearch/orama/blob/packages/docs/pages',
  useNextSeoProps() {
    return {
      titleTemplate: '%s – Orama',
    }
  }
}
