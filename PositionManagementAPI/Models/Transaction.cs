using System.ComponentModel.DataAnnotations;

namespace PositionManagementAPI.Models
{
    public class Transaction
    {
        [Key]
        public int TransactionId { get; set; }   // Primary key (auto-generated)

        [Required]
        public int TradeId { get; set; }         // Trade identifier

        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "Version must be >= 1")]
        public int Version { get; set; }         // Starts at 1 for each TradeId

        [Required]
        [StringLength(10, ErrorMessage = "Security code must be short")]
        public string SecurityCode { get; set; } // e.g. REL, ITC

        [Range(1, int.MaxValue, ErrorMessage = "Quantity must be positive")]
        public int Quantity { get; set; }        // e.g. 10 shares

        [Required]
        [RegularExpression("INSERT|UPDATE|CANCEL", ErrorMessage = "Action must be INSERT, UPDATE, or CANCEL")]
        public string Action { get; set; }       // Trade lifecycle action

        [Required]
        [RegularExpression("Buy|Sell", ErrorMessage = "BuySell must be Buy or Sell")]
        public string BuySell { get; set; }      // Direction of trade
    }
}
