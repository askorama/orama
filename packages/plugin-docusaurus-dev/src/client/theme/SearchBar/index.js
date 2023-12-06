import React, { useEffect, useMemo, useState } from 'react'
import useBaseUrl from '@docusaurus/useBaseUrl'
import useIsBrowser from '@docusaurus/useIsBrowser'
import { useActiveVersion, useVersions } from '@docusaurus/plugin-content-docs/client'
import { useColorMode, useDocsPreferredVersion } from '@docusaurus/theme-common'
import { usePluginData } from '@docusaurus/useGlobalData'
import { ungzip } from 'pako'
import { RegisterSearchBox, presets, signals as $ } from '@orama/searchbox'
import '@orama/searchbox/dist/index.css'

export function OramaSearch () {
  const [oramaInstance, setOramaInstance] = useState(null)

  const baseURL = useBaseUrl('orama-search-index-@VERSION@.json.gz')
  const isBrowser = useIsBrowser()
  const activeVersion = useActiveVersion(undefined)
  const versions = useVersions(undefined)
  const { preferredVersion } = useDocsPreferredVersion()
  const { searchData } = usePluginData('@orama/plugin-docusaurus-dev')
  const { colorMode } = useColorMode()

  const version = useMemo(() => {
    if (!isBrowser) {
      return undefined
    } else if (activeVersion) {
      return activeVersion
    } else if (preferredVersion) {
      return preferredVersion
    }

    return versions.find((v) => v.isLast) ?? versions[0]
  }, [isBrowser, activeVersion, preferredVersion, versions])

  useEffect(() => {
    $.colorScheme.value = colorMode
  }, [colorMode])

  useEffect(() => {

    async function loadOrama () {
      let buffer

      if (searchData[version.name]) {
        buffer = searchData[version.name].data
      } else {
        const searchResponse = await fetch(baseURL.replace('@VERSION@', version.name))

        if (searchResponse.status === 0) {
          throw new Error(`Network error: ${await searchResponse.text()}`)
        } else if (searchResponse.status !== 200) {
          throw new Error(`HTTP error ${searchResponse.status}: ${await searchResponse.text()}`)
        }

        buffer = await searchResponse.arrayBuffer()
      }

      const deflated = ungzip(buffer, { to: 'string' })

      setOramaInstance(deflated)
    }

    if (!isBrowser || !version) {
      return
    }

    loadOrama(version)
      .catch(error => {
        console.error('Cannot load search index.', error)
      })

  }, [isBrowser, searchData, baseURL, version])

  useEffect(() => {
    if (oramaInstance) {
      if(customElements.get('orama-searchbox') === undefined) {
        RegisterSearchBox({
          oramaInstance,
          preset: presets.docusaurus.name,
          show: false,
          colorScheme: colorMode,
        })
      }
    }
  }, [oramaInstance])

  return (
    <div>
      <button
        className='DocSearch DocSearch-Button'
        onClick={() => $.setShow(true)}
      >
        <span className="DocSearch-Button-Container">
          <svg width="20" height="20" class="DocSearch-Search-Icon" viewBox="0 0 20 20">
            <path d="M14.386 14.386l4.0877 4.0877-4.0877-4.0877c-2.9418 2.9419-7.7115 2.9419-10.6533 0-2.9419-2.9418-2.9419-7.7115 0-10.6533 2.9418-2.9419 7.7115-2.9419 10.6533 0 2.9419 2.9418 2.9419 7.7115 0 10.6533z" stroke="currentColor" fill="none" fillRule="evenodd" strokeLinecap="round" strokeLinejoin="round">
            </path>
            </svg>
          <span className="DocSearch-Button-Placeholder">
            Search
          </span>
        </span>
        <span className="DocSearch-Button-Keys"><kbd className="DocSearch-Button-Key">⌘</kbd><kbd className="DocSearch-Button-Key">K</kbd></span>
      </button>

      {oramaInstance && (
        <orama-searchbox />
      )}
    </div>
  )
}

export default function OramaSearchWrapper () {
  return (
    <OramaSearch />
  )
}