using Microsoft.AspNetCore.Identity;
using Microsoft.WindowsAzure.Storage.Table;

namespace BudgetPlanner.Models {
    public class TokenEntity : TableEntity {

        public static string LoginProviderProperty => nameof(PartitionKey);
        public string Name { get; set; }
        public string Value { get; set; }
        public string UserId { get; set; }

        public TokenEntity() { }
        public TokenEntity(string loginProvider, User user, string name) {
            this.RowKey = $"{user.Id}-{name}";
            this.PartitionKey = loginProvider;
            this.UserId = user.Id;
            this.Name = name;
        }
    }
}