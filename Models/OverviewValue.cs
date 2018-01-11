namespace BudgetPlanner.Models {
    public class OverviewValue : NamedValue {
        public string Id { get; set; }
        public OverviewContainer[] Positive { get; set; }
        public OverviewContainer[] Negative { get; set; }
    }
}