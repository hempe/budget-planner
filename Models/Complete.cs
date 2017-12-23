namespace BudgetPlanner.Models {
    public class Complete {
        public BudgetData[] Budgets { get; set; }
        public Group<NamedValue> Assets { get; set; }
        public Group<DatedValue> Revenue { get; set; }
        public object Client { get; set; }
    }
}