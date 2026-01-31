import React, { useState, useEffect } from "react";
import axios from "axios";
import PositionsTable from "./components/PositionsTable";
import TransactionForm from "./components/TransactionForm";

function App() {
  const [positions, setPositions] = useState([]);
  const [transaction, setTransaction] = useState({
    tradeId: "",
    version: "",
    securityCode: "",
    quantity: "",
    action: "INSERT",
    buySell: "Buy"
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPositions();
  }, []);

  const validateTransaction = (tx) => {
  if (!tx.tradeId || tx.tradeId <= 0) return "TradeId must be positive.";
  if (!tx.version || tx.version < 1) return "Version must be >= 1.";
  if (!tx.securityCode || tx.securityCode.trim() === "") return "SecurityCode is required.";
  if (tx.securityCode.length > 10) return "SecurityCode must be <= 10 characters.";
  if (!tx.quantity || tx.quantity <= 0) return "Quantity must be positive.";
  return null; // valid
};

  const fetchPositions = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get("http://localhost:5130/api/transactions/positions");
      setPositions(res.data);
    } catch (err) {
      setError("Failed to load positions. Please try again later.");
      console.error("Error fetching positions:", err);
    } finally {
      setLoading(false);
    }
  };

const submitTransaction = async () => {
  const validationError = validateTransaction(transaction);
  if (validationError) {
    setError(`${validationError}`);
    return; // stop here
  }
  // Basic validation
  if (
    !transaction.tradeId ||
    !transaction.version ||
    !transaction.securityCode.trim() ||
    !transaction.quantity ||
    transaction.quantity <= 0
  ) {
    setError("Please fill in all required fields with valid values.");
    return; // Stop here, don't call API
  }

  setLoading(true);
  setError("");
  try {
    const res = await axios.post("http://localhost:5130/api/transactions", transaction);
    setPositions(res.data);

    // Reset form after success
    setTransaction({
      tradeId: "",
      version: "",
      securityCode: "",
      quantity: "",
      action: "INSERT",
      buySell: "Buy"
    });
  } catch (err) {
    setError("Failed to submit transaction. Please check your input.");
    console.error("Error submitting transaction:", err);
  } finally {
    setLoading(false);
  }
};


  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <PositionsTable positions={positions} />
      <TransactionForm
        transaction={transaction}
        setTransaction={setTransaction}
        onSubmit={submitTransaction}
      />
    </div>
  );
}

export default App;
