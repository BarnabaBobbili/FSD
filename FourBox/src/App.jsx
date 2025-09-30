import { useState } from "react";
import "./App.css";

export default function App() {
  const [n, setN] = useState(1); // initial input
  const [boxes, setBoxes] = useState([1, 2, 4, 8]); // default n, 2n, 4n, 8n
  const [error, setError] = useState("");

  const initializeBoxes = () => {
    if (n <= 0 || isNaN(n)) {
      setError("Please enter a valid positive number.");
      return;
    }
    setBoxes([n, 2 * n, 4 * n, 8 * n]);
    setError("");
  };

  const doubleBalls = () => {
    setBoxes(boxes.map((b) => b * 2));
  };

  const consolidateBoxes = () => {
    const total = boxes.reduce((a, b) => a + b, 0);
    setBoxes([total, 0, 0, 0]);
  };

  const combinePairs = () => {
    if (boxes.length < 4) return;
    setBoxes([
      boxes[0] + boxes[1],
      boxes[2] + boxes[3],
      0,
      0
    ]);
  };

  const resetGame = () => {
    setN(1);
    setBoxes([1, 2, 4, 8]);
    setError("");
  };

  return (
    <div className="container">
      <h1>4 Box Game</h1>

      <div className="input-section">
        <input
          type="number"
          value={n}
          onChange={(e) => setN(Number(e.target.value))}
          placeholder="Enter initial number"
        />
        <button onClick={initializeBoxes}>Start Game</button>
        <button onClick={resetGame} className="reset">Reset</button>
      </div>

      {error && <p className="error">{error}</p>}

      <div className="boxes-grid">
        {boxes.map((count, index) => (
          <div key={index} className="box">
            <div className="ball-count">{count}</div>
          </div>
        ))}
      </div>

      <div className="actions">
        <button onClick={doubleBalls}>Double Balls</button>
        <button onClick={consolidateBoxes}>Consolidate Boxes</button>
        <button onClick={combinePairs}>Combine Pairs</button>
      </div>
    </div>
  );
}
