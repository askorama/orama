import { ColorModeProvider } from '@docusaurus/theme-common/internal'
// @ts-expect-error Resolve at runtime
import { SearchBarFooter } from '@theme/SearchBarFooter'

export interface SearchNoResultsProps {
  query: string
}

export function SearchNoResults({ query }: SearchNoResultsProps): JSX.Element {
  return (
    <ColorModeProvider>
      {query && <div className="aa-NoResults">No results found.</div>}
      <SearchBarFooter />
    </ColorModeProvider>
  )
}
