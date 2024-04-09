// @ts-nocheck
import React, { useEffect, useState } from "react"
import useBaseUrl from "@docusaurus/useBaseUrl"
import { useLocation } from "@docusaurus/router"
import useIsBrowser from "@docusaurus/useIsBrowser"
import { useActiveVersion, useVersions } from "@docusaurus/plugin-content-docs/client"
import { useColorMode, useDocsPreferredVersion } from "@docusaurus/theme-common"
import { usePluginData } from "@docusaurus/useGlobalData"
import { ungzip } from "pako"
import { SearchBox, SearchButton, presets } from "@orama/searchbox"
import { OramaClient } from "@oramacloud/client"
import { create, insertMultiple } from "@orama/orama"
import { pluginAnalytics } from "@orama/plugin-analytics"
import "@orama/searchbox/dist/index.css"

interface PluginData {
  searchData: {
    current: { data: ArrayBuffer } | null
  },
  endpoint: { url: string, key: string } | null,
  analytics: { apiKey: string, indexId: string, enabled: boolean } | null,
  docsInstances: string[]
}

export function OramaSearch() {
  const [searchBoxConfig, setSearchBoxConfig] = useState(null)
  const { pathname } = useLocation()

  const {
    searchData,
    endpoint,
    analytics,
    docsInstances
  }: PluginData  = usePluginData("@orama/plugin-docusaurus-v3") as PluginData
  const pluginId = docsInstances.filter((id: string) => pathname.includes(id))[0] || docsInstances[0]
  const baseURL = useBaseUrl("orama-search-index-current.json.gz")
  const isBrowser = useIsBrowser()
  const { colorMode } = useColorMode()
  const versions = useVersions(pluginId)
  const activeVersion = useActiveVersion(pluginId)
  const { preferredVersion } = useDocsPreferredVersion(pluginId)
  const currentVersion = activeVersion || preferredVersion || versions[0]

  useEffect(() => {
    async function loadOrama() {
      if (endpoint) {
        setSearchBoxConfig({
          oramaInstance: new OramaClient({
            endpoint: endpoint.url,
            api_key: endpoint.key
          })
        })
      } else {
        let buffer

        if (searchData.current) {
          buffer = searchData.current.data
        } else {
          const searchResponse = await fetch(baseURL)

          if (searchResponse.status === 0) {
            throw new Error(`Network error: ${await searchResponse.text()}`)
          } else if (searchResponse.status !== 200) {
            throw new Error(`HTTP error ${searchResponse.status}: ${await searchResponse.text()}`)
          }

          buffer = await searchResponse.arrayBuffer()
        }

        const deflated = ungzip(buffer, { to: "string" })
        const parsedDeflated = JSON.parse(deflated)

        const db = await create({
          schema: { ...presets.docs.schema, version: "enum" },
          plugins: [
            ...(analytics ? [
              pluginAnalytics({
                apiKey: analytics.apiKey,
                indexId: analytics.indexId,
                enabled: analytics.enabled,
              })
            ] : [])
          ]
        })

        await insertMultiple(db, Object.values(parsedDeflated.docs.docs))

        setSearchBoxConfig({
          oramaInstance: db
        })
      }
    }

    if (!isBrowser) {
      return
    }

    loadOrama().catch((error) => {
      console.error("Cannot load search index.", error)
    })
  }, [isBrowser])

  const searchParams = {
    ...(currentVersion && {
      where: {
        version: { "eq": currentVersion.name }
      }
    })
  }

  return (
    <div>
      <SearchButton colorScheme={colorMode} className="DocSearch-Button" />
      {searchBoxConfig && (
        <SearchBox
          {...searchBoxConfig}
          colorScheme={colorMode}
          searchParams={searchParams}
          facetProperty="category"
        />
      )}
    </div>
  )
}

export default function OramaSearchWrapper() {
  return <OramaSearch />
}
