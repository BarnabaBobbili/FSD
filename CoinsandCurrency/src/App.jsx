// jsx
import { useState } from "react";
import "./App.css";

const INR_DENOMS = [
  { value: 200000, label: "₹2000 note" },
  { value: 50000, label: "₹500 note" },
  { value: 20000, label: "₹200 note" },
  { value: 10000, label: "₹100 note" },
  { value: 5000, label: "₹50 note" },
  { value: 2000, label: "₹20 note" },
  { value: 1000, label: "₹10 note/coin" },
  { value: 500, label: "₹5 coin" },
  { value: 200, label: "₹2 coin" },
  { value: 100, label: "₹1 coin" },
  { value: 50, label: "50 paise coin" },
  { value: 25, label: "25 paise coin" },
  { value: 10, label: "10 paise coin" },
  { value: 5, label: "5 paise coin" },
  { value: 1, label: "1 paise coin" }
];

export default function App() {
  const [amount, setAmount] = useState("");
  const [result, setResult] = useState(null);

  const calculate = () => {
    const num = Number(amount);
    if (!Number.isFinite(num) || num <= 0) {
      alert("Enter a valid amount > 0.");
      return;
    }

    const paise = Math.round(num * 100);
    let remaining = paise;
    const breakdown = [];
    let totalPieces = 0;

    for (const d of INR_DENOMS) {
      const count = Math.floor(remaining / d.value);
      if (count > 0) {
        breakdown.push({ label: d.label, count });
        totalPieces += count;
        remaining -= count * d.value;
      }
      if (remaining === 0) break;
    }

    setResult({
      amount: (paise / 100).toFixed(2),
      breakdown,
      totalPieces
    });
  };

  const reset = () => {
    setAmount("");
    setResult(null);
  };

  return (
    <div className="container">
      <h1>Minimum Notes and Coins (INR)</h1>

      <div className="card">
        <div className="row">
          <label htmlFor="amount">Amount (₹)</label>
          <input
            id="amount"
            type="number"
            step="0.01"
            min="0"
            placeholder="e.g. 1234.50"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <div className="actions">
          <button onClick={calculate}>Calculate</button>
          <button className="secondary" type="button" onClick={reset}>
            Reset
          </button>
        </div>
      </div>

      {result && (
        <div className="card">
          <h2>Breakdown</h2>
          <div><strong>Amount:</strong> ₹{result.amount}</div>
          <ul className="list">
            {result.breakdown.map((b, i) => (
              <li key={i}>
                {b.label} × {b.count}
              </li>
            ))}
          </ul>
          <div className="total">
            <strong>Total pieces:</strong> {result.totalPieces}
          </div>
        </div>
      )}
    </div>
  );
}