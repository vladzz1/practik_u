using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using practik_u2_server.Models.Account;

namespace practik_u2_server.Controllers
{
    [Route("api/account")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            return Ok();
        }
    }
}
