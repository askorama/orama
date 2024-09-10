import type { TypedDocument } from '@orama/orama'
import type { SearchResultWithHighlight } from '@orama/plugin-match-highlight'
import { searchWithHighlight } from '@orama/plugin-match-highlight'
import { useRouter } from 'next/compat/router.js'
import React, { useEffect, useRef, useState } from 'react'
import { NextraOrama, groupDocumentsBy } from './utils/index.js'
import { inputStyles, inputWrapper, kbdStyles, titleDiv, wrapperDiv, wrapperUl } from './utils/classNames.js'
import { OramaFooter } from './components/OramaFoter.js'
import { SearchResult } from './components/Result.js'
import { useCreateOramaIndex } from './utils/useCreateOramaIndex.js'
import { useFocus } from './utils/useFocus.js'

export type OramaSearchProps = {
  limitResults: number
  boost: {
    title: number
    description: number
    content: number
  }
}

const defaultProps: OramaSearchProps = {
  limitResults: 30,
  boost: {
    title: 2,
    description: 1,
    content: 1
  }
}

export function OramaSearch(props = defaultProps) {
  const router = useRouter()

  return router?.isReady ? <OramaSearchPlugin {...props} router={router} /> : null
}

function OramaSearchPlugin({ router, ...props }) {
  const inputRef = useRef(null)
  const wrapperRef = useRef(null)
  const { indexes } = useCreateOramaIndex()
  const { hasFocus, setHasFocus } = useFocus({
    inputRef
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [results, setResults] = useState<SearchResultWithHighlight<TypedDocument<NextraOrama>>>()
  const [groupedResults, setGroupedResults] = useState({})

  const { locale = 'en-US', asPath } = router

  // If the path changes, we close the search box
  useEffect(() => {
    setSearchTerm('')
  }, [asPath])

  // If the user types something, we search for it
  useEffect(() => {
    if (searchTerm) {
      searchWithHighlight(indexes[locale], {
        term: searchTerm,
        mode: 'fulltext',
        limit: props.limitResults,
        boost: props.boost
      }).then((results) => {
        setResults(results)
        setGroupedResults(groupDocumentsBy(results.hits, 'title'))
      })
    }
  }, [searchTerm])

  return (
    <div className={wrapperDiv}>
      <div className={inputWrapper}>
        <input
          ref={inputRef}
          spellCheck="false"
          type="search"
          placeholder="Search documentation..."
          className={inputStyles}
          onChange={(e) => setSearchTerm(e.target.value)}
          value={searchTerm}
          onFocus={() => setHasFocus(true)}
          onBlur={() => {
            setHasFocus(false)
          }}
        />

        <kbd className={kbdStyles} title="Clear">
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
        <>
          {results.count === 0 && (
            <div className="nx-block nx-select-none nx-p-8 nx-text-center nx-text-sm nx-text-gray-400">
              No results found.
            </div>
          )}
          {results.count > 0 && (
            <>
              <div ref={wrapperRef}>
                <ul className={wrapperUl} style={{ transition: 'max-height 0.2s ease 0s' }}>
                  {Object.keys(groupedResults).map((title) => (
                    <>
                      <div className={titleDiv} key={title}>
                        {title}
                      </div>

                      {groupedResults[title].map(({ document, positions }, i) => (
                        <SearchResult positions={positions} key={document.url + i} document={document} />
                      ))}
                    </>
                  ))}
                  <OramaFooter results={results} />
                </ul>
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}
