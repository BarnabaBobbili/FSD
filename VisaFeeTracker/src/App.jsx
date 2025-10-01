// jsx
import { useState } from "react";
import "./App.css";

const BASE_COST = 3000;

const COUNTRIES = [
  { value: "thailand", label: "Thailand", order: 1 },
  { value: "dubai", label: "Dubai", order: 2 },
  { value: "usa", label: "USA", order: 3 },
  { value: "japan", label: "Japan", order: 4 },
  { value: "russia", label: "Russia", order: 5 }
];

// Number to words (Indian system)
const ONES = [
  "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
  "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
  "Seventeen", "Eighteen", "Nineteen"
];
const TENS = [
  "", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"
];

function twoDigitsToWords(n) {
  if (n < 20) return ONES[n];
  const t = Math.floor(n / 10), o = n % 10;
  return TENS[t] + (o ? " " + ONES[o] : "");
}
function toIndianWords(n) {
  if (n === 0) return "Zero";
  const parts = [];
  const crore = Math.floor(n / 10000000);
  const lakh = Math.floor((n % 10000000) / 100000);
  const thousand = Math.floor((n % 100000) / 1000);
  const hundred = Math.floor((n % 1000) / 100);
  const rest = n % 100;

  if (crore) parts.push(twoDigitsToWords(crore) + " Crore");
  if (lakh) parts.push(twoDigitsToWords(lakh) + " Lakh");
  if (thousand) parts.push(twoDigitsToWords(thousand) + " Thousand");
  if (hundred) parts.push(ONES[hundred] + " Hundred");
  if (rest) parts.push((parts.length ? "and " : "") + twoDigitsToWords(rest));
  return parts.join(" ");
}
function rupeesInWords(n) {
  return `Rupees ${toIndianWords(n)} only`;
}
const fmtINR = (n) => `₹${n.toLocaleString("en-IN")}`;

export default function App() {
  const [form, setForm] = useState({
    name: "",
    country: "thailand",
    applicants: "1"
  });
  const [result, setResult] = useState(null);

  const calculate = () => {
    const name = form.name.trim();
    const country = COUNTRIES.find(c => c.value === form.country) || COUNTRIES[0];
    const applicants = Math.max(1, parseInt(form.applicants || "1", 10));

    const multiplier = 4 * country.order;
    const perVisa = BASE_COST * multiplier;
    const total = perVisa * applicants;

    setResult({
      name,
      country: country.label,
      order: country.order,
      base: BASE_COST,
      multiplier,
      perVisa,
      applicants,
      total,
      words: rupeesInWords(total)
    });
  };

  const reset = () => {
    setForm({ name: "", country: "thailand", applicants: "1" });
    setResult(null);
  };

  return (
    <div className="container">
      <h1>Visa Fee Tracker</h1>

      <div className="card">
        <div className="row">
          <label>Passenger name</label>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="e.g. Sunless"
          />
        </div>

        <div className="row">
          <label>Country</label>
          <select
            value={form.country}
            onChange={(e) => setForm({ ...form, country: e.target.value })}
          >
            {COUNTRIES.map(c => (
              <option key={c.value} value={c.value}>
                {c.order}. {c.label}
              </option>
            ))}
          </select>
        </div>

        <div className="row">
          <label>Applicants</label>
          <input
            type="number"
            min="1"
            step="1"
            value={form.applicants}
            onChange={(e) => setForm({ ...form, applicants: e.target.value })}
          />
        </div>

        <div className="actions">
          <button onClick={calculate}>Calculate</button>
          <button className="secondary" type="button" onClick={reset}>Reset</button>
        </div>
      </div>

      {result && (
        <div className="card">
          <h2>Fee Details</h2>
          <div><strong>Name:</strong> {result.name || "—"}</div>
          <div><strong>Country:</strong> {result.country} (order {result.order})</div>
          <div><strong>Base cost:</strong> {fmtINR(result.base)}</div>
          <div><strong>Multiplier:</strong> 4 × {result.order} = {result.multiplier}</div>
          <div><strong>Per-visa fee:</strong> {fmtINR(result.perVisa)}</div>
          <div><strong>Applicants:</strong> {result.applicants}</div>
          <div className="total"><strong>Total:</strong> {fmtINR(result.total)}</div>
          <div><strong>In words:</strong> {result.words}</div>
        </div>
      )}
    </div>
  );
}