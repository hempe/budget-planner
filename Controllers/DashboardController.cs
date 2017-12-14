using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BudgetPlanner.Middleware;
using BudgetPlanner.Models;
using BudgetPlanner.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace BudgetPlanner.Controllers {

    [Route("api/data/dashboard")]
    [Authorize]
    public class DashboardController : Controller {
        private readonly UserManager<User> userManager;
        private readonly TableStore tableStore;
        public DashboardController(UserManager<User> userManager, TableStore tableStore) {
            this.userManager = userManager;
            this.tableStore = tableStore;
        }

        [HttpGet("")]
        [ProducesResponseType(typeof(DashboardConfiguration[]), 200)]
        public async Task<IActionResult> GetAll() {
            await Task.CompletedTask;
            return this.Ok(new [] {
                new DashboardConfiguration {
                    Id = 0,
                        Theme = "light",
                        Type = "bar",
                        Path = "budgets"
                },
                new DashboardConfiguration {
                    Theme = "dark",
                        Type = "bar",
                        Path = "assets"
                },
                new DashboardConfiguration {
                    Theme = "dark",
                        Type = "bar",
                        Path = "revenue"
                }
            });

            /* 
            var values = await this.tableStore.GetAllAsync<Dashboard>(new Args { { nameof(Dashboard.UserId), this.UserId } });
            return this.Ok(values?.Where(x => x.Data != null).Select(x => x.Data) ?? new DashboardConfiguration[0]);
            */
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(200)]
        public async Task<IActionResult> Delete([FromRoute] string id) {
            await this.tableStore.DeleteAsync(new Dashboard { UserId = this.UserId, Id = id });
            return this.Ok();
        }

        [HttpPost("{id}")]
        [ProducesResponseType(200)]
        public async Task<IActionResult> Add([FromBody] DashboardConfiguration config) {
            await this.tableStore.AddOrUpdateAsync(new Dashboard { UserId = this.UserId, Id = Guid.NewGuid().ToString(), Data = config });
            return this.Ok();
        }

        private string UserId { get => this.userManager.GetUserId(this.User); }
    }
}