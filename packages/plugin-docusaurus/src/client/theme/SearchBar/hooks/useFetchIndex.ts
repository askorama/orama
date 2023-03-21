import { useEffect, useState } from 'react'

interface UseFetchIndexReturn {
  index: never[]
  isLoading: boolean
}

const SEARCH_INDEX_AVAILABLE = process.env.NODE_ENV === 'production'

function useFetchIndex({ baseUrl }: { baseUrl: string }): UseFetchIndexReturn {
  const [index, setIndex] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (SEARCH_INDEX_AVAILABLE) {
      setIsLoading(true)
      fetch(`${baseUrl}orama-search-index.json`)
        .then(async result => result.json())
        .catch(() => {
          console.error("plugin-docusaurus: couldn't fetch index")
          return []
        })
        .then(setIndex)
        .finally(() => {
          setIsLoading(false)
        })
    }
  }, [baseUrl])

  return { index, isLoading }
}

export default useFetchIndex
