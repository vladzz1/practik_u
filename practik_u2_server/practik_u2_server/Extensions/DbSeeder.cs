using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using practik_u2_server.Constants;
using practik_u2_server.Data;
using practik_u2_server.Data.Entities;
using practik_u2_server.Interfaces;
using practik_u2_server.Models.Seeder;
using System.Text;
using System.Text.Json;

namespace practik_u2_server.Extensions
{
    public static class DbSeeder
    {
        public static async Task SeedData(this WebApplication webApplication)
        {
            using var scope = webApplication.Services.CreateScope();
            //Цей об'єкт буде верта посилання на конткетс, який зараєстрвоано в Progran.cs
            var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<RoleEntity>>();
            var userManager = scope.ServiceProvider.GetRequiredService<UserManager<UserEntity>>();
            var imageService = scope.ServiceProvider.GetRequiredService<IImageService>();

            context.Database.Migrate();

            if (!context.Roles.Any())
            {
                foreach (var roleName in Roles.ListRoles())
                {
                    await roleManager.CreateAsync(new RoleEntity { Name = roleName });
                }
            }

            if (!context.Users.Any())
            {
                var curDir = Directory.GetCurrentDirectory();
                var jsonFile = Path.Combine(curDir, "Helpers", "JsonData", "Users.json");
                if (File.Exists(jsonFile))
                {
                    var jsonData = await File.ReadAllTextAsync(jsonFile, encoding: Encoding.UTF8);
                    try
                    {
                        var users = JsonSerializer.Deserialize<List<SeederUserModel>>(jsonData);
                        foreach (var user in users)
                        {
                            var entity = new UserEntity
                            {
                                FirstName = user.FirstName,
                                LastName = user.LastName,
                                Email = user.Email,
                                UserName = user.Email
                            };
                            if (!string.IsNullOrEmpty(user.Image))
                                entity.Image = await imageService.SaveImageFromUrlAsync(user.Image);
                            var result = await userManager.CreateAsync(entity, user.Password);
                            if (result.Succeeded)
                            {
                                foreach (var role in user.Roles)
                                {
                                    await userManager.AddToRoleAsync(entity, role);
                                }

                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine("Викникла помилка при Seed Users ", ex.Message);
                    }
                }
            }
        }
    }
}
