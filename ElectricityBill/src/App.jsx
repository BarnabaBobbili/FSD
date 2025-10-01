import React, { useState } from "react";
import "./App.css";

export default function App() {
  const [formData, setFormData] = useState({
    name: "",
    id: "",
    type: "residential",
    units: ""
  });
  const [bill, setBill] = useState(null);

  const pricing = {
    residential: {
      fixedCharge: 50,
      slabs: [
        { min: 0, max: 100, rate: 3 },
        { min: 101, max: 200, rate: 4.5 },
        { min: 201, max: 300, rate: 6 },
        { min: 301, max: Infinity, rate: 7.5 }
      ]
    },
    commercial: {
      fixedCharge: 100,
      slabs: [
        { min: 0, max: 100, rate: 5 },
        { min: 101, max: 200, rate: 7 },
        { min: 201, max: 300, rate: 9 },
        { min: 301, max: Infinity, rate: 11 }
      ]
    }
  };

  const calculateBill = () => {
    const name = formData.name.trim();
    const id = formData.id.trim();
    const type = formData.type;
    const units = Number(formData.units);

    if (!name || !id || !Number.isFinite(units) || units <= 0) {
      alert("Enter valid Name, ID and Units (> 0).");
      return;
    }

    const { fixedCharge, slabs } = pricing[type];

    let lastMax = 0;
    let energyCharge = 0;
    const details = [];

    for (const slab of slabs) {
      const appliedFrom = slab.min;                  // e.g., 0, 101, 201, ...
      const appliedTo = Math.min(units, slab.max);   // cap by user's units
      const count = Math.max(0, appliedTo - lastMax); // how many units fall in this slab

      if (count > 0) {
        const amount = count * slab.rate;
        energyCharge += amount;
        details.push({
          from: appliedFrom,
          to: appliedTo === Infinity ? Infinity : appliedTo,
          units: count,
          rate: slab.rate,
          amount
        });
      }

      lastMax = Math.min(slab.max, units);
      if (lastMax >= units) break;
    }

    setBill({
      name,
      id,
      type,
      fixedCharge,
      details,
      energyCharge,
      total: fixedCharge + energyCharge
    });
  };

  const reset = () => {
    setFormData({ name: "", id: "", type: "residential", units: "" });
    setBill(null);
  };

  return (
    <div className="container">
      <h1>Electricity Bill Calculator</h1>

      <div className="card">
        <div className="row">
          <label>Name</label>
          <input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter name"
          />
        </div>

        <div className="row">
          <label>ID</label>
          <input
            value={formData.id}
            onChange={(e) => setFormData({ ...formData, id: e.target.value })}
            placeholder="Enter ID"
          />
        </div>

        <div className="row">
          <label>Type</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          >
            <option value="residential">Residential</option>
            <option value="commercial">Commercial</option>
          </select>
        </div>

        <div className="row">
          <label>Units</label>
          <input
            type="number"
            min="1"
            step="1"
            value={formData.units}
            onChange={(e) => setFormData({ ...formData, units: e.target.value })}
            placeholder="e.g. 235"
          />
        </div>

        <div className="actions">
          <button onClick={calculateBill}>Calculate</button>
          <button className="secondary" onClick={reset} type="button">
            Reset
          </button>
        </div>
      </div>

      {bill && (
        <div className="card">
          <h2>Bill Details</h2>
          <div><strong>Name:</strong> {bill.name}</div>
          <div><strong>ID:</strong> {bill.id}</div>
          <div><strong>Type:</strong> {bill.type}</div>
          <div><strong>Fixed charge:</strong> Rs.{bill.fixedCharge.toFixed(2)}</div>

          <h3>Slab-wise charges</h3>
          <ul className="list">
            {bill.details.map((d, i) => (
              <li key={i}>
                Units {d.from} to {d.to === Infinity ? "∞" : d.to}: {d.units} units at Rs.{d.rate}/unit = Rs.{d.amount.toFixed(2)}
              </li>
            ))}
          </ul>

          <div><strong>Energy charge:</strong> Rs.{bill.energyCharge.toFixed(2)}</div>
          <div className="total"><strong>Total:</strong> Rs.{bill.total.toFixed(2)}</div>
        </div>
      )}
    </div>
  );
}

