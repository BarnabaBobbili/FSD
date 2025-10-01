// jsx
import { useState, useMemo } from "react";
import "./App.css";

export default function App() {
  const [num, setNum] = useState("");
  const [limit, setLimit] = useState(10);

  const rows = useMemo(() => {
    const n = Number(num);
    const L = Math.max(1, parseInt(limit || 0, 10));
    if (!Number.isFinite(n)) return [];
    return Array.from({ length: L }, (_, i) => {
      const k = i + 1;
      return { k, expr: `${k} ×  ${n} = ${k * n}` };
    });
  }, [num, limit]);

  const reset = () => {
    setNum("");
    setLimit(10);
  };

  return (
    <div className="container">
      <h1>Multiplication Table</h1>

      <div className="card">
        <div className="row">
          <label htmlFor="number">Number</label>
          <input
            id="number"
            type="number"
            step="1"
            placeholder="e.g. 7"
            value={num}
            onChange={(e) => setNum(e.target.value)}
          />
        </div>

        <div className="row">
          <label htmlFor="limit">Up to</label>
          <input
            id="limit"
            type="number"
            min="1"
            step="1"
            placeholder="e.g. 10"
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
          />
        </div>

        <div className="actions">
          <button type="button" onClick={reset}>Reset</button>
        </div>
      </div>

      {rows.length > 0 && (
        <div className="card">
          <h2>Table</h2>

          {/* chunk rows into groups of 10 */}
          {(() => {
            const chunkSize = 10;
            const chunks = [];
            for (let i = 0; i < rows.length; i += chunkSize) {
              chunks.push(rows.slice(i, i + chunkSize));
            }
            return (
              <div className="tableGrid">
                {chunks.map((chunk, idx) => (
                  <ul className="list" key={idx}>
                    {chunk.map(r => (
                      <li key={r.k}>{r.expr}</li>
                    ))}
                  </ul>
                ))}
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}