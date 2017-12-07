using Microsoft.AspNetCore.Identity;
using Microsoft.WindowsAzure.Storage.Table;

namespace BudgetPlanner.Models {
    public class RevenueEntity : UserDataEntity<Group<object>> { }
}