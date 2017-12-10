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

namespace BudgetPlanner.Services {

    internal class UserStore : IUserStore<User>, IUserLoginStore<User>, IUserAuthenticationTokenStore<User> {
        private static List<Type> Types;
        private readonly TableStore tableStore;

        static UserStore() {
            Types = typeof(UserStore).Assembly.GetTypes().Where(t => typeof(UserData).IsAssignableFrom(t)).Where(t => t.IsTable()).ToList();
        }

        public UserStore(TableStore tableStore) {
            this.tableStore = tableStore;

        }

        public async Task AddLoginAsync(User user, UserLoginInfo login, CancellationToken cancellationToken) {

            LoginInfo entity = login;
            entity.UserId = user.Id;

            var result = await this.tableStore.AddOrUpdateAsync(entity);
            if (result.HttpStatusCode >= 200 && result.HttpStatusCode < 300)
                return;
            throw new Exception("Update failed");
        }

        public async Task<IdentityResult> CreateAsync(User user, CancellationToken cancellationToken) {
            var result = await this.tableStore.AddOrUpdateAsync<UserEntity>(user);
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

            foreach (var type in Types) {
                try {

                    var entities = await this.tableStore.GetAllAsync(type, new Args { { nameof(UserData.UserId), user.Id } });
                    foreach (var e in entities) {
                        await this.tableStore.DeleteAsync(type, e);
                    }
                } catch { }
            }

            var result = await this.tableStore.DeleteAsync<UserEntity>(user);
            if (result.HttpStatusCode >= 200 && result.HttpStatusCode < 300)
                return IdentityResult.Success;
            return IdentityResult.Failed();
        }

        public void Dispose() { }

        public async Task<User> FindByIdAsync(string userId, CancellationToken cancellationToken) {
            var entity = await this.tableStore.GetAsync(new UserEntity { UserId = userId });
            return entity;
        }

        public async Task<User> FindByLoginAsync(string loginProvider, string providerKey, CancellationToken cancellationToken) {
            var entity = await this.tableStore.GetAsync<LoginInfo>(new LoginInfo { LoginProvider = loginProvider, ProviderKey = providerKey });

            if (entity == null)
                return null;

            return await this.FindByIdAsync(entity.UserId, cancellationToken);
        }

        public async Task<User> FindByNameAsync(string normalizedUserName, CancellationToken cancellationToken) {
            var entity = await this.tableStore.GetAsync<UserEntity>(
                new Args { { nameof(UserEntity.NormalizedUserName), normalizedUserName }
                });
            return entity;
        }

        public async Task<IList<UserLoginInfo>> GetLoginsAsync(User user, CancellationToken cancellationToken) {
            var entities = await this.tableStore.GetAllAsync<LoginInfo>(
                new Args { { nameof(LoginInfo.UserId), user.Id } }
            );

            return entities.Cast<UserLoginInfo>().ToList();
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
            var result = await this.tableStore.DeleteAsync<UserEntity>(user);
            if (result.HttpStatusCode >= 200 && result.HttpStatusCode < 300)
                throw new Exception("Update failed");
        }

        public Task SetNormalizedUserNameAsync(User user, string normalizedName, CancellationToken cancellationToken) {
            user.NormalizedUserName = user.UserName.ToUpper();
            return Task.CompletedTask;
        }

        public async Task RemoveTokenAsync(User user, string loginProvider, string name, CancellationToken cancellationToken) {
            var result = await this.tableStore.DeleteAsync(new Token {
                LoginProvider = loginProvider,
                    UserId = user.Id,
                    Name = name
            });
            if (result.HttpStatusCode >= 200 && result.HttpStatusCode < 300)
                throw new Exception("Update failed");
        }

        public async Task SetTokenAsync(User user, string loginProvider, string name, string value, CancellationToken cancellationToken) {
            var entity = new Token {
                LoginProvider = loginProvider,
                UserId = user.Id,
                Name = name,
                Value = value
            };

            var result = await this.tableStore.AddOrUpdateAsync(entity);
            if (result.HttpStatusCode >= 200 && result.HttpStatusCode < 300)
                return;

            throw new Exception("Update failed");
        }

        public async Task<string> GetTokenAsync(User user, string loginProvider, string name, CancellationToken cancellationToken) {
            var entity = await this.tableStore.GetAsync(new Token {
                LoginProvider = loginProvider,
                    UserId = user.Id,
                    Name = name
            });

            return entity?.Value;
        }

        public Task SetUserNameAsync(User user, string userName, CancellationToken cancellationToken) {
            user.UserName = userName;
            return Task.CompletedTask;
        }

        public async Task<IdentityResult> UpdateAsync(User user, CancellationToken cancellationToken) {
            var result = await this.tableStore.AddOrUpdateAsync<UserEntity>(user);
            if (result.HttpStatusCode >= 200 && result.HttpStatusCode < 300)
                return IdentityResult.Success;
            return IdentityResult.Failed();
        }

        private async Task<List<Token>> GetTokensAsync(User user) {
            var entities = await this.tableStore.GetAllAsync<Token>(
                new Args { { nameof(Token.UserId), user.Id } }
            );
            return entities;
        }
    }
}