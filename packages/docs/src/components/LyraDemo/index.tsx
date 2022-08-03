import React, { useEffect, useState } from "react";
// Had to manually import the ESM vestion to satisfy GitHub actions requirements
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
  }
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
        <p> Type a search term to perform a full-text search on a dataset of {formatNumber(dataset.result.count)} hystorical events </p>
      </div>

      <div className={styles.container}>
        <input
          type="text"
          value={term}
          onChange={e => setTerm(e.target.value)}
          className={styles.input}
          placeholder="Type a search term here..."
        />

        <div className={styles.configurations}>
          <div>
            <label htmlFor="exact">Exact</label>
            <input id="exact" type="checkbox" checked={exact} onChange={() => setExact(!exact)} />
          </div>
          <div>
            <label htmlFor="limit">Limit</label>
            <input id="limit" type="number" value={limit} onChange={(e) => setLimit(parseInt(e.target.value))} />
          </div>
          <div>
            <label htmlFor="offset">Offset</label>
            <input id="offset" type="number" value={offset} onChange={(e) => setOffset(parseInt(e.target.value))} />
          </div>
          <div>
            <label htmlFor="tolerance">Typo tolerance</label>
            <input id="tolerance" type="number" value={tolerance} max={3} min={0} onChange={(e) => setTolerance(parseInt(e.target.value))} />
          </div>
        </div>

        {
          indexing && (
            <div className={styles.loading}>
              <p>Indexing {formatNumber(dataset.result.count)} events...</p>
            </div>
          )
        }

        {
          !indexing && (
            <>
              <div className={styles.meta}>
                <div>
                  Results: {(meta as any).count}
                </div>
                <div>
                  Elapsed: {formatNanoseconds((meta as any).elapsed ?? 0)}
                </div>
              </div>

              <div className={styles.overflow}>
                {
                  results.map((result, i) => (
                    <p key={i + result.description} className={styles.resultBox}>
                      <span className={styles.id}> Year: {formatYear(result.date)} </span>
                      <span className={styles.id}>{result.categories.category1} ({result.categories.category2}). Granularity: {result.granularity}</span>
                      <span className={styles.txt}>{result.description}</span>
                    </p>
                  ))
                }
              </div>
            </>
          )
        }
      </div>
    </>
  )
}