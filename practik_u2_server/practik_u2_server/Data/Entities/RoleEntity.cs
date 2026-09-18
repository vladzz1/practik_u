using Microsoft.AspNetCore.Identity;

namespace practik_u2_server.Data.Entities
{
    public class RoleEntity : IdentityRole<int>
    {
        public ICollection<UserRoleEntity>? UserRoles { get; set; }
    }
}
