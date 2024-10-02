import { createError } from '../errors.js'
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
  'afterLoad',
  'afterCreate'
]
export function getAllPluginsByHook(orama, hook) {
  const pluginsToRun = []
  const pluginsLength = orama.plugins?.length
  if (!pluginsLength) {
    return pluginsToRun
  }
  for (let i = 0; i < pluginsLength; i++) {
    try {
      const plugin = orama.plugins[i]
      if (typeof plugin[hook] === 'function') {
        pluginsToRun.push(plugin[hook])
      }
    } catch (error) {
      console.error('Caught error in getAllPluginsByHook:', error)
      throw createError('PLUGIN_CRASHED')
    }
  }
  return pluginsToRun
}
//# sourceMappingURL=plugins.js.map
