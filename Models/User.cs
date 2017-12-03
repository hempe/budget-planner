using Microsoft.AspNetCore.Identity;
using Microsoft.WindowsAzure.Storage.Table;

namespace BudgetPlanner.Models {
    // Add profile data for application users by adding properties to the User class
    public class User : IdentityUser {

        public UserEntity Convert() => new UserEntity {
            UserName = this.UserName,
            NormalizedUserName = this.NormalizedUserName,
            RowKey = this.Id,
            PartitionKey = UserEntity.PartitionKeyValue,
            Email = this.Email
        };
    }

    public class UserEntity : TableEntity {
        internal const string PartitionKeyValue = "";
        public string UserName { get; set; }
        public string Email { get; set; }
        public string Name { get; set; }
        public string NormalizedUserName { get; set; }

        public UserEntity() { }
        public UserEntity(string userId) {
            this.RowKey = userId;
            this.PartitionKey = PartitionKeyValue;
        }

        public User Convert() => new User {
            UserName = this.UserName,
            NormalizedUserName = this.NormalizedUserName,
            Id = this.RowKey,
            Email = this.Email,
            EmailConfirmed = true
        };
    }
}