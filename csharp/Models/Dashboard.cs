using BudgetPlanner.Attributes;
using Microsoft.WindowsAzure.Storage.Table;

namespace BudgetPlanner.Models {
    [Table("Dashboards")]
    public class Dashboard : UserData {

        [IgnoreProperty]
        [RowKey]
        public string Key { get => this.Path.ToLower() + "_" + this.Id; }
        public string Id { get; set; }
        public string Path { get; set; }
        public string Theme { get; set; }
        public string Type { get; set; }
    }

    public class DashboardConfiguration {
        public string Path { get; set; }
        public string Theme { get; set; }
        public string Type { get; set; }
        public string Id { get; set; }

        public static implicit operator DashboardConfiguration(Dashboard x) => x == null ? null : new DashboardConfiguration {
            Path = x.Path,
            Theme = x.Theme,
            Id = x.Id,
            Type = x.Type,
        };

        public static implicit operator Dashboard(DashboardConfiguration x) => x == null ? null : new Dashboard {
            Path = x.Path,
            Theme = x.Theme,
            Id = x.Id,
            Type = x.Type
        };
    }
}