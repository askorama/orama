import { LoadContext, Plugin } from '@docusaurus/types'

type DocusaurusOramaPlugin = (docusaurusContext: LoadContext) => Plugin

let _esmDocusaurusOramaPlugin: DocusaurusOramaPlugin

// eslint-disable-next-line no-new-func, @typescript-eslint/no-implied-eval
const importDynamic = new Function('modulePath', 'return import(modulePath)')

async function docusaurusOramaPlugin(
  ...args: Parameters<DocusaurusOramaPlugin>
): Promise<ReturnType<DocusaurusOramaPlugin>> {
  if (!_esmDocusaurusOramaPlugin) {
    const imported = await importDynamic('./index.js')
    _esmDocusaurusOramaPlugin = imported.default
  }

  return _esmDocusaurusOramaPlugin(...args)
}

module.exports = docusaurusOramaPlugin
