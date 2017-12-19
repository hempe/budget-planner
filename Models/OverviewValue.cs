using System.Collections.Generic;

namespace BudgetPlanner.Models {
    public class OverviewValue : NamedValue {
        public string Id { get; set; }
        public IEnumerable<OverviewContainer> Positive { get; set; }
        public IEnumerable<OverviewContainer> Negative { get; set; }
    }
}