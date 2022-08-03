import React, { useEffect, useRef, useState } from "react";
// Had to manually import the ESM vesrion to satisfy GitHub actions requirements
import { create, insert, search, formatNanoseconds } from "@nearform/lyra/dist/esm/lyra";
import styles from "./style.module.css";
import dataset from "./events";

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

export function LyraDemo() {
  const [indexing, setIndexing] = useState(true);
  const [term, setTerm] = useState("");
  const [results, setResults] = useState([]);
  const [meta, setMeta] = useState({});
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [tolerance, setTolerance] = useState(0);
  const [exact, setExact] = useState(false);

  const searchReference = useRef(null);


  useEffect(() => {
    for (const data of dataset.result.events) {
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

    setIndexing(false);
    
    searchReference.current.focus();
  }, []);

  useEffect(() => {
    const { hits, count, elapsed } = search(db, {
      term,
      limit,
      offset,
      exact,
      tolerance,
    });

    setMeta({ count, elapsed });
    setResults(hits);
  }, [term, limit, offset, exact, tolerance]);

  return (
    <>
      <div className={styles.hero}>
        <h1> Try Lyra </h1>
        <p>
          Type a search term to perform a full-text search on a dataset of {formatNumber(dataset.result.count)}{" "}
          hystorical events
        </p>
      </div>

      <div className={styles.container}>
        <div className={styles.inputContainer}>
          <input
            tabindex="1"
            type="text"
            value={term}
            onChange={e => setTerm(e.target.value)}
            className={styles.input}
            ref={searchReference}
            placeholder="Eg: The Great War"
          />
        </div>

        <div className={styles.configurations}>
          <div className={styles.configuration}>
            <input
              id="exact"
              type="checkbox"
              className={styles.checkbox}
              checked={exact}
              onChange={() => setExact(!exact)}
            />
            <label htmlFor="exact">Exact</label>
          </div>
          <div className={styles.configuration}>
            <label htmlFor="limit">Limit</label>
            <input
              id="limit"
              type="number"
              value={limit}
              className={styles.smallInput}
              onChange={e => setLimit(parseInt(e.target.value))}
            />
          </div>
          <div className={styles.configuration}>
            <label htmlFor="offset">Offset</label>
            <input
              className={styles.smallInput}
              id="offset"
              type="number"
              value={offset}
              onChange={e => setOffset(parseInt(e.target.value))}
            />
          </div>
          <div className={styles.configuration}>
            <label htmlFor="tolerance">Typo tolerance</label>
            <input
              id="tolerance"
              type="number"
              value={tolerance}
              className={styles.smallInput}
              max={3}
              min={0}
              onChange={e => setTolerance(parseInt(e.target.value))}
            />
          </div>
        </div>

        {indexing && (
          <div className={styles.loading}>
            <p>Indexing {formatNumber(dataset.result.count)} events...</p>
          </div>
        )}

        {!indexing && (
          <>
            <div className={styles.meta}>
              <div>
                Results: <b>{(meta as any).count}</b>
              </div>
              <div>
                Elapsed: <i>{formatNanoseconds((meta as any).elapsed ?? 0)}</i>
              </div>
            </div>

            <div className={styles.overflow}>
              {results.map((result, i) => (
                <article key={i + result.description} className={styles.resultBox}>
                  <header className={styles.resultBoxHeader}>
                    {/* Year:  > */}
                    <b>{formatYear(result.date)} </b>
                    <span className={styles.id}>
                      {result.categories.category1}
                      {result.categories.category2 ? 
                      <>({result.categories.category2})</> : ""}.
                      Granularity: {result.granularity}
                    </span>
                  </header>
                  <p className={styles.txt}>{result.description}</p>
                </article>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
