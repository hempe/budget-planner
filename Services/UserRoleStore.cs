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
            .TransformAsync((r) => this.tableStore.AddOrUpdateAsync(new UserRoleEntity(user.Id, r)).ThrowOnError());

        public Task<IList<string>> GetRolesAsync(User user, CancellationToken cancellationToken)
            => this.tableStore.GetAllAsync<UserRoleEntity>(new UserArg(user.Id))
            .Select(z => z.RoleName);

        public Task<IList<User>> GetUsersInRoleAsync(string normalizedRoleName, CancellationToken cancellationToken)
            => this.GetRoleNameAsync(normalizedRoleName)
            .TransformAsync(r => this.tableStore.GetAllAsync<UserRoleEntity>(r.AsArg<UserRoleEntity>(x => x.RoleName)))
            .SelectAsync(z => this.FindByIdAsync(z.UserId, cancellationToken));
                
        public Task<bool> IsInRoleAsync(User user, string normalizedRoleName, CancellationToken cancellationToken)
            => this.GetRoleNameAsync(normalizedRoleName)
            .TransformAsync(r => this.tableStore.GetAsync(new UserRoleEntity(user.Id, r)))
            .IfNotNull(z => true);

        public Task RemoveFromRoleAsync(User user, string normalizedRoleName, CancellationToken cancellationToken)
            => this.GetRoleNameAsync(normalizedRoleName)
            .TransformAsync(r => this.tableStore.DeleteAsync(new UserRoleEntity(user.Id, r)))
            .ThrowOnError();
        
        private Task<string> GetRoleNameAsync(string normalizedRoleName)
            => this.tableStore.GetAsync<RoleEntity>(normalizedRoleName.AsArg<RoleEntity>(x => x.NormalizedName))
            .Transform(e => e?.Name ?? normalizedRoleName);
    }
}