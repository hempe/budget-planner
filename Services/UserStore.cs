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

    internal partial class UserStore : IUserStore<User>
    {
        private static List<Type> Types;
        private readonly TableStore tableStore;

        static UserStore()
        {
            Types = typeof(UserStore).Assembly.GetTypes().Where(t => typeof(UserData).IsAssignableFrom(t)).Where(t => t.IsTable()).ToList();
        }

        public UserStore(TableStore tableStore)
        {
            this.tableStore = tableStore;
        }

        public Task<IdentityResult> CreateAsync(User user, CancellationToken cancellationToken)
            => this.tableStore.AddOrUpdateAsync<UserEntity>(user).MapToResult();

        public async Task<IdentityResult> DeleteAsync(User user, CancellationToken cancellationToken)
        {

            await this.GetLoginsAsync(user, cancellationToken)
                .WhenAll(l => this.RemoveLoginAsync(user, l.LoginProvider, l.ProviderKey, cancellationToken));

            await this.GetTokensAsync(user)
                .WhenAll(t => this.RemoveTokenAsync(user, t.PartitionKey, t.Name, cancellationToken).CatchException());

            await Task.WhenAll(Types.Select(type => 
                 this.tableStore.GetAllAsync(type, new Args { { nameof(UserData.UserId), user.Id } })
                    .WhenAll(e => this.tableStore.DeleteAsync(type,e).CatchException())
            ));

            await this.tableStore.DeleteAsync<UserEntity>(user).CatchException();

            return IdentityResult.Success;

        }

        public void Dispose() { }

        public async Task<User> FindByIdAsync(string userId, CancellationToken cancellationToken)
            => await this.tableStore.GetAsync(new UserEntity { UserId = userId });
        public async Task<User> FindByNameAsync(string normalizedUserName, CancellationToken cancellationToken)
            => await this.tableStore.GetAsync<UserEntity>(
                new Args { { nameof(UserEntity.NormalizedUserName), normalizedUserName }
            });

        public Task<string> GetNormalizedUserNameAsync(User user, CancellationToken cancellationToken)
            => user.NormalizedUserName.AsTask();

        public Task<string> GetUserIdAsync(User user, CancellationToken cancellationToken)
            => user.Id.AsTask();

        public Task<string> GetUserNameAsync(User user, CancellationToken cancellationToken)
            => user.UserName.AsTask();

        public Task SetNormalizedUserNameAsync(User user, string normalizedName, CancellationToken cancellationToken)
            => user.AsTask(u => u.NormalizedUserName = u.UserName.ToUpper());

        public Task SetUserNameAsync(User user, string userName, CancellationToken cancellationToken)
            => user.AsTask(u => u.UserName = userName);

        public Task<IdentityResult> UpdateAsync(User user, CancellationToken cancellationToken)
            => this.tableStore.AddOrUpdateAsync<UserEntity>(user).MapToResult();
        private async Task<IList<Token>> GetTokensAsync(User user)
            => await this.tableStore.GetAllAsync<Token>(
                new Args { { nameof(Token.UserId), user.Id } }
            );
    }
}