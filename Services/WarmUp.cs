using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using BudgetPlanner.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using SendGrid;
using SendGrid.Helpers.Mail;

namespace BudgetPlanner.Services {

    public class WarmUpOptions {
        public List<string> AdminUsers { get; set; }
    }

    public class WarmUp {

        private readonly UserManager<User> userManager;
        private readonly RoleManager<IdentityRole> roleManager;
        private readonly TableStore tableStore;
        private WarmUpOptions options;
        public WarmUp(UserManager<User> userManager, RoleManager<IdentityRole> roleManager, IOptions<WarmUpOptions> options, TableStore tableStore) {
            this.userManager = userManager;
            this.options = options.Value;
            this.tableStore = tableStore;
            this.roleManager = roleManager;
        }
        public void Load()  => this.LoadAsync().GetAwaiter().GetResult();

        private async Task LoadAsync() {
            if (this.options == null || this.options.AdminUsers == null)
                return;

            await this.roleManager.CreateAsync(new IdentityRole("admin"));

            foreach (var admin in this.options.AdminUsers) {
                var user = await this.userManager.FindByNameAsync(admin);
                if (user == null)
                    continue;
                await this.userManager.AddToRoleAsync(user, "admin");
            }

        }
    }
}