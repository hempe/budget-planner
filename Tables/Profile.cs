using BudgetPlanner.Attributes;
using BudgetPlanner.Models;

namespace BudgetPlanner.Tables {

    [Table("Profile")]
    public class Profile : UserData<ProfileData> { }
}