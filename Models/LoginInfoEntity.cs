using Microsoft.AspNetCore.Identity;
using Microsoft.WindowsAzure.Storage.Table;

namespace BudgetPlanner.Models {
    // Add profile data for application users by adding properties to the User class
    public static class UserLoginInfoExtension {
        public static LoginInfoEntity Convert(this UserLoginInfo @this, string userId) => new LoginInfoEntity {
            DisplayName = @this.ProviderDisplayName,
            PartitionKey = @this.LoginProvider,
            RowKey = @this.ProviderKey,
            UserId = userId,
        };
    }

    public class LoginInfoEntity : TableEntity {
        public static string LoginProviderProperty => nameof(PartitionKey);
        public static string ProviderKeyProperty => nameof(RowKey);
        internal const string TableName = "UserLoginInfoEntity";
        public string UserId { get; set; }
        public string DisplayName { get; set; }

        public LoginInfoEntity() { }
        public LoginInfoEntity(string loginProvider, string providerKey) {
            this.PartitionKey = loginProvider;
            this.RowKey = providerKey;
        }
        public UserLoginInfo Convert() => new UserLoginInfo(this.PartitionKey, this.RowKey, this.DisplayName);
    }
}