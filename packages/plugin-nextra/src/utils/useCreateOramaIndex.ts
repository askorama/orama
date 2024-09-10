import { useEffect, useState } from 'react'
import { createOramaIndex } from './index.js'
import { useRouter } from 'next/router.js'

export const useCreateOramaIndex = () => {
  const [, setIndexing] = useState(false)
  const [indexes, setIndexes] = useState({})
  const router = useRouter()
  const { basePath, locale = 'en-US' } = router

  // As soon as the page loads, we create the index on the client-side
  useEffect(() => {
    setIndexing(true)

    createOramaIndex(basePath, locale).then((index) => {
      setIndexes((i) => ({
        ...i,
        [locale]: index
      }))
      setIndexing(false)
    })
  }, [])

  // If the locale changes, we create the index on the client-side
  useEffect(() => {
    if (!(locale in indexes)) {
      setIndexing(true)
      createOramaIndex(basePath, locale).then((index) => {
        setIndexes((i) => ({
          ...i,
          [locale]: index
        }))
        setIndexing(false)
      })
    }
  }, [basePath, locale])

  return { indexes }
}
