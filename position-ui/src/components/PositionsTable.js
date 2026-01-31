import React from "react";

function PositionsTable({ positions }) {
  return (
    <div>
      <h2>📊 Equity Positions</h2>
      <table border="1" cellPadding="8" style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead style={{ backgroundColor: "#f0f0f0" }}>
          <tr>
            <th>Security</th>
            <th>Net Quantity</th>
          </tr>
        </thead>
        <tbody>
          {positions.length > 0 ? (
            positions.map((p) => (
              <tr key={p.securityCode}>
                <td>{p.securityCode}</td>
                <td>{p.netQuantity}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2" style={{ textAlign: "center" }}>No positions available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default PositionsTable;
