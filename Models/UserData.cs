using System.Collections.Generic;
using System.Reflection;
using BudgetPlanner.Attributes;
using BudgetPlanner.Middleware;
using Microsoft.AspNetCore.Identity;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Table;
using Newtonsoft.Json;

namespace BudgetPlanner.Models {
    public enum SubType {
        Positive,
        Negative,
    }

    public class DashboardConfiguration {
        public string Path { get; set; }
        public string Theme { get; set; }
        public string Type { get; set; }
        public int? Id { get; set; }

        public static implicit operator DashboardConfiguration(Dashboard x) => x == null ? null : new DashboardConfiguration {
            Path = x.Path,
            Theme = x.Theme,
            Id = string.IsNullOrWhiteSpace(x.Id) ? null : int.TryParse(x.Id, out var id) ? (int?) id : null,
            Type = x.Type,
        };

        public static implicit operator Dashboard(DashboardConfiguration x) => x == null ? null : new Dashboard {
            Path = x.Path,
            Theme = x.Theme,
            Id = x.Id?.ToString(),
            Type = x.Type
        };
    }

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

    [Table("Budgets")]
    public class Budget : UserData<Group<FrequencyValue>> {
        [IgnoreProperty]
        [RowKey]
        public string Id { get; set; }
        public string Name { get; set; }
    }

    [Table("Profile")]
    public class Profile : UserData<object> { }

    [Table("Assets")]
    public class Asset : UserData<Group<NamedValue>> { }

    [Table("Revenue")]
    public class Revenue : UserData<Group<DatedValue>> { }

    public abstract class UserData : TableEntity {

        [IgnoreProperty]
        [PartitionKey]
        public string UserId { get; set; }

        public UserData() {
            this.RowKey = "0";
        }
    }

    public abstract class UserData<T> : UserData where T : new() {

        [IgnoreProperty]
        [JsonData(nameof(Value))]
        public T Data { get; set; }

        public string Value { get; set; }
    }
}