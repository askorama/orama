import React, { useEffect, useState } from "react";
import { create, insert, search, formatNanoseconds } from "@nearform/lyra";
import styles from "./style.module.css";
import dataset from "./divinaCommedia";

const db = create({
  schema: {
    txt: "string",
    id: "string"
  }
});

export function LyraDemo() {
  const [term, setTerm] = useState("");
  const [results, setResults] = useState([]);
  const [meta, setMeta] = useState({});
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [tolerance, setTolerance] = useState(0);
  const [exact, setExact] = useState(true);

  useEffect(() => {
    for (const data of dataset) {
      insert(db, data);
    }
  }, []);

  useEffect(() => {
    const { hits, count, elapsed } = search(db, {
      term,
      limit,
      offset,
      exact,
      properties: ["txt"],
      tolerance,
    });

    setMeta({ count, elapsed });
    setResults(hits);

  }, [term, limit, offset, exact, tolerance]);

  return (
    <>
      <div className={styles.hero}>
        <h1> Try Lyra </h1>
        <p> Type a search term to perform a full-text search on the full Divina Commedia </p>
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
            results.map(result => (
              <p key={result.id} className={styles.resultBox}>
                <span className={styles.id}> {result.id} </span>
                <span className={styles.txt}>{result.txt}</span>
              </p>
            ))
          }
        </div>
      </div>
    </>
  )
}