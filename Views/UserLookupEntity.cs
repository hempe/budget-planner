using BudgetPlanner.Attributes;
using BudgetPlanner.Tables;

namespace BudgetPlanner.Views {
    [View("Users")]
    public class UserLookupEntity : UserData {
        public string UserName { get; set; }
    }
}