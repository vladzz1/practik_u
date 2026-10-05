using System.ComponentModel.DataAnnotations;

namespace practik_u2_server.Models.Tasks
{
    /// <summary>Елемент довідника (статус або пріоритет).</summary>
    public class LookupModel
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
    }
}
