// jsx
import { useState } from "react";
import "./App.css";

function gradeFromPercent(pct) {
  if (pct >= 90) return { code: "O", point: 10 };
  if (pct >= 80) return { code: "A+", point: 9 };
  if (pct >= 70) return { code: "A", point: 8 };
  if (pct >= 60) return { code: "B+", point: 7 };
  if (pct >= 50) return { code: "B", point: 6 };
  if (pct >= 40) return { code: "C", point: 5 };
  if (pct >= 35) return { code: "P", point: 4 };
  return { code: "F", point: 0 };
}

export default function App() {
  const [student, setStudent] = useState({ name: "", regNo: "" });
  const [subs, setSubs] = useState([
    { name: "", credits: "", marks: "", outOf: "" }
  ]);
  const [result, setResult] = useState(null);

  const updateSub = (idx, patch) => {
    setSubs((prev) => prev.map((s, i) => (i === idx ? { ...s, ...patch } : s)));
  };

  const addSubject = () =>
    setSubs((prev) => [...prev, { name: "", credits: "", marks: "", outOf: "" }]);

  const removeSubject = (idx) =>
    setSubs((prev) => prev.filter((_, i) => i !== idx));

  const calculate = () => {
    const name = student.name.trim();
    const regNo = student.regNo.trim();
    if (!name || !regNo) {
      alert("Enter name and register number.");
      return;
    }
    if (subs.length === 0) {
      alert("Add at least one subject.");
      return;
    }

    let totalCredits = 0;
    let totalPoints = 0;
    const breakdown = [];

    for (const s of subs) {
      const subName = s.name.trim();
      const credits = Number(s.credits);
      const marks = Number(s.marks);
      const outOf = Number(s.outOf);

      if (!subName) {
        alert("Enter subject name for all rows.");
        return;
      }
      if (!Number.isFinite(credits) || credits <= 0) {
        alert("Enter valid positive credits for all subjects.");
        return;
      }
      if (!Number.isFinite(outOf) || outOf <= 0) {
        alert("Enter a valid 'out of' (> 0) for all subjects.");
        return;
      }
      if (!Number.isFinite(marks) || marks < 0 || marks > outOf) {
        alert("Enter valid marks (0 to out of) for all subjects.");
        return;
      }

      const pct = (marks / outOf) * 100;
      const { code, point } = gradeFromPercent(pct);

      totalCredits += credits;
      totalPoints += credits * point;

      breakdown.push({
        name: subName,
        credits,
        marks,
        outOf,
        pct: +pct.toFixed(2),
        grade: code,
        point
      });
    }

    if (totalCredits === 0) {
      alert("Total credits cannot be zero.");
      return;
    }

    const sgpa = +(totalPoints / totalCredits).toFixed(2);
    setResult({
      name,
      regNo,
      totalCredits,
      totalPoints: +totalPoints.toFixed(2),
      sgpa,
      breakdown
    });
  };

  const reset = () => {
    setStudent({ name: "", regNo: "" });
    setSubs([{ name: "", credits: "", marks: "", outOf: "" }]);
    setResult(null);
  };

  const liveGrade = (s) => {
    const marks = Number(s.marks);
    const outOf = Number(s.outOf);
    if (!Number.isFinite(marks) || !Number.isFinite(outOf) || outOf <= 0) return { text: "—" };
    const pct = (marks / outOf) * 100;
    const g = gradeFromPercent(pct);
    return { text: `${g.code} (${g.point}) • ${pct.toFixed(2)}%` };
  };

  return (
    <div className="container">
      <h1>SGPA Calculator</h1>

      <div className="card">
        <div className="row">
          <label>Name</label>
          <input
            value={student.name}
            onChange={(e) => setStudent({ ...student, name: e.target.value })}
            placeholder="e.g. Barnaba Bobbili"
          />
        </div>

        <div className="row">
          <label>Register No.</label>
          <input
            value={student.regNo}
            onChange={(e) => setStudent({ ...student, regNo: e.target.value })}
            placeholder="e.g. 25CS1234"
          />
        </div>
      </div>

      <div className="card">
        <h2>Subjects</h2>
        {subs.map((s, i) => (
          <div className="row" key={i}>
            <label>Subject {i + 1}</label>
            <div className="subGrid">
              <input
                placeholder="Subject name"
                value={s.name}
                onChange={(e) => updateSub(i, { name: e.target.value })}
              />
              <input
                type="number"
                min="0"
                step="0.5"
                placeholder="Credits"
                value={s.credits}
                onChange={(e) => updateSub(i, { credits: e.target.value })}
              />
              <input
                type="number"
                min="0"
                step="0.5"
                placeholder="Marks"
                value={s.marks}
                onChange={(e) => updateSub(i, { marks: e.target.value })}
              />
              <input
                type="number"
                min="1"
                step="1"
                placeholder="Out of"
                value={s.outOf}
                onChange={(e) => updateSub(i, { outOf: e.target.value })}
              />
              <div className="gradeCell">{liveGrade(s).text}</div>
            </div>
            <div style={{ gridColumn: "1 / -1", marginTop: 6 }}>
              <button type="button" onClick={() => removeSubject(i)}>Remove</button>
            </div>
          </div>
        ))}

        <div className="actions">
          <button type="button" onClick={addSubject}>Add subject</button>
        </div>
      </div>

      <div className="actions">
        <button onClick={calculate}>Calculate SGPA</button>
        <button type="button" onClick={reset}>Reset</button>
      </div>

      {result && (
        <div className="card">
          <h2>Result</h2>
          <div><strong>Name:</strong> {result.name}</div>
          <div><strong>Register No.:</strong> {result.regNo}</div>
          <div><strong>Total Credits:</strong> {result.totalCredits}</div>
          <div><strong>Total Grade Points:</strong> {result.totalPoints.toFixed(2)}</div>
          <div className="total"><strong>SGPA:</strong> {result.sgpa}</div>

          <h3>Breakdown</h3>
          <ul className="list">
            {result.breakdown.map((b, idx) => (
              <li key={idx}>
                {b.name}: {b.marks}/{b.outOf} ({b.pct}%) • Grade {b.grade} ({b.point}) • Credits {b.credits}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}