import { useState } from "react";
import "./App.css";

export default function App() {
  const [num1, setNum1] = useState("");
  const [num2, setNum2] = useState("");
  const [num3, setNum3] = useState("");
  const [result, setResult] = useState("");

  const findGreatest = () => {
    const a = Number(num1);
    const b = Number(num2);
    const c = Number(num3);

    if (isNaN(a) || isNaN(b) || isNaN(c)) {
      setResult("Please enter valid numbers.");
      return;
    }

    const greatest = Math.max(a, b, c);
    setResult(`Greatest number is: ${greatest}`);
  };

  return (
    <div className="container">
      <h1>Greatest of 3 Numbers</h1>

      <input
        type="number"
        value={num1}
        onChange={(e) => setNum1(e.target.value)}
        placeholder="Enter first number"
      />
      <input
        type="number"
        value={num2}
        onChange={(e) => setNum2(e.target.value)}
        placeholder="Enter second number"
      />
      <input
        type="number"
        value={num3}
        onChange={(e) => setNum3(e.target.value)}
        placeholder="Enter third number"
      />

      <button onClick={findGreatest}>Find Greatest</button>

      {result && <p className="result">{result}</p>}
    </div>
  );
}
