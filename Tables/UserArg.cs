using BudgetPlanner.Services;

namespace BudgetPlanner.Tables
{
    public class UserArg: Args
    {
        public UserArg(string userId){
            base.Add("UserId", userId);
        }
    }
}