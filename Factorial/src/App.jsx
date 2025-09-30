import { useState } from "react";
import "./App.css";

export default function App() {
  const [number, setNumber] = useState("");
  const [result, setResult] = useState("");

  const calculateFactorial = () => {
    const num = Number(number);

    if (isNaN(num) || num < 0) {
      setResult("Please enter a valid non-negative number.");
      return;
    }

    let factorial = 1;
    for (let i = 2; i <= num; i++) {
      factorial *= i;
    }

    setResult(`Factorial of ${num} is ${factorial}`);
  };

  return (
    <div className="container">
      <h1>Factorial Calculator</h1>

      <input
        type="number"
        value={number}
        onChange={(e) => setNumber(e.target.value)}
        placeholder="Enter a non-negative number"
      />

      <button onClick={calculateFactorial}>Calculate</button>

      {result && <p className="result">{result}</p>}
    </div>
  );
}
