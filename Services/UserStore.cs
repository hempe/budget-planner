using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using BudgetPlanner.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.WindowsAzure.Storage;
using Microsoft.WindowsAzure.Storage.Table;

namespace BudgetPlanner.Services {

    internal class UserLoginInfoEntity : TableEntity {
        internal const string TableName = "UserLoginInfoEntity";
        public string LoginProvider { get; set; }
        public string ProviderKey { get; set; }
        public string DisplayName { get; set; }
        public UserLoginInfo Convert() => new UserLoginInfo(this.LoginProvider, this.ProviderKey, this.DisplayName);
    }

    internal class UserStore : IUserStore<User>, IUserLoginStore<User>, IUserAuthenticationTokenStore<User> {
        private readonly TableStore tableStore;
        private readonly List<IStoreUserInfo> userStores;
        public UserStore(TableStore tableStore, IEnumerable<IStoreUserInfo> userStores) {
            this.tableStore = tableStore;
            this.userStores = userStores.ToList();
        }

        public async Task AddLoginAsync(User user, UserLoginInfo login, CancellationToken cancellationToken) {

            var entity = login.Convert(user.Id);
            var result = await this.tableStore.AddOrUpdateAsync(entity);
            if (result.HttpStatusCode >= 200 && result.HttpStatusCode < 300)
                return;
            throw new Exception("Update failed");
        }

        public async Task<IdentityResult> CreateAsync(User user, CancellationToken cancellationToken) {
            var result = await this.tableStore.AddOrUpdateAsync(user.Convert());
            if (result.HttpStatusCode >= 200 && result.HttpStatusCode < 300)
                return IdentityResult.Success;
            return IdentityResult.Failed();
        }

        public async Task<IdentityResult> DeleteAsync(User user, CancellationToken cancellationToken) {

            var logins = await this.GetLoginsAsync(user, cancellationToken);
            foreach (var l in logins) {
                await this.RemoveLoginAsync(user, l.LoginProvider, l.ProviderKey, cancellationToken);
            }
            var tokens = await this.GetTokensAsync(user);
            foreach (var t in tokens) {
                await this.RemoveTokenAsync(user, t.PartitionKey, t.Name, cancellationToken);
            }

            foreach (var s in this.userStores) {
                try {
                    await s.DeleteUserDataAsync(user);
                } catch { }
            }

            var result = await this.tableStore.DeleteAsync(user.Convert());
            if (result.HttpStatusCode >= 200 && result.HttpStatusCode < 300)
                return IdentityResult.Success;
            return IdentityResult.Failed();
        }

        public void Dispose() { }

        public async Task<User> FindByIdAsync(string userId, CancellationToken cancellationToken) {
            var entity = await this.tableStore.GetAsync(new UserEntity(userId));
            return entity?.Convert();
        }

        public async Task<User> FindByLoginAsync(string loginProvider, string providerKey, CancellationToken cancellationToken) {
            var entity = await this.tableStore.GetByPropertiesAsync<LoginInfoEntity>(
                new Args { { LoginInfoEntity.LoginProviderProperty, loginProvider }, { LoginInfoEntity.ProviderKeyProperty, providerKey }
                });
            if (entity == null)
                return null;

            return await this.FindByIdAsync(entity.UserId, cancellationToken);
        }

        public async Task<User> FindByNameAsync(string normalizedUserName, CancellationToken cancellationToken) {
            var entity = await this.tableStore.GetByPropertiesAsync<UserEntity>(
                new Args { { nameof(UserEntity.NormalizedUserName), normalizedUserName }
                });
            return entity?.Convert();
        }

        public async Task<IList<UserLoginInfo>> GetLoginsAsync(User user, CancellationToken cancellationToken) {
            var entities = await this.tableStore.GetAllByPropertiesAsync<LoginInfoEntity>(
                new Args { { nameof(LoginInfoEntity.UserId), user.Id } }
            );

            return entities.Select(x => x.Convert()).ToList();
        }

        public Task<string> GetNormalizedUserNameAsync(User user, CancellationToken cancellationToken) {
            return Task.FromResult(user.NormalizedUserName);
        }

        public Task<string> GetUserIdAsync(User user, CancellationToken cancellationToken) {
            return Task.FromResult<string>(user.Id);
        }

        public Task<string> GetUserNameAsync(User user, CancellationToken cancellationToken) {
            return Task.FromResult(user.UserName);
        }

        public async Task RemoveLoginAsync(User user, string loginProvider, string providerKey, CancellationToken cancellationToken) {
            var result = await this.tableStore.DeleteAsync(user.Convert());
            if (result.HttpStatusCode >= 200 && result.HttpStatusCode < 300)
                throw new Exception("Update failed");
        }

        public Task SetNormalizedUserNameAsync(User user, string normalizedName, CancellationToken cancellationToken) {
            user.NormalizedUserName = user.UserName.ToUpper();
            return Task.CompletedTask;
        }

        public async Task RemoveTokenAsync(User user, string loginProvider, string name, CancellationToken cancellationToken) {
            var result = await this.tableStore.DeleteAsync(new TokenEntity(loginProvider, user, name));
            if (result.HttpStatusCode >= 200 && result.HttpStatusCode < 300)
                throw new Exception("Update failed");
        }

        public async Task SetTokenAsync(User user, string loginProvider, string name, string value, CancellationToken cancellationToken) {
            var entity = new TokenEntity(loginProvider, user, name) {
                Value = value
            };

            var result = await this.tableStore.AddOrUpdateAsync(entity);
            if (result.HttpStatusCode >= 200 && result.HttpStatusCode < 300)
                return;

            throw new Exception("Update failed");
        }

        public async Task<string> GetTokenAsync(User user, string loginProvider, string name, CancellationToken cancellationToken) {
            var entity = await this.tableStore.GetAsync(new TokenEntity(loginProvider, user, name));
            return entity?.Value;
        }

        public Task SetUserNameAsync(User user, string userName, CancellationToken cancellationToken) {
            user.UserName = userName;
            return Task.CompletedTask;
        }

        public async Task<IdentityResult> UpdateAsync(User user, CancellationToken cancellationToken) {

            var entity = user.Convert();
            var result = await this.tableStore.AddOrUpdateAsync(entity);
            if (result.HttpStatusCode >= 200 && result.HttpStatusCode < 300)
                return IdentityResult.Success;
            return IdentityResult.Failed();
        }

        private async Task<List<TokenEntity>> GetTokensAsync(User user) {
            var entities = await this.tableStore.GetAllByPropertiesAsync<TokenEntity>(
                new Args { { nameof(TokenEntity.UserId), user.Id } }
            );
            return entities;
        }
    }
}