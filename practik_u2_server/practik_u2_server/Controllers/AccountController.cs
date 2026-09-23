using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using practik_u2_server.Data.Entities;
using practik_u2_server.Interfaces;
using practik_u2_server.Models.Account;

namespace practik_u2_server.Controllers
{
    [Route("api/account")]
    [ApiController]
    public class AccountController(UserManager<UserEntity> userManager, IJwtTokenService jwtTokenService) : ControllerBase
    {
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            var user = await userManager.FindByEmailAsync(model.Email);
            if (user != null && await userManager.CheckPasswordAsync(user, model.Password))
            {
                var token = await jwtTokenService.CreateTokenAsync(user);
                return Ok(new { Token = token });
            }
            return Unauthorized("Не вірно вказані дані");
        }
    }
}
