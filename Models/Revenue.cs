using BudgetPlanner.Attributes;

namespace BudgetPlanner.Models {
    [Table("Revenue")]
    public class Revenue : UserData<Group<DatedValue>> { }
}