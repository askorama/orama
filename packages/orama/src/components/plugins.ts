import type { AnyOrama, OramaPlugin } from '../types.js'

export type AvailablePluginHooks = (typeof AVAILABLE_PLUGIN_HOOKS)[number]

export const AVAILABLE_PLUGIN_HOOKS = [
  'beforeInsert',
  'afterInsert',
  'beforeRemove',
  'afterRemove',
  'beforeUpdate',
  'afterUpdate',
  'beforeSearch',
  'afterSearch',
  'beforeInsertMultiple',
  'afterInsertMultiple',
  'beforeRemoveMultiple',
  'afterRemoveMultiple',
  'beforeUpdateMultiple',
  'afterUpdateMultiple',
  'beforeLoad',
  'afterLoad'
] as const

export function getAllPluginsByHook<T extends AnyOrama>(orama: T, hook: AvailablePluginHooks): OramaPlugin[] {
  const pluginsToRun: OramaPlugin[] = []

  const pluginsLength = orama.plugins?.length

  if (!pluginsLength) {
    return pluginsToRun
  }

  for (let i = 0; i < pluginsLength; i++) {
    const plugin = orama.plugins[i]

    if (typeof plugin[hook] === 'function') {
      pluginsToRun.push(plugin[hook] as OramaPlugin)
    }
  }

  return pluginsToRun
}
