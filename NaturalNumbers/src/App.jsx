import "./App.css";

export default function App() {
  const numbers = Array.from({ length: 10 }, (_, i) => i + 1);

  return (
    <div className="container">
      <h1>First 10 Natural Numbers</h1>
      <ul>
        {numbers.map((num) => (
          <li key={num}>{num}</li>
        ))}
      </ul>
    </div>
  );
}
