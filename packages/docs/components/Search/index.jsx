import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState, useRef } from 'react'
import { create, insertMultiple } from '@orama/orama'
import { getNanosecondsTime, formatNanoseconds } from '@orama/orama/internals'
import { afterInsert as highlightAfterInsertHook, searchWithHighlight } from '@orama/plugin-match-highlight'

const indexes = {}

function HighlightedDocument({ hit, trim = 200 }) {
  const getHighlightedText = (text, positions) => {
    let highlightedText = ''
    let currentIndex = 0

    positions.forEach(position => {
      const start = position.start
      const length = position.length
      highlightedText +=
        text.slice(currentIndex, start) + '<span class="nx-text-primary-600">' + text.substr(start, length) + '</span>'
      currentIndex = start + length
    })

    highlightedText += text.slice(currentIndex)
    return highlightedText
  }

  const trimContent = (content, maxLength) => {
    if (content.length > maxLength) {
      return content.slice(0, maxLength) + '...'
    }
    return content
  }

  const highlightDocument = () => {
    const highlightedDocument = { ...hit.document }

    for (const property in hit.positions) {
      if (hit.positions[property]) {
        const positionsArray = Object.values(hit.positions[property]).flat()
        highlightedDocument[property] = getHighlightedText(highlightedDocument[property], positionsArray)
      }
    }

    highlightedDocument.content = trimContent(highlightedDocument.content, trim)

    return highlightedDocument
  }

  const highlightedDocument = highlightDocument()

  return (
    <div>
      <div
        className="nx-text-base nx-font-semibold nx-leading-5"
        dangerouslySetInnerHTML={{ __html: highlightedDocument.title }}
      />
      <div dangerouslySetInnerHTML={{ __html: highlightedDocument.content }} />
    </div>
  )
}

function groupBy(arr, key) {
  return arr.reduce((accumulator, currentValue) => {
    const keyValue = currentValue.document[key]

    if (!accumulator[keyValue]) {
      accumulator[keyValue] = []
    }

    accumulator[keyValue].push(currentValue)
    return accumulator
  }, {})
}

async function createIndex(basePath, locale) {
  const response = await fetch(`${basePath}/_next/static/chunks/nextra-data-${locale}.json`)
  const data = await response.json()

  if (!(locale in indexes)) {
    indexes[locale] = await create({
      schema: {
        title: 'string',
        url: 'string',
        content: 'string',
      },
      components: {
        afterInsert: [highlightAfterInsertHook],
        tokenizer: {
          stemming: false,
        },
      },
    })
  }

  const index = indexes[locale]
  const paths = Object.keys(data)
  const documents = []

  for (const path of paths) {
    const url = path
    const title = data[path].title
    const content = data[path].data['']

    documents.push({
      title,
      url,
      content,
    })

    const sectionData = data[path].data
    delete sectionData['']

    for (const sectionTitle in sectionData) {
      const [hash, title] = sectionTitle.split('#')
      const content = sectionData[sectionTitle]

      documents.push({
        title,
        url: `${url}#${hash}`,
        content,
      })
    }
  }

  await insertMultiple(index, documents)
}

const queryCache = new Map()

export function Search() {
  const [indexing, setIndexing] = useState(true)
  const [indexingError, setIndexingError] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [results, setResults] = useState()
  const [groupedResults, setGroupedResults] = useState({})
  const [hasFocus, setHasFocus] = useState(false)

  const { basePath, locale = 'en-US' } = useRouter()

  const inputRef = useRef(null)
  const wrapperRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setHasFocus(false)
        setSearchTerm('')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [wrapperRef])

  useEffect(() => {
    createIndex(basePath, locale)
      .catch(err => setIndexingError(err))
      .finally(() => setIndexing(false))
  }, [])

  async function getCachedResults(cacheKey) {
    const start = await getNanosecondsTime()
    const results = queryCache.get(cacheKey)
    const elapsed = (await getNanosecondsTime()) - start

    results.elapsed = {
      raw: elapsed,
      formatted: await formatNanoseconds(elapsed),
    }

    setResults(results)
    setGroupedResults(groupBy(results.hits, 'title'))
  }

  useEffect(() => {
    if (!indexing) {
      const cacheKey = `${locale}-${searchTerm}`

      if (queryCache.has(cacheKey)) {
        getCachedResults(cacheKey)
        // eslint-disable-next-line
        return () => {}
      }

      searchWithHighlight(indexes[locale], {
        term: searchTerm,
        properties: ['title', 'content'],
        boost: {
          title: 2,
        },
        limit: 1e6,
      })
        .then(results => {
          setResults(results)
          setGroupedResults(groupBy(results.hits, 'title'))

          queryCache.set(cacheKey, results)
        })
        .catch(console.error)
    }
  }, [searchTerm])

  useEffect(() => {
    if (document.activeElement === inputRef.current) {
      setHasFocus(true)
    } else {
      setHasFocus(false)
    }
  }, [])

  return (
    <div className="nextra-search nx-relative md:nx-w-64 nx-hidden md:nx-inline-block mx-min-w-[200px]">
      <div className="nx-relative nx-flex nx-items-center nx-text-gray-900 contrast-more:nx-text-gray-800 dark:nx-text-gray-300 contrast-more:dark:nx-text-gray-300">
        <input
          ref={inputRef}
          spellCheck="false"
          type="search"
          placeholder="Search documentation..."
          className="nx-block nx-w-full nx-appearance-none nx-rounded-lg nx-px-3 nx-py-2 nx-transition-colors nx-text-base nx-leading-tight md:nx-text-sm nx-bg-black/[.05] dark:nx-bg-gray-50/10 focus:nx-bg-white dark:focus:nx-bg-dark placeholder:nx-text-gray-500 dark:placeholder:nx-text-gray-400 contrast-more:nx-border contrast-more:nx-border-current"
          onChange={e => setSearchTerm(e.target.value)}
          value={searchTerm}
          onFocus={() => setHasFocus(true)}
          onBlur={() => {
            setHasFocus(false)
          }}
        />

        <kbd
          className="nx-absolute nx-my-1.5 nx-select-none ltr:nx-right-1.5 rtl:nx-left-1.5 nx-h-5 nx-rounded nx-bg-white nx-px-1.5 nx-font-mono nx-text-[10px] nx-font-medium nx-text-gray-500 nx-border dark:nx-border-gray-100/20 dark:nx-bg-dark/50 contrast-more:nx-border-current contrast-more:nx-text-current contrast-more:dark:nx-border-current nx-items-center nx-gap-1 nx-transition-opacity nx-z-20 nx-flex nx-cursor-pointer hover:nx-opacity-70"
          title="Clear"
        >
          {hasFocus ? (
            'ESC'
          ) : (
            <>
              <span className="nx-text-xs">⌘</span> K
            </>
          )}
        </kbd>
      </div>
      {searchTerm && results && (
        <div className="nextra-scrollbar nx-border nx-border-gray-200 nx-bg-white nx-text-gray-100 dark:nx-border-neutral-800 dark:nx-bg-neutral-900 nx-absolute nx-top-full nx-z-20 nx-mt-2 nx-overflow-auto nx-overscroll-contain nx-rounded-xl nx-py-2.5 nx-shadow-xl nx-max-h-[min(calc(50vh-11rem-env(safe-area-inset-bottom)),400px)] md:nx-max-h-[min(calc(100vh-5rem-env(safe-area-inset-bottom)),400px)] nx-inset-x-0 ltr:md:nx-left-auto rtl:md:nx-right-auto contrast-more:nx-border contrast-more:nx-border-gray-900 contrast-more:dark:nx-border-gray-50 nx-w-screen nx-min-h-[100px] nx-max-w-[min(calc(100vw-2rem),calc(100%+20rem))]">
          {results.count === 0 && (
            <div className="nx-block nx-select-none nx-p-8 nx-text-center nx-text-sm nx-text-gray-400">
              No results found.
            </div>
          )}
          {results.count > 0 && (
            <>
              <div ref={wrapperRef}>
                <ul>
                  {Object.keys(groupedResults).map(title => (
                    <li key={title} className="nx-bg-primary-600">
                      <div className="nx-mx-2.5 nx-mb-2 nx-mt-6 nx-select-none nx-border-b nx-border-black/10 nx-px-2.5 nx-pb-1.5 nx-text-xs nx-font-semibold nx-uppercase nx-text-gray-500 first:nx-mt-0 dark:nx-border-white/20 dark:nx-text-gray-300 contrast-more:nx-border-gray-600 contrast-more:nx-text-gray-900 contrast-more:dark:nx-border-gray-50 contrast-more:dark:nx-text-gray-50">
                        {title}
                      </div>
                      <div className="nx-block nx-scroll-m-12 nx-px-2.5 nx-py-2 nx-mb-2">
                        <ul className="nx-mt-1">
                          {groupedResults[title].map(({ document, positions }, i) => (
                            <li
                              key={document.url + i}
                              className="nx-p-4 nx-mx-2.5 nx-break-words nx-rounded-md hover:nx-bg-primary-500 nx-text-primary-600"
                            >
                              <Link href={document.url}>
                                <div className="excerpt nx-mt-1 nx-text-sm nx-leading-[1.35rem] nx-text-gray-600 dark:nx-text-gray-400 contrast-more:dark:nx-text-gray-50">
                                  <HighlightedDocument hit={{ document, positions }} />
                                </div>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </li>
                  ))}
                </ul>
                <div
                  className="nx-sticky nx-p-4 nx-text-sm nx-bottom-0 nx-bg-neutral-900"
                  style={{ transform: 'translate(0px, 11px)' }}
                >
                  <p className="nx-text-center">
                    <b>{results.count}</b> result{results.count > 1 && 's'} found in <b>{results.elapsed.formatted}</b>.
                    Powered by{' '}
                    <a href="https://oramasearch.com" target="_blank" className="nx-text-primary-600">
                      <b>Orama</b>
                    </a>
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
