using PositionManagementAPI.Models;
using PositionManagementAPI.Repositories;

namespace PositionManagementAPI.Services
{
    public class PositionService
    {
        public void ProcessTransaction(Transaction tx)
        {
            InMemoryStore.AllTransactions.Add(tx);

            if (tx.Action == "INSERT" && tx.Version == 1)
            {
                InMemoryStore.Trades[tx.TradeId] = tx;
                ApplyPosition(tx, true);

                // Replay later versions if they already arrived
                var laterVersions = InMemoryStore.AllTransactions
                    .Where(t => t.TradeId == tx.TradeId && t.Version > 1)
                    .OrderBy(t => t.Version);

                foreach (var laterTx in laterVersions)
                {
                    ProcessTransaction(laterTx);
                }
            }
            else if (tx.Action == "UPDATE")
            {
                if (InMemoryStore.Trades.TryGetValue(tx.TradeId, out var oldTx))
                {
                    if (tx.Version > oldTx.Version)
                    {
                        ApplyPosition(oldTx, false);
                        InMemoryStore.Trades[tx.TradeId] = tx;
                        ApplyPosition(tx, true);
                    }
                }
                // If INSERT hasn’t arrived yet, UPDATE just sits in AllTransactions
            }
            else if (tx.Action == "CANCEL")
            {
                if (InMemoryStore.Trades.TryGetValue(tx.TradeId, out var oldTx))
                {
                    ApplyPosition(oldTx, false);
                    InMemoryStore.Trades.Remove(tx.TradeId);
                }
                // If INSERT hasn’t arrived yet, CANCEL just sits in AllTransactions
            }
        }

        private void ApplyPosition(Transaction tx, bool add)
        {
            int sign = tx.BuySell == "Buy" ? 1 : -1;
            int qty = add ? tx.Quantity * sign : -tx.Quantity * sign;

            if (!InMemoryStore.Positions.ContainsKey(tx.SecurityCode))
                InMemoryStore.Positions[tx.SecurityCode] = 0;

            InMemoryStore.Positions[tx.SecurityCode] += qty;
        }

        public IEnumerable<Position> GetPositions()
        {
            return InMemoryStore.Positions.Select(p => new Position
            {
                SecurityCode = p.Key,
                NetQuantity = p.Value
            });
        }
    }
}
