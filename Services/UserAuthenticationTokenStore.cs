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

    internal partial class UserStore : IUserAuthenticationTokenStore<User>
    {
        public Task RemoveTokenAsync(User user, string loginProvider, string name, CancellationToken cancellationToken)
            => this.tableStore.DeleteAsync(new Token
            {
                LoginProvider = loginProvider,
                UserId = user.Id,
                Name = name
            }).ThrowOnError();

        public Task SetTokenAsync(User user, string loginProvider, string name, string value, CancellationToken cancellationToken)
           => this.tableStore.AddOrUpdateAsync(new Token
            {
                LoginProvider = loginProvider,
                UserId = user.Id,
                Name = name,
                Value = value
            }).ThrowOnError();

        public Task<string> GetTokenAsync(User user, string loginProvider, string name, CancellationToken cancellationToken)
            => this.tableStore.GetAsync(new Token
            {
                LoginProvider = loginProvider,
                UserId = user.Id,
                Name = name
            }).Transform(x => x?.Value);
    }
}