import { Result } from '@orama/orama'
import { Position } from '@orama/plugin-match-highlight'
import { SectionSchema } from '../../../server/types.js'

type Hit = Result<SectionSchema> & { position: Position }

interface SearchResultProps {
  hit: Hit
}

function snippet(hit: Hit): JSX.Element {
  const PADDING = 20
  const PADDING_MARKER = '...'
  const isBeginning = hit.position.start < PADDING
  const isEnd = hit.position.start + hit.position.length > (hit.document.sectionContent as string).length - PADDING
  const preMatch = (hit.document.sectionContent as string).substring(
    isBeginning ? 0 : hit.position.start - PADDING,
    hit.position.start
  )
  const match = (hit.document.sectionContent as string).substring(
    hit.position.start,
    hit.position.start + hit.position.length
  )
  const postMatch = (hit.document.sectionContent as string).substring(
    hit.position.start + hit.position.length,
    hit.position.start + hit.position.length + PADDING
  )
  return (
    <p>
      {isBeginning ? '' : PADDING_MARKER}
      {preMatch}
      <u>{match}</u>
      {postMatch}
      {isEnd ? '' : PADDING_MARKER}
    </p>
  )
}

export function SearchResult({ hit }: SearchResultProps): JSX.Element {
  return (
    <a className="aa-ItemLink" href={hit.document.pageRoute as string}>
      <div className="aa-ItemContent">
        <div className="aa-ItemContentBody">
          <div className="aa-ItemContentTitle">
            <h5 style={{ marginBottom: 0 }}>{hit.document.sectionTitle as string}</h5>
          </div>
          <div className="aa-ItemContentDescription">{snippet(hit)}</div>
        </div>
      </div>
    </a>
  )
}
