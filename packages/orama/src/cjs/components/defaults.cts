import type {
  formatElapsedTime as esmFormatElapsedTime,
  getDocumentIndexId as esmGetDocumentIndexId,
  getDocumentProperties as esmGetDocumentProperties,
  validateSchema as esmValidateSchema,
} from '../../components/defaults.js'

let _esmFormatElapsedTime: typeof esmFormatElapsedTime
let _esmGetDocumentIndexId: typeof esmGetDocumentIndexId
let _esmGetDocumentProperties: typeof esmGetDocumentProperties
let _esmValidateSchema: typeof esmValidateSchema

export async function formatElapsedTime(
  ...args: Parameters<typeof esmFormatElapsedTime>
): ReturnType<typeof esmFormatElapsedTime> {
  if (!_esmFormatElapsedTime) {
    const imported = await import('../../components/defaults.js')
    _esmFormatElapsedTime = imported.formatElapsedTime
  }

  return _esmFormatElapsedTime(...args)
}

export async function getDocumentIndexId(
  ...args: Parameters<typeof esmGetDocumentIndexId>
): ReturnType<typeof esmGetDocumentIndexId> {
  if (!_esmGetDocumentIndexId) {
    const imported = await import('../../components/defaults.js')
    _esmGetDocumentIndexId = imported.getDocumentIndexId
  }

  return _esmGetDocumentIndexId(...args)
}

export async function getDocumentProperties(
  ...args: Parameters<typeof esmGetDocumentProperties>
): ReturnType<typeof esmGetDocumentProperties> {
  if (!_esmGetDocumentProperties) {
    const imported = await import('../../components/defaults.js')
    _esmGetDocumentProperties = imported.getDocumentProperties
  }

  return _esmGetDocumentProperties(...args)
}

export async function validateSchema(
  ...args: Parameters<typeof esmValidateSchema>
): ReturnType<typeof esmValidateSchema> {
  if (!_esmValidateSchema) {
    const imported = await import('../../components/defaults.js')
    _esmValidateSchema = imported.validateSchema
  }

  return _esmValidateSchema(...args)
}
