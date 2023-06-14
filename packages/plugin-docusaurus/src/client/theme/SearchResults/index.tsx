// @ts-expect-error Resolve at runtime
import { SearchBarFooter } from '@theme/SearchBarFooter'

import type { VNode } from '@algolia/autocomplete-js'
import { ColorModeProvider } from '@docusaurus/theme-common/internal'

export interface SearchResultsProps {
  sections?: VNode[]
}

export function SearchResults({ sections }: SearchResultsProps): JSX.Element {
  return (
    <ColorModeProvider>
      <div className="aa-PanelLayout aa-Panel--scrollable">{sections}</div>
      <SearchBarFooter />
    </ColorModeProvider>
  )
}
