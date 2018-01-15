using System.Collections.Generic;
using System.Linq;
using BudgetPlanner.Attributes;
using BudgetPlanner.Tables;
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
}