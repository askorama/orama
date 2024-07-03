import { useEffect, useState } from 'react'
import { OramaClient } from '@oramacloud/client'
import { SearchBox, SearchButton } from '@orama/searchbox'
import '@orama/searchbox/dist/index.css'

export const client = new OramaClient({
  api_key: 'NKiqTJnwnKsQCdxN7RyOBJgeoW5hJ594',
  endpoint: 'https://cloud.orama.run/v1/indexes/orama-docs-bzo330'
})

export function Search() {
  const [theme, setTheme] = useState()
  const [currentCategory, setCurrentCategory] = useState(null)

  function getCurrentCategory() {
    const url = new URL(window.location.href).pathname

    if (url.startsWith('/cloud')) return 'Cloud'
    if (url.startsWith('/open-source')) return 'Open Source'

    return null
  }

  function initSearchBox() {
    try {
      setTheme(document.documentElement.dataset.theme)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    initSearchBox()
  }, [])

  useEffect(() => {
    function callback(mutationList) {
      for (const mutation of mutationList) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
          setTheme(document.documentElement.dataset.theme)
        }
      }
    }

    const observer = new MutationObserver(callback)
    observer.observe(document.documentElement, { attributes: true })

    const category = getCurrentCategory()
    setCurrentCategory(category)

    return () => {
      observer.disconnect()
    }
  }, [])

  const oramaWhere = currentCategory ? {
    category: {
      eq: currentCategory
    }
  } : {}

  if (!theme) return null

  return (
    <>
      <SearchBox
        {...{
          oramaInstance: client,
          backdrop: true,
          colorScheme: theme,
          resultsMap: {
            description: 'content'
          },
          searchParams: {
            where: oramaWhere
          },
          setResultTitle: (doc) => doc.title.split('| Orama Docs')[0]
        }}
      />
      <SearchButton
        colorScheme={theme}
        themeConfig={{
          dark: {
            '--search-btn-background-color': '#201c27',
            '--search-btn-background-color-hover': '#201c27'
          }
        }}
      />
    </>
  )
}
