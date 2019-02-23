using System;
using System.Threading;
using System.Threading.Tasks;
using BudgetPlanner.Tables;
using Microsoft.AspNetCore.Identity;
using Microsoft.WindowsAzure.Storage.Table;

namespace BudgetPlanner.Services
{
    internal class RoleStore : IRoleStore<IdentityRole>
    {

        private readonly TableStore tableStore;
        public RoleStore(TableStore tableStore) => this.tableStore = tableStore;

        public Task<IdentityResult> CreateAsync(IdentityRole role, CancellationToken cancellationToken)
            => this.tableStore.AddOrUpdateAsync<RoleEntity>(role).MapToResult();

        public Task<IdentityResult> DeleteAsync(IdentityRole role, CancellationToken cancellationToken)
            => this.tableStore.DeleteAsync<RoleEntity>(role).MapToResult();
        public void Dispose() { }

        public async Task<IdentityRole> FindByIdAsync(string roleId, CancellationToken cancellationToken)
            => await this.tableStore.GetAsync(new RoleEntity { Id = roleId });

        public async Task<IdentityRole> FindByNameAsync(string normalizedRoleName, CancellationToken cancellationToken)
            => await this.tableStore.GetAsync<RoleEntity>( new Args { { nameof(RoleEntity.NormalizedName), normalizedRoleName }});

        public Task<string> GetNormalizedRoleNameAsync(IdentityRole role, CancellationToken cancellationToken)
            => role.NormalizedName.AsTask();

        public Task<string> GetRoleIdAsync(IdentityRole role, CancellationToken cancellationToken)
            => role.Id.AsTask();

        public Task<string> GetRoleNameAsync(IdentityRole role, CancellationToken cancellationToken)
            => role.Name.AsTask();

        public Task SetNormalizedRoleNameAsync(IdentityRole role, string normalizedName, CancellationToken cancellationToken)
            => role.AsTask(r => r.NormalizedName = normalizedName);

        public Task SetRoleNameAsync(IdentityRole role, string roleName, CancellationToken cancellationToken)
            => role.AsTask(r => r.Name = roleName);

        public Task<IdentityResult> UpdateAsync(IdentityRole role, CancellationToken cancellationToken)
            => this.tableStore.AddOrUpdateAsync<RoleEntity>(role).MapToResult();
    }
}