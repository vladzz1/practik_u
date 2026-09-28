using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using practik_u2_server.Constants;
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
        //[HttpPost]
        //public async Task<IActionResult> Register([FromForm] RegisterModel model)
        //{
        //    try
        //    {
        //        var user = await userManager.FindByEmailAsync(model.Email);
        //        if (user != null)
        //            throw new Exception("Дана пошта уже зареєстрована");
        //        user = new UserEntity
        //        {
        //            Email = model.Email,
        //            UserName = model.Email,
        //            LastName = model.LastName,
        //            FirstName = model.FirstName
        //        };
        //        if (model.ImageFile != null)
        //            user.Image = await imageService.SaveOptimizedImageAsync(model.ImageFile);
        //        var result = await userManager.CreateAsync(user, model.Password);
        //        if (!result.Succeeded)
        //        {
        //            var errors = string.Join("; ", result.Errors.Select(e => e.Description));
        //            throw new Exception(errors);
        //        }
        //        await userManager.AddToRoleAsync(user, Roles.User);
        //
        //        var token = await jwtTokenService.CreateTokenAsync(user);
        //        return Ok(new { Token = token });
        //
        //    }
        //    catch (Exception ex)
        //    {
        //        return BadRequest(new { Error = ex.Message });
        //    }
        //}
    }
}
