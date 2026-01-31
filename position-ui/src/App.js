import React, { useState, useEffect } from "react";
import axios from "axios";
import PositionsTable from "./components/PositionsTable";
import TransactionForm from "./components/TransactionForm";

// Centralized initial transaction state
const INITIAL_TRANSACTION = {
  tradeId: "",
  version: "",
  securityCode: "",
  quantity: "",
  action: "INSERT",
  buySell: "Buy"
};

function App() {
  const [positions, setPositions] = useState([]);
  const [transaction, setTransaction] = useState(INITIAL_TRANSACTION);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPositions();
  }, []);

  // Validation rules (including domain-specific ones)
  function validateTransaction(tx) {
    if (!tx.tradeId || tx.tradeId <= 0) return "TradeId must be positive.";
    if (!tx.version || tx.version < 1) return "Version must be >= 1.";
    if (!tx.securityCode?.trim()) return "SecurityCode is required.";
    if (tx.securityCode.length > 10) return "SecurityCode must be <= 10 characters.";
    if (!tx.quantity || tx.quantity <= 0) return "Quantity must be positive.";

    if (tx.action === "INSERT" && tx.version !== 1) {
      return "INSERT must always be version 1.";
    }
    if (tx.action === "CANCEL" && tx.version <= 1) {
      return "CANCEL must be the last version (greater than 1).";
    }

    return null; // valid
  }

  async function fetchPositions() {
    setLoading(true);
    setError("");
    try {
      const { data } = await axios.get("http://localhost:5130/api/transactions/positions");
      setPositions(data);
    } catch (err) {
      setError("Failed to load positions. Please try again later.");
      console.error("Error fetching positions:", err);
    } finally {
      setLoading(false);
    }
  }

  async function submitTransaction() {
    const validationError = validateTransaction(transaction);
    if (validationError) {
      setError(`${validationError}`);
      return;
    }

    setLoading(true);
    setError("");
    try {
      const { data } = await axios.post("http://localhost:5130/api/transactions", transaction);
      setPositions(data);
      setTransaction(INITIAL_TRANSACTION); // reset form
    } catch (err) {
      setError("Failed to submit transaction. Please check your input.");
      console.error("Error submitting transaction:", err);
    } finally {
      setLoading(false);
    }
  }

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
