using Microsoft.AspNetCore.Identity;
using Microsoft.WindowsAzure.Storage.Table;

namespace BudgetPlanner.Models {
    public class ProfileEntity : TableEntity {
        public string Value { get; set; }
        public ProfileEntity() { }
        public ProfileEntity(string userId) {
            this.PartitionKey = userId.Substring(0, 3);
            this.RowKey = userId;
        }
    }
}