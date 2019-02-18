using BudgetPlanner.Attributes;
using Microsoft.WindowsAzure.Storage.Table;

namespace BudgetPlanner.Tables
{
    public abstract class UserData : TableEntity
    {
        [IgnoreProperty]
        [PartitionKey]
        public string UserId { get; set; }

        public UserData()
        {
            this.RowKey = "0";
        }
    }

    public abstract class UserData<T> : UserData where T : new()
    {
        [IgnoreProperty]
        [JsonData(nameof(Value))]
        public T Data { get; set; }

        public string Value { get; set; }
    }
}