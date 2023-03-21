function capitalize(word: string): string {
  return `${word.slice(0, 1).toUpperCase()}${word.slice(1).toLowerCase()}`
}

export function UNSUPPORTED_FORMAT(format: string): string {
  return `Unsupported serialization format: ${format}`
}

export function FILESYSTEM_NOT_SUPPORTED_ON_RUNTIME(runtime: string): string {
  return `Filesystem access is not supported on ${capitalize(runtime)}`
}
