using Microsoft.WindowsAzure.Storage.Table;

namespace BudgetPlanner.Models
{
    public class BudgetData : Group<FrequencyValue>
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public int? StartYear { get; set; }
        public int? EndYear { get; set; }
    }
}