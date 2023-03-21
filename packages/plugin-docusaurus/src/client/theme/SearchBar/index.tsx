import { autocomplete } from '@algolia/autocomplete-js'
import '@algolia/autocomplete-theme-classic/dist/theme.min.css'
import { useColorMode } from '@docusaurus/theme-common'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import { usePluginData } from '@docusaurus/useGlobalData'
import useIsBrowser from '@docusaurus/useIsBrowser'
import { Position } from '@orama/plugin-match-highlight'
import { createElement, Fragment, useEffect, useRef } from 'react'
import { render } from 'react-dom'
import { PLUGIN_NAME } from '../../../shared.js'
import { SectionSchema } from '../../../types.js'
import { Footer } from './Footer.js'
import { getOrama } from './getOrama.js'
import './search.css'

type Hit = SectionSchema & { position: Position }

const templates = {
  item({ item }: { item: Hit }) {
    return (
      <a className="aa-ItemLink" href={item.pageRoute}>
        <div className="aa-ItemContent">
          <div className="aa-ItemContentBody">
            <div className="aa-ItemContentTitle">
              <h5 style={{ marginBottom: 0 }}>{item.sectionTitle}</h5>
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
  const isEnd = item.position.start + item.position.length > item.sectionContent.length - PADDING
  const preMatch = item.sectionContent.substring(isBeginning ? 0 : item.position.start - PADDING, item.position.start)
  const match = item.sectionContent.substring(item.position.start, item.position.start + item.position.length)
  const postMatch = item.sectionContent.substring(
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
  const containerRef = useRef(null)
  const { colorMode } = useColorMode()
  const indexData = usePluginData(PLUGIN_NAME)

  useEffect(() => {
    if (!containerRef.current || !isBrowser) {
      return undefined
    }

    const search = autocomplete({
      container: containerRef.current,
      // @ts-expect-error render typing here is for preact, react also works
      renderer: { createElement, Fragment, render },
      openOnFocus: true,
      detachedMediaQuery: '', // always detached
      async getSources({ query }): Promise<any> {
        const orama = await getOrama(siteConfig.baseUrl, indexData)

        return [
          {
            sourceId: 'orama',
            async getItems() {
              const results = await orama(query)
              const processed = results.flatMap(hit =>
                Object.values(hit.positions.sectionContent).flatMap(positions =>
                  positions.map(position => ({
                    ...hit.document,
                    position
                  }))
                )
              )

              return processed
            },
            getItemUrl({ item }: { item: SectionSchema }) {
              return item.pageRoute
            },
            templates
          }
        ]
      },
      render({ sections, render }, root) {
        render(
          <>
            <div className="aa-PanelLayout aa-Panel--scrollable">{sections}</div>
            <Footer />
          </>,
          root
        )
      }
    })
    return () => {
      search.destroy()
    }
  }, [isBrowser, siteConfig, indexData])

  useEffect(() => {
    colorMode === 'dark' ? document.body.classList.add(colorMode) : document.body.classList.remove('dark')
  }, [colorMode])

  return <div ref={containerRef} />
}
