module.exports = function (fileInfo, api) {
  const j = api.jscodeshift

  const root = j(fileInfo.source)

  // Process import declarations
  root.find(j.ImportDeclaration).forEach((path) => {
    const currentValue = path.node.source.value
    if (currentValue.endsWith('.ts')) {
      path.node.source.value = currentValue.replace('.ts', '.js')
    }
  })

  // Process require statements
  root
    .find(j.CallExpression, {
      callee: {
        type: 'Identifier',
        name: 'require'
      }
    })
    .filter(
      (path) =>
        path.node.arguments.length === 1 &&
        path.node.arguments[0].type === 'Literal' &&
        path.node.arguments[0].value.endsWith('.ts')
    )
    .forEach((path) => {
      const currentValue = path.node.arguments[0].value
      path.node.arguments[0].value = currentValue.replace('.ts', '.js')
    })

  // Process dynamic import() expressions
  root.find(j.ImportExpression).forEach((path) => {
    const source = path.node.source
    if (source.type === 'Literal' && source.value.endsWith('.ts')) {
      source.value = source.value.replace('.ts', '.js')
    }
  })

  // Process export ... from statements
  root.find(j.ExportNamedDeclaration).forEach((path) => {
    if (path.node.source && path.node.source.value.endsWith('.ts')) {
      path.node.source.value = path.node.source.value.replace('.ts', '.js')
    }
  })

  // Process export * from statements
  root.find(j.ExportAllDeclaration).forEach((path) => {
    if (path.node.source && path.node.source.value.endsWith('.ts')) {
      path.node.source.value = path.node.source.value.replace('.ts', '.js')
    }
  })

  return root.toSource()
}
