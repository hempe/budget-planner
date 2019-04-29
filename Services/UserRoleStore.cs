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
    internal partial class UserStore : IUserRoleStore<User>
    {
        public Task AddToRoleAsync(User user, string normalizedRoleName, CancellationToken cancellationToken)
            => this.GetRoleNameAsync(normalizedRoleName)
                .ContinueWithAsync((r) => this.tableStore.AddOrUpdateAsync(new UserRoleEntity(user.Id, r)).ThrowOnError());

        public Task<IList<string>> GetRolesAsync(User user, CancellationToken cancellationToken)
            => this.tableStore.GetAllAsync<UserRoleEntity>(new UserArg(user.Id))
                .ContinueWithAsync(z => z.Select(x => x.RoleName).ToIList());

        public Task<IList<User>> GetUsersInRoleAsync(string normalizedRoleName, CancellationToken cancellationToken)
            => this.GetRoleNameAsync(normalizedRoleName)
                .ContinueWithAsync(r => this.tableStore
                    .GetAllAsync<UserRoleEntity>(r.AsArg<UserRoleEntity>(x => x.RoleName))
                    .ContinueWithAsync(u => u.WhenAllAsync(z => this.FindByIdAsync(z.UserId, cancellationToken)))
                ).ContinueWithAsync(x => x.ToIList());
                
        public async Task<bool> IsInRoleAsync(User user, string normalizedRoleName, CancellationToken cancellationToken)
            => await this.GetRoleNameAsync(normalizedRoleName)
                .ContinueWithAsync(r => this.tableStore.GetAsync(new UserRoleEntity(user.Id, r))) == null;
            
        public Task RemoveFromRoleAsync(User user, string normalizedRoleName, CancellationToken cancellationToken)
            => this.GetRoleNameAsync(normalizedRoleName)
                .ContinueWithAsync(r => this.tableStore.DeleteAsync(new UserRoleEntity(user.Id, r)))
                .ThrowOnError();
        
        private Task<string> GetRoleNameAsync(string normalizedRoleName)
            => this.tableStore.GetAsync<RoleEntity>(normalizedRoleName.AsArg<RoleEntity>(x => x.NormalizedName))
            .ContinueWithAsync(e => e?.Name ?? normalizedRoleName);
    }
}