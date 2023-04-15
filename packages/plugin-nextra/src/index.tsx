import type { Result } from '@orama/orama'
import type { Position } from '@orama/plugin-match-highlight'
import * as NextLink from 'next/link.js'
import * as NextRouter from 'next/router.js'
import React, { useEffect, useRef, useState } from 'react'
import { searchWithHighlight } from '@orama/plugin-match-highlight'
import { createOramaIndex, groupDocumentsBy } from './utils/index.js'
import { HighlightedDocument } from './components/HighlightedDocument.js'

export type OramaSearchProps = {
  limitResults: number
  boost: {
    title: number
    description: number
    content: number
  }
}

const Link = NextLink.default
const Router = NextRouter.default

const indexes = {}

const defaultProps: OramaSearchProps = {
  limitResults: 30,
  boost: {
    title: 2,
    description: 1,
    content: 1,
  },
}

export function OramaSearch(props = defaultProps) {
  const [indexing, setIndexing] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [results, setResults] = useState()
  const [groupedResults, setGroupedResults] = useState({})
  const [hasFocus, setHasFocus] = useState(false)

  const { basePath, locale = 'en-US', asPath } = Router?.useRouter() || {}

  const inputRef = useRef(null)
  const wrapperRef = useRef(null)

  // As soon as the page loads, we create the index on the client-side
  useEffect(() => {
    setIndexing(true)
    
    createOramaIndex(basePath, locale)
      .then((index) => {
        indexes[locale] = index
        setIndexing(false)
      })
    }, [])

  // If the locale changes, we create the index on the client-side
  useEffect(() => {
    if (!(locale in indexes)) {
      setIndexing(true)
      createOramaIndex(basePath, locale)
        .then((index) => {
          indexes[locale] = index
          setIndexing(false)
        })
    }
  }, [basePath, locale])

  // If the user types something, we search for it
  useEffect(() => {
    if (searchTerm) {
      searchWithHighlight(indexes[locale], {
        term: searchTerm,
        limit: props.limitResults,
        boost: props.boost,
      })
      .then((results) => {
        setResults(results)
        setGroupedResults(groupDocumentsBy(results.hits, 'collection'))
      })
    }

  }, [searchTerm])

  // If the user presses ESC, we close the search box
  useEffect(() => {
    if (document.activeElement === inputRef.current) {
      setHasFocus(true)
    } else {
      setHasFocus(false)
    }
  }, [])

  // If the user presses ESC, we close the search box
  useEffect(() => {
    setHasFocus(false)
    setSearchTerm('')
  }, [asPath])

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
                              <Link.default href={document.url}>
                                <div className="excerpt nx-mt-1 nx-text-sm nx-leading-[1.35rem] nx-text-gray-600 dark:nx-text-gray-400 contrast-more:dark:nx-text-gray-50">
                                  <HighlightedDocument hit={{ document, positions } as Result & { positions: Position[]; }} />
                                </div>
                              </Link.default>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </li>
                  ))}
                </ul>
                <div
                  className="nx-sticky nx-p-4 nx-text-sm nx-bottom-0 bg-neutral-100 contrast-more:dark:nx-bg-neutral-900"
                  style={{ transform: 'translate(0px, 11px)' }}
                >
                  <p className="nx-text-center nx-text-gray-600 contrast-more:dark:nx-bg-neutral-100">
                    <b>{results.count}</b> result{results.count > 1 && 's'} found in <b>{results.elapsed.formatted}</b>.
                    Powered by{' '}
                    <a href="https://oramasearch.com?utm_source=nextra_plugin" target="_blank" className="nx-text-primary-600">
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