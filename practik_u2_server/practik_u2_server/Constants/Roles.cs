namespace practik_u2_server.Constants
{
    public class Roles
    {
        public const string Admin = "admin";
        public const string User = "user";
        public static List<string> ListRoles() => [Admin, User];
    }
}
