// jsx
import { useState } from "react";
import "./App.css";

const ONES = [
  "", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
  "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen",
  "Seventeen", "Eighteen", "Nineteen"
];
const TENS = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

function twoDigitsToWords(n) {
  if (n < 20) return ONES[n];
  const t = Math.floor(n / 10), o = n % 10;
  return TENS[t] + (o ? " " + ONES[o] : "");
}
function toIndianWords(n) {
  if (n === 0) return "Zero";
  const parts = [];
  const crore = Math.floor(n / 1e7);
  const lakh = Math.floor((n % 1e7) / 1e5);
  const thousand = Math.floor((n % 1e5) / 1e3);
  const hundred = Math.floor((n % 1e3) / 100);
  const rest = n % 100;
  if (crore) parts.push(twoDigitsToWords(crore) + " Crore");
  if (lakh) parts.push(twoDigitsToWords(lakh) + " Lakh");
  if (thousand) parts.push(twoDigitsToWords(thousand) + " Thousand");
  if (hundred) parts.push(ONES[hundred] + " Hundred");
  if (rest) parts.push((parts.length ? "and " : "") + twoDigitsToWords(rest));
  return parts.join(" ");
}
function amountInWords(amount) {
  const rupees = Math.floor(amount);
  const paise = Math.round((amount - rupees) * 100);
  const rupeeWords = toIndianWords(rupees);
  if (paise > 0) return `Rupees ${rupeeWords} and ${twoDigitsToWords(paise)} Paise only`;
  return `Rupees ${rupeeWords} only`;
}
const fmtINR = (n) => `₹${n.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export default function App() {
  const [form, setForm] = useState({
    billNo: "",
    vendor: "",
    item: "",
    date: "",
    qty: "",
    cost: ""
  });
  const [result, setResult] = useState(null);

  const calculate = () => {
    const qty = Number(form.qty);
    const cost = Number(form.cost);
    if (!Number.isFinite(qty) || qty <= 0 || !Number.isFinite(cost) || cost <= 0) {
      alert("Enter valid positive Quantity and Cost.");
      return;
    }
    const total = +(qty * cost).toFixed(2);

    // Updated category mapping: A(0–1000), B(1001–2000), C(2001–3000), D(>3000)
    const { code: category, note: categoryNote } = (() => {
      if (total <= 1000) return { code: "A", note: "Total between ₹0 and ₹1000" };
      if (total <= 2000) return { code: "B", note: "Total between ₹1001 and ₹2000" };
      if (total <= 3000) return { code: "C", note: "Total between ₹2001 and ₹3000" };
      return { code: "D", note: "Total above ₹3000" };
    })();

    const discountPct = 10;
    const discountAmt = +((discountPct / 100) * total).toFixed(2);
    const final = +(total - discountAmt).toFixed(2);

    const unitDigit = Math.floor(final) % 10;      // after discount
    const words = amountInWords(final);            // after discount

    setResult({
      ...form,
      qty,
      cost,
      total,
      category,
      categoryNote,
      discountPct,
      discountAmt,
      final,
      unitDigit,
      words
    });
  };

  const reset = () => {
    setForm({ billNo: "", vendor: "", item: "", date: "", qty: "", cost: "" });
    setResult(null);
  };

  return (
    <div className="container">
      <h1>Bill Calculator</h1>

      <div className="card">
        <div className="row">
          <label>Bill No.</label>
          <input value={form.billNo} onChange={(e) => setForm({ ...form, billNo: e.target.value })} />
        </div>
        <div className="row">
          <label>Vendor</label>
          <input value={form.vendor} onChange={(e) => setForm({ ...form, vendor: e.target.value })} />
        </div>
        <div className="row">
          <label>Item</label>
          <input value={form.item} onChange={(e) => setForm({ ...form, item: e.target.value })} />
        </div>
        <div className="row">
          <label>Date</label>
          <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
        </div>
        <div className="row">
          <label>Quantity</label>
          <input type="number" min="1" step="1" value={form.qty} onChange={(e) => setForm({ ...form, qty: e.target.value })} />
        </div>
        <div className="row">
          <label>Cost (per unit)</label>
          <input type="number" min="0" step="0.01" value={form.cost} onChange={(e) => setForm({ ...form, cost: e.target.value })} />
        </div>

        <div className="actions">
          <button onClick={calculate}>Calculate</button>
          <button type="button" onClick={reset}>Reset</button>
        </div>
      </div>

      {result && (
        <>
          <div className="card">
            <h2>Summary</h2>
            <div><strong>Bill No.:</strong> {result.billNo || "—"}</div>
            <div><strong>Vendor:</strong> {result.vendor || "—"}</div>
            <div><strong>Item Name:</strong> {result.item || "—"}</div>
            <div><strong>Date:</strong> {result.date || "—"}</div>
            <div><strong>Total (before discount):</strong> {fmtINR(result.total)}</div>
            <div><strong>Category:</strong> {result.category}</div>
            <div><strong>Discount:</strong> {result.discountPct}% (−{fmtINR(result.discountAmt)})</div>
            <div className="total"><strong>Final Amount:</strong> {fmtINR(result.final)}</div>
            <div><strong>Unit digit (₹) after discount:</strong> {result.unitDigit}</div>
            <div><strong>Total in words (after discount):</strong> {result.words}</div>
          </div>

          {/* Category rules section */}
          <div className="card">
            <h2>Category Rules</h2>
            <ul className="rules">
              <li><strong>A:</strong> ₹0 to ₹1,000{result.category === "A" ? " (applied)" : ""}</li>
              <li><strong>B:</strong> ₹1,001 to ₹2,000{result.category === "B" ? " (applied)" : ""}</li>
              <li><strong>C:</strong> ₹2,001 to ₹3,000{result.category === "C" ? " (applied)" : ""}</li>
              <li><strong>D:</strong> greater than ₹3,000{result.category === "D" ? " (applied)" : ""}</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
}