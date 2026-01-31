using PositionManagementAPI.Models;
using PositionManagementAPI.Repositories;

namespace PositionManagementAPI.Services
{
    public class PositionService
    {
        public void ProcessTransaction(Transaction tx)
        {
            if (tx.Action == "INSERT")
            {
                // Only accept INSERT if version == 1
                if (tx.Version == 1)
                {
                    InMemoryStore.Trades[tx.TradeId] = tx;
                    ApplyPosition(tx, true);
                }
            }
            else if (tx.Action == "UPDATE")
            {
                if (InMemoryStore.Trades.ContainsKey(tx.TradeId))
                {
                    var oldTx = InMemoryStore.Trades[tx.TradeId];

                    if (tx.Version > oldTx.Version)
                    {
                        ApplyPosition(oldTx, false);
                        InMemoryStore.Trades[tx.TradeId] = tx;
                        ApplyPosition(tx, true);
                    }
                }
                else
                {
                    // UPDATE arrives before INSERT → ignore until INSERT v1 arrives
                }
            }
            else if (tx.Action == "CANCEL")
            {
                if (InMemoryStore.Trades.ContainsKey(tx.TradeId))
                {
                    var oldTx = InMemoryStore.Trades[tx.TradeId];

                    ApplyPosition(oldTx, false);
                    InMemoryStore.Trades.Remove(tx.TradeId);
                }
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
