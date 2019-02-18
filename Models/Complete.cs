using System.Collections.Generic;

namespace BudgetPlanner.Models
{
    public class Complete
    {
        public BudgetData[] Budgets { get; set; }
        public Group<NamedValue> Assets { get; set; }
        public Group<DatedValue> Revenue { get; set; }
        public ProfileData Client { get; set; }
    }
}