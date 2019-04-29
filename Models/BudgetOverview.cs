namespace BudgetPlanner.Models
{
    public class BudgetOverview : OverviewValue
    {
        public int? StartYear { get; set; }
        public int? EndYear { get; set; }
        public bool Enabled { get; set; }
    }
}