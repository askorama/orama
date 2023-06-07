import { autocomplete } from '@algolia/autocomplete-js'
import '@algolia/autocomplete-theme-classic/dist/theme.min.css'
import { useLocation } from '@docusaurus/router'
import { useColorMode } from '@docusaurus/theme-common'
import useBaseUrl from '@docusaurus/useBaseUrl'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import { usePluginData } from '@docusaurus/useGlobalData'
import useIsBrowser from '@docusaurus/useIsBrowser'
import { Result, create, load } from '@orama/orama'
import type { OramaWithHighlight, Position } from '@orama/plugin-match-highlight'
import { searchWithHighlight } from '@orama/plugin-match-highlight'
import { ungzip } from 'pako'
import { Fragment, createElement, useEffect, useMemo, useRef, useState } from 'react'
import { render } from 'react-dom'
import { INDEX_FILE, PLUGIN_NAME } from '../../../shared.js'
import { PluginData, RawDataWithPositions, schema } from '../../../types.js'
import { Footer } from './Footer.js'
type Hit = Result & { position: Position }

const templates = {
  item({ item }: { item: Hit }) {
    return (
      <a className="aa-ItemLink" href={item.document.pageRoute as string}>
        <div className="aa-ItemContent">
          <div className="aa-ItemContentBody">
            <div className="aa-ItemContentTitle">
              <h5 style={{ marginBottom: 0 }}>{item.document.sectionTitle as string}</h5>
            </div>
            <div className="aa-ItemContentDescription">{snippet(item)}</div>
          </div>
        </div>
      </a>
    )
  }
}

function snippet(item: Hit): JSX.Element {
  const PADDING = 20
  const PADDING_MARKER = '...'
  const isBeginning = item.position.start < PADDING
  const isEnd = item.position.start + item.position.length > (item.document.sectionContent as string).length - PADDING
  const preMatch = (item.document.sectionContent as string).substring(
    isBeginning ? 0 : item.position.start - PADDING,
    item.position.start
  )
  const match = (item.document.sectionContent as string).substring(
    item.position.start,
    item.position.start + item.position.length
  )
  const postMatch = (item.document.sectionContent as string).substring(
    item.position.start + item.position.length,
    item.position.start + item.position.length + PADDING
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

export default function SearchBar(): JSX.Element {
  const isBrowser = useIsBrowser()
  const { siteConfig } = useDocusaurusContext()
  const location = useLocation()
  const containerRef = useRef(null)
  const { colorMode } = useColorMode()
  const { searchData, versions } = usePluginData(PLUGIN_NAME) as PluginData
  const [database, setDatabase] = useState<OramaWithHighlight>()
  const searchBaseUrl = useBaseUrl(INDEX_FILE)

  const version = useMemo(() => {
    if (!isBrowser) {
      return undefined
    }

    const pathname = location.pathname

    for (const v of versions) {
      if (pathname.startsWith(v.path)) {
        return v.name
      }
    }

    return versions[0].name
  }, [isBrowser, versions, location])

  useEffect(() => {
    if (!containerRef.current || !isBrowser || !database) {
      return undefined
    }

    const search = autocomplete({
      placeholder: 'Search ...',
      container: containerRef.current,
      // @ts-expect-error render typing here is for preact, react also works
      renderer: { createElement, Fragment, render },
      openOnFocus: true,
      detachedMediaQuery: '', // always detached
      async getSources({ query: term }): Promise<any> {
        return [
          {
            sourceId: 'orama',
            async getItems() {
              const results = await searchWithHighlight(database, {
                term,
                properties: ['sectionTitle', 'sectionContent', 'type']
              })

              const processed = results.hits.flatMap(hit =>
                Object.values((hit as any).positions.sectionContent).flatMap(positions =>
                  (positions as any).map((position: Position) => ({
                    ...hit,
                    position
                  }))
                )
              )

              return processed
            },
            getItemUrl({ item }: { item: Hit }) {
              return item.document.pageRoute
            },
            templates
          }
        ]
      },
      render({ sections, render }, root) {
        render(
          <>
            <div className="aa-PanelLayout aa-Panel--scrollable">{sections}</div>
            <Footer colorMode={colorMode} />
          </>,
          root
        )
      },
      renderNoResults({ render, state }, root) {
        render(
          <>
            {state.query && <div className="aa-NoResults">No results found.</div>}
            <Footer colorMode={colorMode} />
          </>,
          root
        )
      }
    })
    return () => {
      search.destroy()
    }
  }, [isBrowser, siteConfig, database, colorMode])

  useEffect(() => {
    async function loadDatabase(): Promise<void> {
      let data: RawDataWithPositions
      if (!searchData) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const searchResponse = await fetch(searchBaseUrl.replace('@VERSION@', version!))

        if (searchResponse.status === 0) {
          throw new Error(`Network error: ${await searchResponse.text()}`)
        } else if (searchResponse.status !== 200) {
          throw new Error(`HTTP error ${searchResponse.status}: ${await searchResponse.text()}`)
        }

        const deflated = ungzip(await searchResponse.arrayBuffer(), { to: 'string' })
        data = JSON.parse(deflated)
      } else {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        data = searchData[version!]
      }

      const db = (await create({ schema })) as OramaWithHighlight
      await load(db, data)
      db.data.positions = data.positions
      setDatabase(db)
    }

    if (!isBrowser || !version) {
      return
    }

    loadDatabase().catch(error => {
      console.error('Cannot load search index.', error)
    })
  }, [isBrowser, searchData, searchBaseUrl, version])

  useEffect(() => {
    colorMode === 'dark' ? document.body.classList.add(colorMode) : document.body.classList.remove('dark')
  }, [colorMode])

  return <div ref={containerRef} />
}
