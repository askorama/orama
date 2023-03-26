import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState, useRef } from 'react'
import { create, insert, insertMultiple, search } from '@orama/orama'

const indexes = {}

function groupBy(arr, key) {
  return arr.reduce((accumulator, currentValue) => {
    const keyValue = currentValue.document[key];

    if (!accumulator[keyValue]) {
      accumulator[keyValue] = [];
    }

    accumulator[keyValue].push(currentValue);
    return accumulator;
  }, {});
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
        tokenizer: {
          stemming: false
        }
      }
    })
  }

  const index = indexes[locale]
  const paths = Object.keys(data)
  const documents = []

  for (const path of paths) {
    const url = path;
    const title = data[path].title;
    const content = data[path].data[''];

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

export function Search () {
  const [indexing, setIndexing] = useState(true)
  const [indexingError, setIndexingError] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [results, setResults] = useState()
  const [groupedResults, setGroupedResults] = useState({})
  const [hasFocus, setHasFocus] = useState(false)

  const { basePath, locale = 'en-US' } = useRouter()

  const inputRef = useRef(null)
  
  useEffect(() => {
    createIndex(basePath, locale)
      .catch((err) => setIndexingError(err))
      .finally(() => setIndexing(false))
  }, [])

  useEffect(() => {
    if (!indexing) {
      search(indexes[locale], {
        term: searchTerm,
        properties: ['title', 'content'],
        boost: {
          title: 2
        },
        limit: 1e6
      })
        .then((results) => {
          setResults(results)
          setGroupedResults(groupBy(results.hits, 'title'))
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
  }, []);

  return (
    <div className='nextra-search nx-relative md:nx-w-64 nx-hidden md:nx-inline-block mx-min-w-[200px]'>
      <div className='nx-relative nx-flex nx-items-center nx-text-gray-900 contrast-more:nx-text-gray-800 dark:nx-text-gray-300 contrast-more:dark:nx-text-gray-300'>
        <input
          ref={inputRef}
          spellCheck="false"
          type="search"
          placeholder="Search documentation..."
          className='nx-block nx-w-full nx-appearance-none nx-rounded-lg nx-px-3 nx-py-2 nx-transition-colors nx-text-base nx-leading-tight md:nx-text-sm nx-bg-black/[.05] dark:nx-bg-gray-50/10 focus:nx-bg-white dark:focus:nx-bg-dark placeholder:nx-text-gray-500 dark:placeholder:nx-text-gray-400 contrast-more:nx-border contrast-more:nx-border-current'
          onChange={(e) => setSearchTerm(e.target.value)}
          value={searchTerm}
          onFocus={() => setHasFocus(true)}
          onBlur={() => setHasFocus(false)}
        />
        {
          !hasFocus && (
            <kbd class="nx-absolute nx-my-1.5 nx-select-none ltr:nx-right-1.5 rtl:nx-left-1.5 nx-h-5 nx-rounded nx-bg-white nx-px-1.5 nx-font-mono nx-text-[10px] nx-font-medium nx-text-gray-500 nx-border dark:nx-border-gray-100/20 dark:nx-bg-dark/50 contrast-more:nx-border-current contrast-more:nx-text-current contrast-more:dark:nx-border-current nx-items-center nx-gap-1 nx-transition-opacity nx-z-20 nx-flex nx-cursor-pointer hover:nx-opacity-70" title="Clear">
              <span class="nx-text-xs">⌘</span>K
            </kbd>
          )
        }
        {
          hasFocus && (
            <kbd class="nx-absolute nx-my-1.5 nx-select-none ltr:nx-right-1.5 rtl:nx-left-1.5 nx-h-5 nx-rounded nx-bg-white nx-px-1.5 nx-font-mono nx-text-[10px] nx-font-medium nx-text-gray-500 nx-border dark:nx-border-gray-100/20 dark:nx-bg-dark/50 contrast-more:nx-border-current contrast-more:nx-text-current contrast-more:dark:nx-border-current nx-items-center nx-gap-1 nx-transition-opacity nx-z-20 nx-flex nx-cursor-pointer hover:nx-opacity-70" title="Clear">ESC</kbd>
          )
        }
      </div>
      {searchTerm && results && (
        <div className='nextra-scrollbar nx-border nx-border-gray-200 nx-bg-white nx-text-gray-100 dark:nx-border-neutral-800 dark:nx-bg-neutral-900 nx-absolute nx-top-full nx-z-20 nx-mt-2 nx-overflow-auto nx-overscroll-contain nx-rounded-xl nx-py-2.5 nx-shadow-xl nx-max-h-[min(calc(50vh-11rem-env(safe-area-inset-bottom)),400px)] md:nx-max-h-[min(calc(100vh-5rem-env(safe-area-inset-bottom)),400px)] nx-inset-x-0 ltr:md:nx-left-auto rtl:md:nx-right-auto contrast-more:nx-border contrast-more:nx-border-gray-900 contrast-more:dark:nx-border-gray-50 nx-w-screen nx-min-h-[100px] nx-max-w-[min(calc(100vw-2rem),calc(100%+20rem))]'>
          {results.count === 0 && (
            <div className='nx-block nx-select-none nx-p-8 nx-text-center nx-text-sm nx-text-gray-400'>
              No results found.
            </div>
          )}
          {results.count > 0 && (
            <div className='nx-px-3 nx-py-2.5 nx-text-sm nx-text-gray-500 dark:nx-text-gray-400'>
              <ul className='nextra-scrollbar nx-border nx-border-gray-200 nx-bg-white nx-text-gray-100 dark:nx-border-neutral-800 dark:nx-bg-neutral-900 nx-absolute nx-top-full nx-z-20 nx-mt-2 nx-overflow-auto nx-overscroll-contain nx-rounded-xl nx-py-2.5 nx-shadow-xl nx-max-h-[min(calc(50vh-11rem-env(safe-area-inset-bottom)),400px)] md:nx-max-h-[min(calc(100vh-5rem-env(safe-area-inset-bottom)),400px)] nx-inset-x-0 ltr:md:nx-left-auto rtl:md:nx-right-auto contrast-more:nx-border contrast-more:nx-border-gray-900 contrast-more:dark:nx-border-gray-50 nx-w-screen nx-min-h-[100px] nx-max-w-[min(calc(100vw-2rem),calc(100%+20rem))]'>
                {Object.keys(groupedResults)}
                {Object.keys(groupedResults).map((title) => (
                  <li key={title}>
                    <div className='nx-mx-2.5 nx-mb-2 nx-mt-6 nx-select-none nx-border-b nx-border-black/10 nx-px-2.5 nx-pb-1.5 nx-text-xs nx-font-semibold nx-uppercase nx-text-gray-500 first:nx-mt-0 dark:nx-border-white/20 dark:nx-text-gray-300 contrast-more:nx-border-gray-600 contrast-more:nx-text-gray-900 contrast-more:dark:nx-border-gray-50 contrast-more:dark:nx-text-gray-50'>
                      {title}
                    </div>
                    <ul className='nx-mt-1'>
                      {groupedResults[title].map(({ document }, i) => (
                        <li key={document.url + i}>
                          <Link href={document.url}>
                            <div> {document.title} </div>
                            <div> {document.content} </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
              <hr className='nx-my-4' style={{ border: '#282829 solid 0.5px' }} />
              <p className='nx-text-center'>
                <b>{results.count}</b> result{results.count > 1 && 's'} found in <b>{results.elapsed.formatted}</b>. Powered by <a href='https://oramasearch.com' target='_blank' className='nx-text-primary-600'><b>Orama</b></a>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}