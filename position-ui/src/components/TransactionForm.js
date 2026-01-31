import React from "react";

function TransactionForm({ transaction, setTransaction, onSubmit }) {
  return (
    <div>
      <h3>➕ Add Transaction</h3>
      <div style={{ display: "flex", flexDirection: "column", maxWidth: "300px", gap: "10px" }}>
        <input
          placeholder="TradeId"
          value={transaction.tradeId}
          onChange={(e) => setTransaction({ ...transaction, tradeId: parseInt(e.target.value) || "" })}
        />
        <input
          placeholder="Version"
          value={transaction.version}
          onChange={(e) => setTransaction({ ...transaction, version: parseInt(e.target.value) || "" })}
        />
        <input
          placeholder="SecurityCode"
          value={transaction.securityCode}
          onChange={(e) => setTransaction({ ...transaction, securityCode: e.target.value })}
        />
        <input
          placeholder="Quantity"
          value={transaction.quantity}
          onChange={(e) => setTransaction({ ...transaction, quantity: parseInt(e.target.value) || "" })}
        />
        <select value={transaction.action} onChange={(e) => setTransaction({ ...transaction, action: e.target.value })}>
          <option value="INSERT">INSERT</option>
          <option value="UPDATE">UPDATE</option>
          <option value="CANCEL">CANCEL</option>
        </select>
        <select value={transaction.buySell} onChange={(e) => setTransaction({ ...transaction, buySell: e.target.value })}>
          <option value="Buy">Buy</option>
          <option value="Sell">Sell</option>
        </select>
        <button onClick={onSubmit} style={{ padding: "8px", backgroundColor: "#007bff", color: "white", border: "none" }}>
          Submit
        </button>
      </div>
    </div>
  );
}

export default TransactionForm;
