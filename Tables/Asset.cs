using BudgetPlanner.Attributes;
using BudgetPlanner.Models;

namespace BudgetPlanner.Tables {
    [Table("Assets")]
    public class Asset : UserData<Group<NamedValue>> { }
}