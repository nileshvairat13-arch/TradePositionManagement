using Microsoft.AspNetCore.Mvc;
using PositionManagementAPI.Models;
using PositionManagementAPI.Services;

namespace PositionManagementAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TransactionsController : ControllerBase
    {
        private readonly PositionService _service = new();

        [HttpPost]
        public IActionResult Post(Transaction tx)
        {
            _service.ProcessTransaction(tx);
            return Ok(_service.GetPositions());
        }

        [HttpGet("positions")]
        public IActionResult GetPositions()
        {
            return Ok(_service.GetPositions());
        }
    }
}
