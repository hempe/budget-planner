/*
using System;
using System.Linq;
using System.Threading.Tasks;
using BudgetPlanner.Attributes;
using BudgetPlanner.Models;
using Microsoft.WindowsAzure.Storage.Table;

namespace BudgetPlanner.Services {
    public class UserDataStore<T> : IStoreUserInfo
    where T : UserData, new() {

        private readonly TableStore tableStore;

        public UserDataStore(TableStore tableStore) {
            this.tableStore = tableStore;
        }

        public async Task SaveAsync(T value) {

            var result = await this.tableStore.AddOrUpdateAsync(value);
            if (result.HttpStatusCode >= 200 && result.HttpStatusCode < 300)
                return;
            throw new Exception("Update failed");
        }

        public async Task<T> GetAsync(T entity) {
            entity = await this.tableStore.GetAsync(entity);
            return entity;
        }

        public async Task<T> GetAllAsync(string userId) {
            var entity = await this.tableStore.GetAsync(new T { Id = string.Empty, UserId = userId });
            return entity;
        }

        async Task IStoreUserInfo.DeleteUserDataAsync(User user) {
            var result = await this.tableStore.DeleteAsync(new T { UserId = user.Id });
            if (result.HttpStatusCode >= 200 && result.HttpStatusCode < 300)
                return;
            throw new Exception("Update failed");
        }
    }
}
*/