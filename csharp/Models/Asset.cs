using BudgetPlanner.Attributes;

namespace BudgetPlanner.Models {
    [Table("Assets")]
    public class Asset : UserData<Group<NamedValue>> { }
}