import type { AnyOrama, OramaPlugin } from '../types.ts'
import { createError } from '../errors.ts'

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

export async function getAllPluginsByHook<T extends AnyOrama>(
  orama: T,
  hook: AvailablePluginHooks
): Promise<OramaPlugin[]> {
  const pluginsToRun: OramaPlugin[] = []
  const pluginsLength = orama.plugins?.length

  if (!pluginsLength) {
    return pluginsToRun
  }

  for (let i = 0; i < pluginsLength; i++) {
    try {
      const plugin = await orama.plugins[i]
      if (typeof plugin[hook] === 'function') {
        pluginsToRun.push(plugin[hook] as OramaPlugin)
      }
    } catch (error) {
      console.error('Caught error in getAllPluginsByHook:', error)
      throw createError('PLUGIN_CRASHED')
    }
  }

  return pluginsToRun
}
