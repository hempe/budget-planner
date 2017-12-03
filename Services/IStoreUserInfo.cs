using System.Threading.Tasks;

namespace BudgetPlanner.Services {
    internal interface IStoreUserInfo {
        Task DeleteUserDataAsync(Models.User user);
    }
}