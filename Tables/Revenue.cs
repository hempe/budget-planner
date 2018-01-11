using BudgetPlanner.Attributes;
using BudgetPlanner.Models;

namespace BudgetPlanner.Tables {
    [Table("Revenue")]
    public class Revenue : UserData<Group<DatedValue>> { }
}