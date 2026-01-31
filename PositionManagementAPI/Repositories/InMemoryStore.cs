using PositionManagementAPI.Models;

namespace PositionManagementAPI.Repositories
{
    public static class InMemoryStore
    {
        // Latest applied trades keyed by TradeId
        public static Dictionary<int, Transaction> Trades { get; } = new();

        // Net positions keyed by SecurityCode
        public static Dictionary<string, int> Positions { get; } = new();

        // Keep every transaction received (for replay when INSERT arrives)
        public static List<Transaction> AllTransactions { get; } = new();
    }
}
