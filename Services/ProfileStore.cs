using System;
using System.Threading.Tasks;
using BudgetPlanner.Models;

namespace BudgetPlanner.Services {
    public class ProfileStore : IStoreUserInfo {

        private readonly TableStore tableStore;
        public ProfileStore(TableStore tableStore) {
            this.tableStore = tableStore;
        }

        public async Task SaveProfileAsync(string userId, string profile) {

            var result = await this.tableStore.AddOrUpdateAsync(new ProfileEntity(userId) { Value = profile });
            if (result.HttpStatusCode >= 200 && result.HttpStatusCode < 300)
                return;
            throw new Exception("Update failed");
        }

        public async Task<string> GetProfileAsync(string userId) {
            var entity = await this.tableStore.GetAsync(new ProfileEntity(userId));
            return entity?.Value;
        }

        async Task IStoreUserInfo.DeleteUserDataAsync(User user) {
            var result = await this.tableStore.DeleteAsync(new ProfileEntity(user.Id));
            if (result.HttpStatusCode >= 200 && result.HttpStatusCode < 300)
                return;
            throw new Exception("Update failed");
        }
    }
}