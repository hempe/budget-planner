using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using BudgetPlanner.Attributes;
using BudgetPlanner.Middleware;
using BudgetPlanner.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Table;

namespace BudgetPlanner.Services
{

    internal partial class UserStore : IUserPasswordStore<User>
    {
        public Task<string> GetPasswordHashAsync(User user, CancellationToken cancellationToken)
            => user.PasswordHash.AsTask();

        public Task<bool> HasPasswordAsync(User user, CancellationToken cancellationToken)
            => user.AsTask(u =>!string.IsNullOrWhiteSpace(user.PasswordHash));

        public Task SetPasswordHashAsync(User user, string passwordHash, CancellationToken cancellationToken)
            => user.AsTask(u => u.PasswordHash = passwordHash);
    }
}