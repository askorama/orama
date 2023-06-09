import type { LoadContext, Plugin } from '@docusaurus/types'
import { PluginOptions } from './types.js'

export type { PluginData, PluginOptions, RawDataWithPositions, SectionSchema } from './types.js'

export type DocusaurusOramaPlugin = (docusaurusContext: LoadContext, options: PluginOptions) => Plugin

let _esmDocusaurusOramaPlugin: DocusaurusOramaPlugin

// eslint-disable-next-line no-new-func, @typescript-eslint/no-implied-eval
const importDynamic = new Function('modulePath', 'return import(modulePath)')

export default async function docusaurusOramaPlugin(
  ...args: Parameters<DocusaurusOramaPlugin>
): Promise<ReturnType<DocusaurusOramaPlugin>> {
  if (!_esmDocusaurusOramaPlugin) {
    const imported = await importDynamic('./index.js')
    _esmDocusaurusOramaPlugin = imported.default
  }

  return _esmDocusaurusOramaPlugin(...args)
}
