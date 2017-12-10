using BudgetPlanner.Attributes;
using Microsoft.AspNetCore.Identity;
using Microsoft.WindowsAzure.Storage.Table;

namespace BudgetPlanner.Models {
    // Add profile data for application users by adding properties to the User class
    public class User : IdentityUser {
        public static implicit operator User(UserEntity user) => user == null ? null : new User {
            UserName = user.UserName,
            NormalizedUserName = user.NormalizedUserName,
            Id = user.UserId,
            Email = user.Email,
        };
    }

    [Table("Users")]
    public class UserEntity : UserData {
        public string UserName { get; set; }
        public string Email { get; set; }
        public string Name { get; set; }
        public string NormalizedUserName { get; set; }
        public UserEntity() { }

        public static implicit operator UserEntity(IdentityUser user) => user == null ? null : new UserEntity {
            UserName = user.UserName,
            NormalizedUserName = user.NormalizedUserName,
            UserId = user.Id,
            Email = user.Email,
        };
    }
}