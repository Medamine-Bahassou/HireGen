using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace hiregen1.Server.Models
{
    [Table("Mission")]
    public class Mission
    {
        [Key]
        public int Id { get; set; }
        public string? Title { get; set; }
        public string? Description { get; set; }
        public string? Country { get; set; }
        public string? City { get; set; }
        public string? WorkMode { get; set; }
        public int Duration { get; set; }
        public string? DurationType { get; set; }
        public bool StartImmediately { get; set; }
        public DateTime? StartDate { get; set; } // Nullable for when startImmediately is true
        public string? ExperienceYear { get; set; }
        public string? ContractType { get; set; }
        public decimal EstimatedDailyRate { get; set; }
        public string? Domain { get; set; }
        public string? Position { get; set; }
        public string? RequiredExpertises { get; set; } // Storing as JSON string
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    }
}
