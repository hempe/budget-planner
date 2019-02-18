using BudgetPlanner.Attributes;
using Microsoft.AspNetCore.Identity;
using Microsoft.WindowsAzure.Storage.Table;

namespace BudgetPlanner.Tables
{
    [Table("Logins")]
    public class LoginInfo : TableEntity
    {
        [IgnoreProperty]
        [PartitionKey]
        public string LoginProvider { get; set; }

        [IgnoreProperty]
        [RowKey]
        public string ProviderKey { get; set; }

        public string UserId { get; set; }
        public string DisplayName { get; set; }

        public string ProviderDisplayName { get; set; }

        public LoginInfo() { }

        public static implicit operator UserLoginInfo(LoginInfo user) => user == null ? null : new UserLoginInfo(user.LoginProvider, user.ProviderKey, user.DisplayName);

        public static implicit operator LoginInfo(UserLoginInfo user) => user == null ? null : new LoginInfo
        {
            DisplayName = user.ProviderDisplayName,
            LoginProvider = user.LoginProvider,
            ProviderKey = user.ProviderKey,
        };
    }
}