using Microsoft.AspNetCore.Identity;
using Microsoft.WindowsAzure.Storage.Table;

namespace BudgetPlanner.Models {
    public class AssetsEntity : UserDataEntity<Group<NamedValue>> { }
}