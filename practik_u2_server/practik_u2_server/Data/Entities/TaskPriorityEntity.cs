using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace practik_u2_server.Data.Entities
{
    [Table("tbl_task_priorities")]
    [Index(nameof(Name), IsUnique = true)]
    public class TaskPriorityEntity
    {
        /// <summary>Унікальний ідентифікатор пріоритету.</summary>
        [Key]
        public int Id { get; set; }

        /// <summary>Назва пріоритету (унікальна).</summary>
        [Required, StringLength(50)]
        public string Name { get; set; } = string.Empty;

        /// <summary>Задачі, що мають цей пріоритет.</summary>
        public ICollection<TaskEntity>? Tasks { get; set; }
    }
}
