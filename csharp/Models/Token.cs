using BudgetPlanner.Attributes;
using Microsoft.AspNetCore.Identity;
using Microsoft.WindowsAzure.Storage.Table;

namespace BudgetPlanner.Models {

    [Table("Tokens")]
    public class Token : UserData {
        public string Name { get; set; }
        public string Value { get; set; }

        [IgnoreProperty]
        [RowKey]
        public string LoginProvider { get; set; }
        public Token() { }
    }
}