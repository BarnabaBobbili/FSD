import { useState } from "react";
import "./App.css";

export default function App() {
  const [limit, setLimit] = useState(10);

  const numbers = Array.from({ length: limit }, (_, i) => i + 1);

  return (
    <div className="container">
      <h1>Numbers from 1 to {limit}</h1>
      <input
        type="number"
        value={limit}
        onChange={(e) => setLimit(Number(e.target.value))}
        placeholder="Enter a number"
      />
      <ul>
        {numbers.map((num) => (
          <li key={num}>{num}</li>
        ))}
      </ul>
    </div>
  );
}
