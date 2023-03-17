import type {
  formatElapsedTime as esmFormatElapsedTime,
  getDocumentIndexId as esmGetDocumentIndexId,
  validateSchema as esmValidateSchema,
  getDefaultComponents as esmGetDefaultComponents,
  documentStore as esmDocumentStore,
  index as esmIndex,
} from "../components.js";

export interface OramaComponents {
  formatElapsedTime: typeof esmFormatElapsedTime;
  getDocumentIndexId: typeof esmGetDocumentIndexId;
  validateSchema: typeof esmValidateSchema;
  getDefaultComponents: typeof esmGetDefaultComponents;
  documentStore: typeof esmDocumentStore;
  index: typeof esmIndex;
}

export type RequireCallback = (err: Error | undefined, components?: OramaComponents) => void;

export function requireOramaComponents(callback: RequireCallback): void {
  import("../components.js")
    .then((loaded: OramaComponents) => setTimeout(() => callback(undefined, loaded), 1))
    .catch((error: Error) => setTimeout(() => callback(error), 1));
}
