namespace practik_u2_server.Models.Account
{
    public class RegisterModel
    {
        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
        public string ConfirmPassword { get; set; } = null!;
        public IFormFile? ImageFile { get; set; }
    }
}
