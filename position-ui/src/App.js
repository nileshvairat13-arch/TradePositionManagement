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

  useEffect(() => {
    fetchPositions();
  }, []);

  const fetchPositions = async () => {
    try {
      const res = await axios.get("http://localhost:5130/api/transactions/positions");
      setPositions(res.data);
    } catch (err) {
      console.error("Error fetching positions:", err);
    }
  };

  const submitTransaction = async () => {
    try {
      const res = await axios.post("http://localhost:5130/api/transactions", transaction);
      setPositions(res.data);
      setTransaction({
        tradeId: "",
        version: "",
        securityCode: "",
        quantity: "",
        action: "INSERT",
        buySell: "Buy"
      });
    } catch (err) {
      console.error("Error submitting transaction:", err);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial" }}>
      <PositionsTable positions={positions} />
      <TransactionForm transaction={transaction} setTransaction={setTransaction} onSubmit={submitTransaction} />
    </div>
  );
}

export default App;
