import React, { useEffect, useState } from "react";
// Had to manually import the ESM vesrion to satisfy GitHub actions requirements
import { create, formatNanoseconds, insert, search } from "@nearform/lyra/dist/esm/lyra";
import dataset from "./events";
import styles from "./style.module.css";

interface Hit {
  description: string;
  date: string;
  granularity: string;
  categories: {
    category1: string;
    category2: string;
  };
}

interface SearchResult {
  count: number;
  hits: Hit[];
  elapsed: bigint;
}

const db = create({
  schema: {
    date: "string",
    description: "string",
    categories: {
      category1: "string",
      category2: "string",
    },
    granularity: "string",
  },
});

function formatYear(date: string) {
  if (date.startsWith("-")) {
    return date.slice(1) + " BC";
  }

  return date;
}

function formatNumber(number: number) {
  return number.toLocaleString();
}

function Header({ count, percentageLoaded }: { count: number, percentageLoaded: number }) {
  return (
    <>
      <div className={`${styles.hero} ${percentageLoaded === 1 ? styles.heroCompleted : ''}  `}>
        <div>
          <h1> Try Lyra </h1>
          <p> Type a search term to perform a full-text search on a dataset of {formatNumber(count)} hystorical events </p>
        </div>
      </div>
      
      <div className={styles.loadingBarContainer}>
        <div className={styles.loadingBar} style={{
            width: (percentageLoaded *100 )+ "%"
        }}></div>
      </div>
    </>
  );
}

export function LyraDemo() {
  const [indexing, setIndexing] = useState(dataset.result.events.length);
  const [term, setTerm] = useState("");
  const [exact, setExact] = useState(false);
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [tolerance, setTolerance] = useState(0);
  const [results, setResults] = useState<SearchResult>(null);

  useEffect(() => {
    function addDocuments() {
      // We use Random here just to show a nice UI to the user
      const batch = dataset.result.events.splice(0, 300 + Math.floor(Math.random() * 1000));

      if (!batch.length) {
        setIndexing(0);
        return;
      }

      for (const data of batch) {
        insert(db, {
          date: data.date,
          description: data.description,
          categories: {
            category1: data.category1,
            category2: data.category2,
          },
          granularity: data.granularity,
        });
      }

      setIndexing(indexing => indexing - batch.length);
      requestAnimationFrame(addDocuments);
    }

    addDocuments();
  }, []);

  useEffect(() => {
    if (!term) {
      setResults(null);

      return;
    }

    setResults(
      search(db, {
        term,
        limit,
        offset,
        exact,
        tolerance,
      }),
    );
  }, [term, limit, offset, exact, tolerance]);

  if (indexing > 0) {
    return (
      <>
        <Header count={dataset.result.count} percentageLoaded={(dataset.result.count - indexing) / dataset.result.count} />
        <div className={styles.container}>
          <div className={styles.loading}>
            <h2>
              Indexing <strong>{formatNumber(indexing)} </strong> events
            </h2>
            <p>We will get back to you shortly ...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header count={dataset.result.count} percentageLoaded={1} />
      <div className={styles.container}>
        <label htmlFor="term">Term</label>
        <input
          id="term"
          type="text"
          value={term}
          onChange={e => setTerm(e.target.value)}
          className={styles.input}
          placeholder="Type a search term here..."
          tabIndex={0}
        />

        <div className={styles.configurations}>
          <div className={styles.configuration}>
            <label htmlFor="exact">Exact</label>
            <select id="exact" value={exact.toString()} onChange={() => setExact(exact => !exact)}>
              <option value={"false"}>No</option>
              <option value={"true"}>Yes</option>
            </select>
          </div>
          <div className={styles.configuration}>
            <label htmlFor="limit">Limit</label>
            <input id="limit" type="number" value={limit} onChange={e => setLimit(parseInt(e.target.value))} />
          </div>
          <div className={styles.configuration}>
            <label htmlFor="offset">Offset</label>
            <input id="offset" type="number" value={offset} onChange={e => setOffset(parseInt(e.target.value))} />
          </div>
          <div className={styles.configuration}>
            <label htmlFor="tolerance">Typo tolerance</label>
            <input
              id="tolerance"
              type="number"
              value={tolerance}
              max={3}
              min={0}
              onChange={e => setTolerance(parseInt(e.target.value))}
            />
          </div>
        </div>

        {results && (
          <>
            <h2>
              Found <strong>{results.count} results</strong> in <strong>{formatNanoseconds(results.elapsed)}</strong>
            </h2>

            <div className={styles.overflow}>
              {results.hits.map((result, i) => (
                <div key={i + result.description} className={styles.result}>
                  <header className={styles.resultHeader}>
                    <div>
                      <span className={styles.id}>
                        Year: <strong>{formatYear(result.date)}</strong>
                      </span>
                      <span className={styles.id}>
                        Granularity: <strong>{result.granularity}</strong>
                      </span>
                    </div>
                    <div>
                      <span className={styles.id}>
                        Category 1: <strong dangerouslySetInnerHTML={{__html: result.categories.category1}}></strong>
                      </span>
                      <span className={styles.id}>
                        Category 2: <strong dangerouslySetInnerHTML={{__html: result.categories.category2}}></strong>
                      </span>
                    </div>
                  </header>
                  <span className={styles.txt} dangerouslySetInnerHTML={{ __html: result.description }}></span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
