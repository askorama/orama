// @ts-expect-error Resolve at runtime
import { SearchBarFooter } from '@theme/SearchBarFooter'

import type { ColorMode } from '@docusaurus/theme-common'

export interface SearchNoResultsProps {
  query: string
  colorMode?: ColorMode
}

export function SearchNoResults({ query, colorMode }: SearchNoResultsProps): JSX.Element {
  return (
    <>
      {query && <div className="aa-NoResults">No results found.</div>}
      <SearchBarFooter colorMode={colorMode} />
    </>
  )
}
