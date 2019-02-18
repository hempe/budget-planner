using Newtonsoft.Json;

namespace BudgetPlanner.Models
{
    public class FrequencyValue : NamedValue
    {
        public int Frequency { get; set; }

        [JsonIgnore]
        public override decimal Sum => this.Value * this.Frequency;
    }
}