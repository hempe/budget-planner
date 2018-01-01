using BudgetPlanner.Attributes;
using Microsoft.WindowsAzure.Storage.Table;

namespace BudgetPlanner.Models {

    [Table("Budgets")]
    public class Budget : UserData<BudgetData> {
        [IgnoreProperty]
        [RowKey]
        public string Id { get; set; }
        public string Name { get; set; }
    }
}