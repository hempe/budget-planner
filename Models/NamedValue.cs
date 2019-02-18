using Newtonsoft.Json;

namespace BudgetPlanner.Models
{
    public class NamedValue : ISum
    {
        public string Name { get; set; }
        public decimal Value { get; set; }

        [JsonIgnore]
        public virtual decimal Sum => this.Value;
    }
}