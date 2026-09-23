using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using practik_u2_server.Data.Entities;
using practik_u2_server.Interfaces;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace practik_u2_server.Services
{
    public class JwtTokenService(IConfiguration configuration, UserManager<UserEntity> userManager) : IJwtTokenService
    {
        public async Task<string> CreateTokenAsync(UserEntity user)
        {
            var key = configuration["Jwt:Key"];

            var claims = new List<Claim>
            {
                new Claim("email", user.Email)
            };
            var roles = await userManager.GetRolesAsync(user);
            foreach (var role in roles)
            {
                claims.Add(new Claim("roles", role));
            }
            //ключ перетворили у bytes
            var keyBytes = Encoding.UTF8.GetBytes(key);
            //робимо ключа
            var symmetricSecurityKey = new SymmetricSecurityKey(keyBytes);
            //Вказуємо алгоритм шифрування та ключ
            var signingCredentials = new SigningCredentials(symmetricSecurityKey, SecurityAlgorithms.HmacSha256);

            //робимо токен і вказуємо його параметри
            var jwtSecurityToken = new JwtSecurityToken(claims: claims, expires: DateTime.UtcNow.AddDays(7), signingCredentials: signingCredentials);
            var token = new JwtSecurityTokenHandler().WriteToken(jwtSecurityToken);
            return token;
        }
    }
}
