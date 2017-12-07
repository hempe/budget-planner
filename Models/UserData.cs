using Microsoft.AspNetCore.Identity;
using Microsoft.WindowsAzure.Storage.Table;
using Newtonsoft.Json;

namespace BudgetPlanner.Models {

    public abstract class UserDataEntity : TableEntity {
        [IgnoreProperty]
        public string UserId {
            get => this.RowKey;
            set {
                this.RowKey = value;
                this.PartitionKey = value.Substring(0, 3);
            }
        }
    }

    public abstract class UserDataEntity<T> : UserDataEntity where T : new() {

        [IgnoreProperty]
        public T Data {
            get {
                try {
                    return string.IsNullOrEmpty(this.Value) ? new T() : JsonConvert.DeserializeObject<T>(this.Value);
                } catch {
                    return new T();
                }
            }
            set {
                this.Value = value == null ? null : JsonConvert.SerializeObject(value);
            }
        }

        public string Value { get; set; }
    }
}