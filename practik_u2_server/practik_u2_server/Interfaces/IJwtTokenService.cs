using practik_u2_server.Data.Entities;

namespace practik_u2_server.Interfaces
{
    public interface IJwtTokenService
    {
        Task<string> CreateTokenAsync(UserEntity user);
    }
}
