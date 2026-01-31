using PositionManagementAPI.Models;

namespace PositionManagementAPI.Repositories
{
    public static class InMemoryStore
    {
        public static Dictionary<int, Transaction> Trades = new();
        public static Dictionary<string, int> Positions = new();
    }

}
