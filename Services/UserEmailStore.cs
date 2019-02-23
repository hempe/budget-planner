using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using BudgetPlanner.Attributes;
using BudgetPlanner.Middleware;
using BudgetPlanner.Models;
using BudgetPlanner.Tables;
using Microsoft.AspNetCore.Identity;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Table;

namespace BudgetPlanner.Services
{

    internal partial class UserStore : IUserEmailStore<User>
    {
        public async Task<User> FindByEmailAsync(string normalizedEmail, CancellationToken cancellationToken)
        => await this.tableStore.GetAsync<UserEntity>(normalizedEmail.AsArg<UserEntity>(x => x.NormalizedEmail)) ??
            await this.tableStore.GetAsync<UserEntity>(normalizedEmail.AsArg<UserEntity>(x => x.Email)) ??
            await this.tableStore.GetAsync<UserEntity>(normalizedEmail.AsArg<UserEntity>(x => x.NormalizedUserName));

        public Task<string> GetEmailAsync(User user, CancellationToken cancellationToken)
            => user.Email.AsTask();

        public Task<bool> GetEmailConfirmedAsync(User user, CancellationToken cancellationToken)
            => user.EmailConfirmed.AsTask();

        public Task<string> GetNormalizedEmailAsync(User user, CancellationToken cancellationToken)
            => user.NormalizedEmail.AsTask();

        public Task SetEmailAsync(User user, string email, CancellationToken cancellationToken)
            => user.AsTask(u => u.Email = email);

        public Task SetEmailConfirmedAsync(User user, bool confirmed, CancellationToken cancellationToken)
            => user.AsTask(u => u.EmailConfirmed = confirmed);

        public Task SetNormalizedEmailAsync(User user, string normalizedEmail, CancellationToken cancellationToken)
            => user.AsTask(u => u.NormalizedEmail = normalizedEmail);
    }
}