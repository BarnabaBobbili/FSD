import { useState } from "react";
import "./App.css";

export default function App() {
  const [number, setNumber] = useState("");
  const [result, setResult] = useState("");

  const checkArmstrong = () => {
    const num = Number(number);

    if (isNaN(num)) {
      setResult("Please enter a valid number.");
      return;
    }

    let sum = 0;
    const digits = num.toString().split("");
    const power = digits.length;

    digits.forEach((digit) => {
      sum += Math.pow(Number(digit), power);
    });

    if (sum === num) {
      setResult(`${num} is an Armstrong number!`);
    } else {
      setResult(`${num} is NOT an Armstrong number.`);
    }
  };

  return (
    <div className="container">
      <h1>Armstrong Number Checker</h1>

      <input
        type="number"
        value={number}
        onChange={(e) => setNumber(e.target.value)}
        placeholder="Enter a number"
      />

      <button onClick={checkArmstrong}>Check</button>

      {result && <p className="result">{result}</p>}
    </div>
  );
}
