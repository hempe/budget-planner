using BudgetPlanner.Attributes;
using BudgetPlanner.Models;
using Microsoft.WindowsAzure.Storage.Table;

namespace BudgetPlanner.Tables {

    [Table("Budgets")]
    public class Budget : UserData<BudgetData> {
        [IgnoreProperty]
        [RowKey]
        public string Id { get; set; }
        public string Name { get; set; }
    }
}