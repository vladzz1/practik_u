using System.ComponentModel.DataAnnotations;

namespace practik_u2_server.Models.Tasks
{
    /// <summary>Зміна лише статусу задачі.</summary>
    public class TaskChangeStatusModel
    {
        [Range(1, int.MaxValue, ErrorMessage = "Вкажіть статус")]
        public int StatusId { get; set; }
    }
}
