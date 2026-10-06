using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using practik_u2_server.Constants;
using practik_u2_server.Data.Entities;
using practik_u2_server.Interfaces;
using practik_u2_server.Models.Account;
using System.Security.Claims;

namespace practik_u2_server.Controllers
{
    [Route("api/account")]
    [ApiController]
    public class AccountController(UserManager<UserEntity> userManager, IImageService imageService, IJwtTokenService jwtTokenService) : ControllerBase
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
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromForm] RegisterModel model)
        {
            try
            {
                var user = await userManager.FindByEmailAsync(model.Email);
                if (user != null)
                    throw new Exception("Дана пошта уже зареєстрована");
                user = new UserEntity
                {
                    Email = model.Email,
                    UserName = model.Email,
                    LastName = model.LastName,
                    FirstName = model.FirstName
                };
                if (model.ImageFile != null)
                    user.Image = await imageService.SaveOptimizedImageAsync(model.ImageFile);
                var result = await userManager.CreateAsync(user, model.Password);
                if (!result.Succeeded)
                {
                    var errors = string.Join("; ", result.Errors.Select(e => e.Description));
                    throw new Exception(errors);
                }
                await userManager.AddToRoleAsync(user, Roles.User);
        
                var token = await jwtTokenService.CreateTokenAsync(user);
                return Ok(new { Token = token });
        
            }
            catch (Exception ex)
            {
                return BadRequest(new { Error = ex.Message });
            }
        }
        [Authorize]
        [HttpGet("profile")]
        public async Task<IActionResult> Profile()
        {
            var email = User.FindFirstValue(ClaimTypes.Email) ?? User.FindFirstValue("email");
            if (string.IsNullOrEmpty(email))
                return Unauthorized(new { error = "Користувча не знайдено!" });
            var user = await userManager.FindByEmailAsync(email);
            if (user == null)
                return NotFound(new { error = "Користувач відсутній!" });
            var roles = await userManager.GetRolesAsync(user);
            var model = new ProfileModel
            {
                Id = user.Id,
                Email = email,
                FirstName = user.FirstName ?? string.Empty,
                LastName = user.LastName ?? string.Empty,
                Image = user.Image ?? string.Empty,
                Roles = roles
            };
            return Ok(model);
        }
    }
}
