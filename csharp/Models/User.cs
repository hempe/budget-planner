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
            EmailConfirmed = user.EmailConfirmed,
            NormalizedEmail = user.NormalizedEmail,
            PasswordHash = user.PasswordHash,
        };
    }

    [Table("Users")]
    public class UserEntity : UserData {
        public string UserName { get; set; }
        public string Email { get; set; }
        public string NormalizedEmail { get; set; }
        public string NormalizedUserName { get; set; }
        public string PasswordHash { get; set; }
        public bool EmailConfirmed { get; set; }
        public UserEntity() { }

        public static implicit operator UserEntity(IdentityUser user) => user == null ? null : new UserEntity {
            UserName = user.UserName,
            NormalizedUserName = user.NormalizedUserName,
            UserId = user.Id,
            Email = user.Email,
            EmailConfirmed = user.EmailConfirmed,
            NormalizedEmail = user.NormalizedEmail,
            PasswordHash = user.PasswordHash,
        };
    }
}