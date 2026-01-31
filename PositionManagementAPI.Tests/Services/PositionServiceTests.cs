using System.Linq;
using Xunit;
using PositionManagementAPI.Models;
using PositionManagementAPI.Services;
using PositionManagementAPI.Repositories;

namespace PositionManagementAPI.Tests.Services
{
    public class PositionServiceTests
    {
        private readonly PositionService _service;

        public PositionServiceTests()
        {
            InMemoryStore.Trades.Clear();
            InMemoryStore.Positions.Clear();
            _service = new PositionService();
        }
        [Fact]
        public void ProcessTransactions_FromPdfInput_ShouldMatchExpectedPositions()
        {
            // Arrange
            InMemoryStore.Trades.Clear();
            InMemoryStore.Positions.Clear();
            var service = new PositionService();

            var transactions = new List<Transaction>
    {
        new Transaction { TransactionId = 1, TradeId = 1, Version = 1, SecurityCode = "REL", Quantity = 50, Action = "INSERT", BuySell = "Buy" },
        new Transaction { TransactionId = 2, TradeId = 2, Version = 1, SecurityCode = "ITC", Quantity = 40, Action = "INSERT", BuySell = "Sell" },
        new Transaction { TransactionId = 3, TradeId = 3, Version = 1, SecurityCode = "INF", Quantity = 70, Action = "INSERT", BuySell = "Buy" },
        new Transaction { TransactionId = 4, TradeId = 1, Version = 2, SecurityCode = "REL", Quantity = 60, Action = "UPDATE", BuySell = "Buy" },
        new Transaction { TransactionId = 5, TradeId = 2, Version = 2, SecurityCode = "ITC", Quantity = 30, Action = "CANCEL", BuySell = "Buy" },
        new Transaction { TransactionId = 6, TradeId = 4, Version = 1, SecurityCode = "INF", Quantity = 20, Action = "INSERT", BuySell = "Sell" }
    };

            // Act
            foreach (var tx in transactions)
            {
                service.ProcessTransaction(tx);
            }

            var positions = service.GetPositions().ToDictionary(p => p.SecurityCode, p => p.NetQuantity);

            // Assert
            Assert.Equal(60, positions["REL"]);
            Assert.Equal(0, positions["ITC"]);
            Assert.Equal(50, positions["INF"]);
        }


        [Fact]
        public void InsertTransaction_Version1_ShouldUpdatePositions()
        {
            var tx = new Transaction
            {
                TransactionId = 1,
                TradeId = 100,
                Version = 1,
                SecurityCode = "REL",
                Quantity = 50,
                Action = "INSERT",
                BuySell = "Buy"
            };

            _service.ProcessTransaction(tx);

            var positions = _service.GetPositions().ToList();
            Assert.Single(positions);
            Assert.Equal("REL", positions[0].SecurityCode);
            Assert.Equal(50, positions[0].NetQuantity);
        }

        [Fact]
        public void InsertTransaction_VersionNot1_ShouldBeIgnored()
        {
            var tx = new Transaction
            {
                TransactionId = 2,
                TradeId = 101,
                Version = 2,
                SecurityCode = "ITC",
                Quantity = 40,
                Action = "INSERT",
                BuySell = "Sell"
            };

            _service.ProcessTransaction(tx);

            Assert.Empty(_service.GetPositions());
        }

        [Fact]
        public void UpdateTransaction_NewerVersion_ShouldReplaceOld()
        {
            var insertTx = new Transaction
            {
                TransactionId = 3,
                TradeId = 200,
                Version = 1,
                SecurityCode = "INFY",
                Quantity = 10,
                Action = "INSERT",
                BuySell = "Buy"
            };
            _service.ProcessTransaction(insertTx);

            var updateTx = new Transaction
            {
                TransactionId = 4,
                TradeId = 200,
                Version = 2,
                SecurityCode = "INFY",
                Quantity = 20,
                Action = "UPDATE",
                BuySell = "Buy"
            };
            _service.ProcessTransaction(updateTx);

            var positions = _service.GetPositions().ToList();
            Assert.Single(positions);
            Assert.Equal(20, positions[0].NetQuantity); // updated quantity
        }

        [Fact]
        public void UpdateBeforeInsert_ShouldBeIgnored()
        {
            var updateTx = new Transaction
            {
                TransactionId = 9,
                TradeId = 500,
                Version = 2,
                SecurityCode = "AXIS",
                Quantity = 60,
                Action = "UPDATE",
                BuySell = "Buy"
            };

            _service.ProcessTransaction(updateTx);

            Assert.Empty(_service.GetPositions());
        }
    }
}
