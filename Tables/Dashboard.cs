using BudgetPlanner.Attributes;
using BudgetPlanner.Models;
using Microsoft.WindowsAzure.Storage.Table;

namespace BudgetPlanner.Tables {

    [Table("Dashboards")]
    public class Dashboard : UserData {

        [IgnoreProperty]
        [RowKey]
        public string Key { get => this.Path.ToLower() + "_" + this.Id; }
        public string Id { get; set; }
        public string Path { get; set; }
        public string Theme { get; set; }
        public string Type { get; set; }
        public string Icon { get; set; }
    }
}