import { isAsyncFunction } from '../utils.js'
export const OBJECT_COMPONENTS = ['tokenizer', 'index', 'documentsStore', 'sorter']
export const FUNCTION_COMPONENTS = [
  'validateSchema',
  'getDocumentIndexId',
  'getDocumentProperties',
  'formatElapsedTime'
]
export const SINGLE_OR_ARRAY_COMPONENTS = [
  /* deprecated with v2.0.0-beta.5 */
]
export function runSingleHook(hooks, orama, id, doc) {
  const needAsync = hooks.some(isAsyncFunction)
  if (needAsync) {
    return (async () => {
      for (const hook of hooks) {
        await hook(orama, id, doc)
      }
    })()
  } else {
    for (const hook of hooks) {
      hook(orama, id, doc)
    }
  }
}
export function runMultipleHook(hooks, orama, docsOrIds) {
  const needAsync = hooks.some(isAsyncFunction)
  if (needAsync) {
    return (async () => {
      for (const hook of hooks) {
        await hook(orama, docsOrIds)
      }
    })()
  } else {
    for (const hook of hooks) {
      hook(orama, docsOrIds)
    }
  }
}
export function runAfterSearch(hooks, db, params, language, results) {
  const needAsync = hooks.some(isAsyncFunction)
  if (needAsync) {
    return (async () => {
      for (const hook of hooks) {
        await hook(db, params, language, results)
      }
    })()
  } else {
    for (const hook of hooks) {
      hook(db, params, language, results)
    }
  }
}
export function runBeforeSearch(hooks, db, params, language) {
  const needAsync = hooks.some(isAsyncFunction)
  if (needAsync) {
    return (async () => {
      for (const hook of hooks) {
        await hook(db, params, language)
      }
    })()
  } else {
    for (const hook of hooks) {
      hook(db, params, language)
    }
  }
}
export function runAfterCreate(hooks, db) {
  const needAsync = hooks.some(isAsyncFunction)
  if (needAsync) {
    return (async () => {
      for (const hook of hooks) {
        await hook(db)
      }
    })()
  } else {
    for (const hook of hooks) {
      hook(db)
    }
  }
}
//# sourceMappingURL=hooks.js.map
