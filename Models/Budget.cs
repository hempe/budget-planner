using BudgetPlanner.Attributes;
using Microsoft.WindowsAzure.Storage.Table;

namespace BudgetPlanner.Models {

    public class BudgetOverview : OverviewValue {
        public int? StartYear { get; set; }
        public int? EndYear { get; set; }
    }

    public class BudgetData : Group<FrequencyValue> {
        public int? StartYear { get; set; }
        public int? EndYear { get; set; }
    }

    [Table("Budgets")]
    public class Budget : UserData<BudgetData> {
        [IgnoreProperty]
        [RowKey]
        public string Id { get; set; }
        public string Name { get; set; }
    }
}