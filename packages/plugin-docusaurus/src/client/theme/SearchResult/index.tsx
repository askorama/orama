import { Result } from "@orama/orama"
import { SectionSchema } from "../../../server/types.js"

interface SearchResultProps {
  hit: Result<SectionSchema>
}

export function SearchResult({ hit }: SearchResultProps): JSX.Element {
  return (
    <a className="aa-ItemLink" href={hit.document.pageRoute as string}>
      <div className="aa-ItemContent">
        <div className="aa-ItemContentBody">
          <div className="aa-ItemContentTitle">
            <h5 style={{ marginBottom: 0 }}>{hit.document.sectionTitle as string}</h5>
          </div>
          <div className="aa-ItemContentDescription"
               dangerouslySetInnerHTML={{ __html: hit.document.sectionContent }}></div>
        </div>
      </div>
    </a>
  )
}
