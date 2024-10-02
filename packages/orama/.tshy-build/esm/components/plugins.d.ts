import type { AnyOrama, OramaPlugin } from '../types.js'
export type AvailablePluginHooks = (typeof AVAILABLE_PLUGIN_HOOKS)[number]
export declare const AVAILABLE_PLUGIN_HOOKS: readonly [
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
export declare function getAllPluginsByHook<T extends AnyOrama>(orama: T, hook: AvailablePluginHooks): OramaPlugin[]
