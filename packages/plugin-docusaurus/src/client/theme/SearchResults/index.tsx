// @ts-expect-error Resolve at runtime
import { SearchBarFooter } from '@theme/SearchBarFooter'

import type { VNode } from '@algolia/autocomplete-js'
import type { ColorMode } from '@docusaurus/theme-common'

export interface SearchResultsProps {
  sections?: VNode[]
  colorMode?: ColorMode
}

export function SearchResults({ sections, colorMode }: SearchResultsProps): JSX.Element {
  return (
    <>
      <div className="aa-PanelLayout aa-Panel--scrollable">{sections}</div>
      <SearchBarFooter colorMode={colorMode} />
    </>
  )
}
