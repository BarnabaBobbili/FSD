// jsx
import { useState } from "react";
import "./App.css";

const CATEGORIES = [
  { value: "electronics", label: "Electronics" },
  { value: "clothing", label: "Clothing" },
  { value: "grocery", label: "Grocery" },
  { value: "furniture", label: "Furniture" },
  { value: "other", label: "Other" }
];

const STATIC_DISCOUNTS = {
  electronics: 10,
  clothing: 15,
  grocery: 5,
  furniture: 8,
  other: 2
};

// Dynamic rules: price slabs
const PRICE_SLABS = {
  electronics: [
    { min: 100000, pct: 18 },
    { min: 50000, pct: 15 },
    { min: 0, pct: 10 }
  ],
  clothing: [
    { min: 10000, pct: 25 },
    { min: 5000, pct: 20 },
    { min: 0, pct: 15 }
  ],
  grocery: [
    { min: 3000, pct: 10 },
    { min: 2000, pct: 7.5 },
    { min: 0, pct: 5 }
  ],
  furniture: [
    { min: 50000, pct: 15 },
    { min: 20000, pct: 12 },
    { min: 0, pct: 8 }
  ],
  other: [
    { min: 20000, pct: 7 },
    { min: 10000, pct: 5 },
    { min: 0, pct: 2 }
  ]
};

// Dynamic rules: quantity based
const QTY_SLABS = {
  electronics: [
    { minQty: 5, pct: 18 },
    { minQty: 3, pct: 12 },
    { minQty: 1, pct: 8 }
  ],
  clothing: [
    { minQty: 10, pct: 25 },
    { minQty: 5, pct: 18 },
    { minQty: 1, pct: 12 }
  ],
  grocery: [
    { minQty: 20, pct: 8 },
    { minQty: 10, pct: 6 },
    { minQty: 1, pct: 3 }
  ],
  furniture: [
    { minQty: 3, pct: 14 },
    { minQty: 2, pct: 10 },
    { minQty: 1, pct: 6 }
  ],
  other: [
    { minQty: 10, pct: 5 },
    { minQty: 5, pct: 3 },
    { minQty: 1, pct: 1 }
  ]
};

function getPriceSlabDiscount(category, price) {
  const slabs = PRICE_SLABS[category] || PRICE_SLABS.other;
  const slab = slabs.find(s => price >= s.min) || slabs[slabs.length - 1];
  return { pct: slab.pct, reason: `Price slab ≥ ₹${slab.min.toLocaleString()}` };
}

function getQuantityDiscount(category, qty) {
  const slabs = QTY_SLABS[category] || QTY_SLABS.other;
  const slab = slabs.find(s => qty >= s.minQty) || slabs[slabs.length - 1];
  return { pct: slab.pct, reason: `Qty slab ≥ ${slab.minQty}` };
}

export default function App() {
  const [form, setForm] = useState({
    name: "",
    category: "electronics",
    price: "",
    mode: "static",        // "static" | "dynamic"
    dynamicType: "price",  // "price" | "quantity"
    quantity: ""           // used when dynamicType === "quantity"
  });
  const [result, setResult] = useState(null);

  const calculate = () => {
    const name = form.name.trim();
    const price = Number(form.price);
    const qty = form.dynamicType === "quantity" ? Number(form.quantity || 0) : 1;

    if (!name || !Number.isFinite(price) || price <= 0) {
      alert("Enter valid product name and price (> 0).");
      return;
    }
    if (form.mode === "dynamic" && form.dynamicType === "quantity" && (!Number.isFinite(qty) || qty <= 0)) {
      alert("Enter a valid quantity (> 0) for quantity-based discount.");
      return;
    }

    let pct, ruleNote;
    if (form.mode === "static") {
      pct = STATIC_DISCOUNTS[form.category] ?? 0;
      ruleNote = "Static table";
    } else {
      if (form.dynamicType === "price") {
        const { pct: p, reason } = getPriceSlabDiscount(form.category, price);
        pct = p; ruleNote = `Dynamic (Price slab) — ${reason}`;
      } else {
        const { pct: p, reason } = getQuantityDiscount(form.category, qty);
        pct = p; ruleNote = `Dynamic (Quantity based) — ${reason}`;
      }
    }

    const discountAmount = +(price * (pct / 100)).toFixed(2);
    const finalPrice = +(price - discountAmount).toFixed(2);

    setResult({
      name,
      category: form.category,
      mode: form.mode,
      dynamicType: form.dynamicType,
      price,
      quantity: qty,
      pct,
      discountAmount,
      finalPrice,
      ruleNote
    });
  };

  const reset = () => {
    setForm({
      name: "",
      category: "electronics",
      price: "",
      mode: "static",
      dynamicType: "price",
      quantity: ""
    });
    setResult(null);
  };

  return (
    <div className="container">
      <h1>Discount Calculator</h1>

      <div className="card">
        <div className="row">
          <label>Product name</label>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="e.g. Bluetooth Headphones"
          />
        </div>

        <div className="row">
          <label>Category</label>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            {CATEGORIES.map(c => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>

        <div className="row">
          <label>Price (₹)</label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            placeholder="e.g. 12999"
          />
        </div>

        <div className="row">
          <label>Mode</label>
          <div style={{ display: "flex", gap: 12 }}>
            <label>
              <input
                type="radio"
                name="mode"
                value="static"
                checked={form.mode === "static"}
                onChange={(e) => setForm({ ...form, mode: e.target.value })}
              /> Static
            </label>
            <label>
              <input
                type="radio"
                name="mode"
                value="dynamic"
                checked={form.mode === "dynamic"}
                onChange={(e) => setForm({ ...form, mode: e.target.value })}
              /> Dynamic
            </label>
          </div>
        </div>

        {form.mode === "dynamic" && (
          <>
            <div className="row">
              <label>Dynamic type</label>
              <div style={{ display: "flex", gap: 12 }}>
                <label>
                  <input
                    type="radio"
                    name="dynamicType"
                    value="price"
                    checked={form.dynamicType === "price"}
                    onChange={(e) => setForm({ ...form, dynamicType: e.target.value })}
                  /> Price slab
                </label>
                <label>
                  <input
                    type="radio"
                    name="dynamicType"
                    value="quantity"
                    checked={form.dynamicType === "quantity"}
                    onChange={(e) => setForm({ ...form, dynamicType: e.target.value })}
                  /> Quantity based
                </label>
              </div>
            </div>

            {form.dynamicType === "quantity" && (
              <div className="row">
                <label>Quantity</label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={form.quantity}
                  onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                  placeholder="e.g. 3"
                />
              </div>
            )}
          </>
        )}

        <div className="actions">
          <button onClick={calculate}>Calculate</button>
          <button className="secondary" type="button" onClick={reset}>Reset</button>
        </div>
      </div>

      {result && (
        <div className="card">
          <h2>Result</h2>
          <div><strong>Product:</strong> {result.name}</div>
          <div><strong>Category:</strong> {result.category}</div>
          <div><strong>Mode:</strong> {result.mode}</div>
          {result.mode === "dynamic" && (
            <div><strong>Dynamic type:</strong> {result.dynamicType}</div>
          )}
          {result.mode === "dynamic" && result.dynamicType === "quantity" && (
            <div><strong>Quantity:</strong> {result.quantity}</div>
          )}
          <div><strong>Rule:</strong> {result.ruleNote}</div>
          <div><strong>Price:</strong> ₹{result.price.toFixed(2)}</div>
          <div><strong>Discount:</strong> {result.pct}% (₹{result.discountAmount.toFixed(2)})</div>
          <div className="total"><strong>Final price:</strong> ₹{result.finalPrice.toFixed(2)}</div>
        </div>
      )}
    </div>
  );
}