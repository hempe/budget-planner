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

    internal partial class UserStore : IUserLoginStore<User> {

        public async Task AddLoginAsync(User user, UserLoginInfo login, CancellationToken cancellationToken) {

            LoginInfo entity = login;
            entity.UserId = user.Id;

            var result = await this.tableStore.AddOrUpdateAsync(entity);
            if (result.HttpStatusCode >= 200 && result.HttpStatusCode < 300)
                return;
            throw new Exception("Update failed");
        }

        public async Task<User> FindByLoginAsync(string loginProvider, string providerKey, CancellationToken cancellationToken) {
            var entity = await this.tableStore.GetAsync<LoginInfo>(new LoginInfo { LoginProvider = loginProvider, ProviderKey = providerKey });

            if (entity == null)
                return null;

            return await this.FindByIdAsync(entity.UserId, cancellationToken);
        }

        public async Task<IList<UserLoginInfo>> GetLoginsAsync(User user, CancellationToken cancellationToken) {
            var entities = await this.tableStore.GetAllAsync<LoginInfo>(
                new Args { { nameof(LoginInfo.UserId), user.Id } }
            );

            return entities.Cast<UserLoginInfo>().ToList();
        }

        public async Task RemoveLoginAsync(User user, string loginProvider, string providerKey, CancellationToken cancellationToken) {
            var result = await this.tableStore.DeleteAsync<UserEntity>(user);
            if (result.HttpStatusCode >= 200 && result.HttpStatusCode < 300)
                throw new Exception("Update failed");
        }
    }
}