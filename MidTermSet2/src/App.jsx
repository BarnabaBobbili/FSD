// App.js
import React, { useState } from "react";

function App() {
  const [baseTariff, setBaseTariff] = useState("");
  const [advanceAmount, setAdvanceAmount] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [paymentDate, setPaymentDate] = useState("");
  const [lastDate, setLastDate] = useState("");

  const [houseTax, setHouseTax] = useState(0);
  const [drainageTax, setDrainageTax] = useState(0);
  const [maintenanceTax, setMaintenanceTax] = useState(0);
  const [totalTax, setTotalTax] = useState(0);
  const [showTax, setShowTax] = useState(false);

  const [discount, setDiscount] = useState(0);
  const [finalBill, setFinalBill] = useState(0);
  const [showDiscount, setShowDiscount] = useState(false);

  const [paymentBill, setPaymentBill] = useState(0);
  const [fineAmount, setFineAmount] = useState(0);
  const [showPayment, setShowPayment] = useState(false);

  // Calculate Taxes
  const calculateTax = () => {
    const b = Number(baseTariff) || 0;
    const a = Number(advanceAmount) || 0;

    const ht = +(0.10 * b).toFixed(2);
    const dt = +((b + ht) * 0.06).toFixed(2);
    const mt = +(0.05 * b).toFixed(2);
    const total = +(b + ht + dt + mt - a).toFixed(2);

    setHouseTax(ht);
    setDrainageTax(dt);
    setMaintenanceTax(mt);
    setTotalTax(total);
    setShowTax(true);

    // Reset discount and payment displays
    setShowDiscount(false);
    setShowPayment(false);
  };

  // Check Discount
  const checkDiscount = () => {
    let discountPercent = 0;

    if (totalTax >= 100 && totalTax <= 4000) discountPercent = 5;
    else if (totalTax >= 4001 && totalTax <= 5000) discountPercent = 10;
    else if (totalTax >= 5001 && totalTax <= 6000) discountPercent = 12;
    else if (totalTax >= 6001 && totalTax <= 7000) discountPercent = 14;

    const discountAmount = +(totalTax * (discountPercent / 100)).toFixed(2);
    setDiscount(discountAmount);
    setFinalBill((totalTax - discountAmount).toFixed(2));
    setShowDiscount(true);

    // Reset payment display
    setShowPayment(false);
  };

  // Check Payment
  const checkPayment = () => {
    const payDate = new Date(paymentDate);
    const lastPayDate = new Date(lastDate);
  
    if (payDate <= lastPayDate) {
      // Paid on time or before due date → no fine
      setFineAmount(0);
      setPaymentBill(totalTax);
    } else {
      // Paid late → calculate fine
      const diffTime = payDate - lastPayDate; // days late
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      let finePercent = 0;
  
      if (diffDays < 30) finePercent = 10;
      else if (diffDays >= 31 && diffDays <= 60) finePercent = 15;
      else if (diffDays > 60) finePercent = 25;
  
      const fine = +(totalTax * (finePercent / 100)).toFixed(2);
      setFineAmount(fine);
      setPaymentBill((totalTax + fine).toFixed(2));
    }
    setShowPayment(true);
  };
  

  return (
    <div style={{ padding: "20px", fontFamily: "Arial", maxWidth: "500px", margin: "auto" }}>
      <h2>Corporation Tax Bill Calculator</h2>

      <div>
        <label>Customer ID: </label>
        <input value={customerId} onChange={(e) => setCustomerId(e.target.value)} />
      </div>

      <div>
        <label>Base Tariff: </label>
        <input type="number" value={baseTariff} onChange={(e) => setBaseTariff(e.target.value)} />
      </div>

      <div>
        <label>Advance Amount: </label>
        <input type="number" value={advanceAmount} onChange={(e) => setAdvanceAmount(e.target.value)} />
      </div>

      <div>
        <label>Payment Date: </label>
        <input type="date" value={paymentDate} onChange={(e) => setPaymentDate(e.target.value)} />
      </div>

      <div>
        <label>Last Date of Payment: </label>
        <input type="date" value={lastDate} onChange={(e) => setLastDate(e.target.value)} />
      </div>

      <button onClick={calculateTax} style={{ marginTop: "10px" }}>Calculate Tax</button>

      {showTax && (
        <div style={{ marginTop: "20px" }}>
          <p><strong>Base Tariff:</strong> {baseTariff}</p>
          <p><strong>House Tax (10%):</strong> {houseTax}</p>
          <p><strong>Drainage Tax (6% of Base+House):</strong> {drainageTax}</p>
          <p><strong>Maintenance Tax (5%):</strong> {maintenanceTax}</p>
          <p><strong>Advance Amount:</strong> {advanceAmount || 0}</p>
          <p><strong>Total Tax:</strong> {totalTax}</p>
        </div>
      )}

      <button onClick={checkDiscount} style={{ marginTop: "10px" }}>Check Discount</button>
      {showDiscount && (
        <div style={{ marginTop: "10px" }}>
          <p><strong>Discount:</strong> {discount}</p>
          <p><strong>Total Bill after Discount:</strong> {finalBill}</p>
        </div>
      )}

      <button onClick={checkPayment} style={{ marginTop: "10px" }}>Check Payment</button>
      {showPayment && (
        <div style={{ marginTop: "10px" }}>
          <p><strong>Fine Amount:</strong> {fineAmount}</p>
          <p><strong>Total Bill to be Paid (including fine):</strong> {paymentBill}</p>
        </div>
      )}
    </div>
  );
}

export default App;
