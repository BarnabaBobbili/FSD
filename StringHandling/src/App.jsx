// jsx
import { useMemo, useState } from "react";
import "./App.css";

function toTitleCase(s) {
  return s
    .toLowerCase()
    .replace(/\b([a-z])/g, (_, c) => c.toUpperCase());
}
function wordsOf(s) {
  const t = s.trim();
  return t ? t.split(/\s+/) : [];
}
function reverseString(s) {
  return [...s].reverse().join("");
}
function countVowels(s) {
  const m = s.match(/[aeiou]/gi);
  return m ? m.length : 0;
}
function countConsonants(s) {
  const m = s.match(/[b-df-hj-np-tv-z]/gi);
  return m ? m.length : 0;
}

export default function App() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");

  const result = useMemo(() => {
    // Name calculations
    const nameTrim = name.trim();
    const nameWords = wordsOf(name);
    const nameCharsNoSpace = nameTrim.replace(/\s+/g, "").length;
    const initials = nameWords.map(w => w[0]?.toUpperCase()).filter(Boolean).join(". ");
    const firstName = nameWords[0] || "";
    const lastName = nameWords.length > 1 ? nameWords[nameWords.length - 1] : "";
    const nameVowels = countVowels(nameTrim);
    const nameCons = countConsonants(nameTrim);

    // Address calculations
    const addrTrim = address.trim();
    const addrLines = addrTrim ? addrTrim.split(/\r?\n/).map(l => l.trim()).filter(Boolean) : [];
    const addrSingleSpaced = addrTrim.replace(/\s+/g, " ").trim();
    const addrWords = wordsOf(addrTrim.replace(/\n/g, " "));
    const addrChars = addrTrim.length;
    const addrCharsNoWS = addrTrim.replace(/\s+/g, "").length;
    const addrDigits = (addrTrim.match(/\d/g) || []).length; // e.g., PIN or house no.

    return {
      name: {
        raw: name,
        trim: nameTrim,
        upper: nameTrim.toUpperCase(),
        lower: nameTrim.toLowerCase(),
        title: toTitleCase(nameTrim),
        reverse: reverseString(nameTrim),
        words: nameWords.length,
        chars: nameTrim.length,
        charsNoSpace: nameCharsNoSpace,
        initials: initials ? `${initials}.` : "",
        firstName,
        lastName,
        vowels: nameVowels,
        consonants: nameCons
      },
      address: {
        raw: address,
        trim: addrTrim,
        lines: addrLines,
        singleLine: addrSingleSpaced,
        words: addrWords.length,
        chars: addrChars,
        charsNoWS: addrCharsNoWS,
        digits: addrDigits
      }
    };
  }, [name, address]);

  const reset = () => {
    setName("");
    setAddress("");
  };

  return (
    <div className="container">
      <h1>String Utilities: Name & Address</h1>

      <div className="card">
        <div className="row">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            placeholder="e.g. Ada Lovelace"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="row">
          <label htmlFor="address">Address</label>
          <textarea
            id="address"
            rows={4}
            placeholder={"e.g.\n221B Baker Street\nLondon NW1"}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            style={{ width: "100%", resize: "vertical" }}
          />
        </div>

        <div className="actions">
          <button onClick={reset} type="button">Reset</button>
        </div>
      </div>

      {(name || address) && (
        <>
          {name && (
            <div className="card">
              <h2>Name Results</h2>
              <div><strong>Trimmed:</strong> {result.name.trim || "—"}</div>
              <div><strong>Upper:</strong> {result.name.upper}</div>
              <div><strong>Lower:</strong> {result.name.lower}</div>
              <div><strong>Title case:</strong> {result.name.title}</div>
              <div><strong>Reverse:</strong> {result.name.reverse}</div>
              <div><strong>Words:</strong> {result.name.words}</div>
              <div><strong>Chars:</strong> {result.name.chars} (no spaces: {result.name.charsNoSpace})</div>
              <div><strong>Initials:</strong> {result.name.initials || "—"}</div>
              <div><strong>First/Last:</strong> {result.name.firstName || "—"} {result.name.lastName ? `/ ${result.name.lastName}` : ""}</div>
              <div><strong>Vowels/Consonants:</strong> {result.name.vowels}/{result.name.consonants}</div>
            </div>
          )}

          {address && (
            <div className="card">
              <h2>Address Results</h2>
              <div><strong>Lines:</strong> {result.address.lines.length}</div>
              {result.address.lines.length > 0 && (
                <ul className="list">
                  {result.address.lines.map((l, i) => <li key={i}>{l}</li>)}
                </ul>
              )}
              <div><strong>Single line:</strong> {result.address.singleLine || "—"}</div>
              <div><strong>Words:</strong> {result.address.words}</div>
              <div><strong>Chars:</strong> {result.address.chars} (no whitespace: {result.address.charsNoWS})</div>
              <div><strong>Digits in address:</strong> {result.address.digits}</div>
            </div>
          )}
        </>
      )}
    </div>
  );
}