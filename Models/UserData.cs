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
        Positiv,
        Negativ,
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