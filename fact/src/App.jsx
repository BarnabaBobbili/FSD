import { useState, useEffect } from "react";

// 1. Greatest of 3 numbers
function GreatestOfThree() {
  const [a, setA] = useState("");
  const [b, setB] = useState("");
  const [c, setC] = useState("");
  const [result, setResult] = useState(null);

  const findGreatest = () => {
    const n1 = parseFloat(a);
    const n2 = parseFloat(b);
    const n3 = parseFloat(c);
    if (isNaN(n1) || isNaN(n2) || isNaN(n3)) {
      setResult("Enter valid numbers");
      return;
    }
    setResult(Math.max(n1, n2, n3));
  };

  return (
    <div className="card">
      <h2>Greatest of 3 Numbers</h2>
      <input type="number" value={a} onChange={(e) => setA(e.target.value)} placeholder="Enter first number" />
      <input type="number" value={b} onChange={(e) => setB(e.target.value)} placeholder="Enter second number" />
      <input type="number" value={c} onChange={(e) => setC(e.target.value)} placeholder="Enter third number" />
      <button onClick={findGreatest}>Find Greatest</button>
      {result !== null && <p>Greatest: {result}</p>}
    </div>
  );
}

// 2. Factorial
function Factorial() {
  const [num, setNum] = useState("");
  const [result, setResult] = useState(null);

  const factorial = (n) => {
    if (n < 0) return "Not defined";
    let f = 1;
    for (let i = 1; i <= n; i++) f *= i;
    return f;
  };

  const handleCalc = () => {
    const n = parseInt(num);
    if (isNaN(n)) setResult("Enter valid number");
    else setResult(factorial(n));
  };

  return (
    <div className="card">
      <h2>Factorial</h2>
      <input type="number" value={num} onChange={(e) => setNum(e.target.value)} placeholder="Enter a number" />
      <button onClick={handleCalc}>Calculate</button>
      {result !== null && <p>Factorial: {result}</p>}
    </div>
  );
}

// 3. Armstrong number
function Armstrong() {
  const [num, setNum] = useState("");
  const [result, setResult] = useState(null);

  const isArmstrong = (n) => {
    let str = n.toString();
    let sum = 0;
    for (let ch of str) {
      sum += Math.pow(parseInt(ch), str.length);
    }
    return sum === n;
  };

  const handleCheck = () => {
    const n = parseInt(num);
    if (isNaN(n)) setResult("Enter valid number");
    else setResult(isArmstrong(n) ? "Armstrong Number" : "Not Armstrong");
  };

  return (
    <div className="card">
      <h2>Armstrong Number</h2>
      <input type="number" value={num} onChange={(e) => setNum(e.target.value)} placeholder="Enter a number" />
      <button onClick={handleCheck}>Check</button>
      {result && <p>{result}</p>}
    </div>
  );
}

// 4. Print first 10 natural numbers
function NaturalNumbers() {
  const numbers = Array.from({ length: 10 }, (_, i) => i + 1);

  return (
    <div className="card">
      <h2>First 10 Natural Numbers</h2>
      <p>{numbers.join(", ")}</p>
    </div>
  );
}

// 5. Four Box Game
function FourBoxGame() {
  const [activeBox, setActiveBox] = useState(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveBox(Math.floor(Math.random() * 4)); // random box 0–3
    }, 1000); // changes every second
    return () => clearInterval(interval);
  }, []);

  const handleClick = (index) => {
    if (index === activeBox) {
      setScore(score + 1);
    } else {
      setScore(score - 1);
    }
  };

  return (
    <div className="card">
      <h2>4 Box Game</h2>
      <div className="grid">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`box ${i === activeBox ? "active" : ""}`}
            onClick={() => handleClick(i)}
          >
            {i + 1}
          </div>
        ))}
      </div>
      <h3>Score: {score}</h3>
    </div>
  );
}

// 6. Electricity Bill Calculator (Slab Based)
function ElectricityBill() {
  const [name, setName] = useState("");
  const [id, setId] = useState("");
  const [type, setType] = useState("house"); // house or commercial
  const [units, setUnits] = useState("");
  const [bill, setBill] = useState(null);

  // slab-based calculation
  const calculateSlabBill = (u, type) => {
    let total = 0;

    if (type === "house") {
      // Example slabs for house
      // 0–100 → ₹3/unit
      // 101–200 → ₹5/unit
      // 201+ → ₹8/unit
      if (u <= 100) total = u * 3;
      else if (u <= 200) total = 100 * 3 + (u - 100) * 5;
      else total = 100 * 3 + 100 * 5 + (u - 200) * 8;
    } else {
      // Example slabs for commercial
      // 0–100 → ₹6/unit
      // 101–200 → ₹8/unit
      // 201+ → ₹10/unit
      if (u <= 100) total = u * 6;
      else if (u <= 200) total = 100 * 6 + (u - 100) * 8;
      else total = 100 * 6 + 100 * 8 + (u - 200) * 10;
    }

    // Add fixed charge
    const fixedCharge = type === "house" ? 50 : 100;
    return total + fixedCharge;
  };

  const calculateBill = () => {
    const u = parseFloat(units);
    if (isNaN(u) || u < 0 || !name || !id) {
      setBill("Please enter valid details");
      return;
    }

    const total = calculateSlabBill(u, type);

    setBill({
      name,
      id,
      type,
      units: u,
      total,
    });
  };

  return (
    <div className="card">
      <h2>Electricity Bill Calculator</h2>
      <input
        type="text"
        placeholder="Enter Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Enter Customer ID"
        value={id}
        onChange={(e) => setId(e.target.value)}
      />
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="house">House</option>
        <option value="commercial">Commercial</option>
      </select>
      <input
        type="number"
        placeholder="Enter Units Consumed"
        value={units}
        onChange={(e) => setUnits(e.target.value)}
      />
      <button onClick={calculateBill}>Calculate</button>

      {bill && typeof bill !== "string" && (
        <div style={{ textAlign: "left", marginTop: "15px" }}>
          <p><strong>Name:</strong> {bill.name}</p>
          <p><strong>ID:</strong> {bill.id}</p>
          <p><strong>Type:</strong> {bill.type}</p>
          <p><strong>Units:</strong> {bill.units}</p>
          <p><strong>Total Bill:</strong> ₹{bill.total}</p>
        </div>
      )}
      {typeof bill === "string" && <p style={{ color: "red" }}>{bill}</p>}
    </div>
  );
}



// Main App
export default function App() {
  const [section, setSection] = useState("menu");

  return (
    <div style={{ textAlign: "center", margin: "20px" }}>
      <h1>React Programs</h1>

      {section === "menu" && (
        <div>
          <h2>Select a Program</h2>
          <button onClick={() => setSection("greatest")}>Greatest of 3</button>
          <button onClick={() => setSection("factorial")}>Factorial</button>
          <button onClick={() => setSection("armstrong")}>Armstrong Number</button>
          <button onClick={() => setSection("natural")}>10 Natural Numbers</button>
          <button onClick={() => setSection("game")}>4 Box Game 🎮</button>
          <button onClick={() => setSection("bill")}>Electricity Bill ⚡</button>
        </div>
      )}

      {section === "greatest" && (
        <>
          <GreatestOfThree />
          <button onClick={() => setSection("menu")}>⬅ Back</button>
        </>
      )}
      {section === "factorial" && (
        <>
          <Factorial />
          <button onClick={() => setSection("menu")}>⬅ Back</button>
        </>
      )}
      {section === "armstrong" && (
        <>
          <Armstrong />
          <button onClick={() => setSection("menu")}>⬅ Back</button>
        </>
      )}
      {section === "natural" && (
        <>
          <NaturalNumbers />
          <button onClick={() => setSection("menu")}>⬅ Back</button>
        </>
      )}
      {section === "game" && (
        <>
          <FourBoxGame />
          <button onClick={() => setSection("menu")}>⬅ Back</button>
        </>
      )}
      {section === "bill" && (
        <>
          <ElectricityBill />
          <button onClick={() => setSection("menu")}>⬅ Back</button>
        </>
      )}
    </div>
  );
}