using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using practik_u2_server.Data.Entities;

namespace practik_u2_server.Data
{
    public class AppDbContext : IdentityDbContext<UserEntity, RoleEntity, int>
    {
        public DbSet<TaskStatusEntity> TaskStatuses { get; set; }
        public DbSet<TaskPriorityEntity> TaskPriorities { get; set; }
        public DbSet<TaskEntity> Tasks { get; set; }
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) {}
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            //пропускає видалені задачі
            modelBuilder.Entity<TaskEntity>().HasQueryFilter(t => !t.IsDeleted);

            //identity
            modelBuilder.Entity<UserRoleEntity>().HasOne(ur => ur.User).WithMany(u => u.UserRoles).HasForeignKey(ur => ur.UserId);

            modelBuilder.Entity<UserRoleEntity>().HasOne(ur => ur.Role).WithMany(r => r.UserRoles).HasForeignKey(ur => ur.RoleId);
        }
    }
}
