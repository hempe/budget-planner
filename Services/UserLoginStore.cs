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

namespace BudgetPlanner.Services {

    internal partial class UserStore : IUserLoginStore<User> {

        public Task AddLoginAsync(User user, UserLoginInfo login, CancellationToken cancellationToken)
            => this.tableStore.AddOrUpdateAsync(new LoginInfo(login){ UserId = user.Id}).ThrowOnError();
        
        public Task<User> FindByLoginAsync(string loginProvider, string providerKey, CancellationToken cancellationToken)
            => this.tableStore.GetAsync<LoginInfo>(new LoginInfo { LoginProvider = loginProvider, ProviderKey = providerKey })
                .ContinueWithAsync(e => e == null ? default : this.FindByIdAsync(e.UserId, cancellationToken));

        public Task<IList<UserLoginInfo>> GetLoginsAsync(User user, CancellationToken cancellationToken)
            => this.tableStore
                .GetAllAsync<LoginInfo>(new UserArg(user.Id))
                .ContinueWithAsync(z => z.Cast<UserLoginInfo>().ToIList());
        
        public Task RemoveLoginAsync(User user, string loginProvider, string providerKey, CancellationToken cancellationToken)
            => this.tableStore.DeleteAsync<UserEntity>(user).CatchException();
    }
}