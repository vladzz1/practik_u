using Microsoft.AspNetCore.Identity;

namespace practik_u2_server.Data.Entities
{
    public class UserRoleEntity : IdentityUserRole<int>
    {
        public UserEntity User { get; set; } = null!;
        public RoleEntity Role { get; set; } = null!;
    }
}
