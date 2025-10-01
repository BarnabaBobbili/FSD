// jsx
import { useMemo, useState } from "react";
import "./App.css";

function calcComponents(basic) {
  const b = Number(basic) || 0;
  const da = +(0.30 * b).toFixed(2);
  const hra = +(0.10 * b).toFixed(2);
  const sa = +(0.05 * b).toFixed(2);
  const total = +(b + da + hra + sa).toFixed(2);
  return { b, da, hra, sa, total };
}

function calcGrade(total) {
  if (total >= 10000 && total <= 20000) return "A";
  if (total >= 20001 && total <= 30000) return "B";
  if (total >= 30001 && total <= 40000) return "C";
  if (total > 40000) return "EXC";
  return "NA";
}

function calcBonus(grade, basic) {
  const b = Number(basic) || 0;
  switch (grade) {
    case "A": return +(0.15 * b).toFixed(2);
    case "B": return +(0.12 * b).toFixed(2);
    case "C": return +(0.06 * b).toFixed(2);
    case "EX":
    case "EXC": return +(0.05 * b).toFixed(2);
    default: return 0;
  }
}

export default function App() {
  const [basic, setBasic] = useState("");
  const [grade, setGrade] = useState("");
  const [bonus, setBonus] = useState(null);

  const parts = useMemo(() => calcComponents(basic), [basic]);

  const onCheckGrade = () => setGrade(calcGrade(parts.total));
  const onCheckBonus = () => {
    const g = grade || calcGrade(parts.total);
    setGrade(g);
    setBonus(calcBonus(g, parts.b));
  };

  const reset = () => {
    setBasic("");
    setGrade("");
    setBonus(null);
  };

  return (
    <div className="container">
      <h1>Employee Tax Calculator</h1>

      <div className="card">
        <div className="row">
          <label>Basic Pay (₹)</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={basic}
            onChange={(e) => setBasic(e.target.value)}
            placeholder="e.g. 18000"
          />
        </div>

        <div className="row">
          <label>DA (30%)</label>
          <input value={parts.da} readOnly />
        </div>

        <div className="row">
          <label>HRA (10%)</label>
          <input value={parts.hra} readOnly />
        </div>

        <div className="row">
          <label>Special Allowance (5%)</label>
          <input value={parts.sa} readOnly />
        </div>

        <div className="row">
          <label>Total Salary</label>
          <input value={parts.total} readOnly />
        </div>

        <div className="actions">
          <button onClick={onCheckGrade}>Check_grade</button>
          <button onClick={onCheckBonus}>check_bonus</button>
          <button type="button" onClick={reset}>Reset</button>
        </div>
      </div>

      {(grade || bonus !== null) && (
        <div className="card">
          <h2>Result</h2>
          {grade && <div><strong>Grade:</strong> {grade}</div>}
          {bonus !== null && <div><strong>Bonus (₹):</strong> {bonus.toFixed(2)}</div>}
        </div>
      )}
    </div>
  );
}