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
            /*
            var light = new [] {
                new DashboardConfiguration {
                Id = 0,
                Theme = "light",
                Type = "bar",
                Path = "budgets"
                },
                new DashboardConfiguration {
                Theme = "ligth",
                Type = "bar",
                Path = "assets"
                },
                new DashboardConfiguration {
                Theme = "light",
                Type = "bar",
                Path = "revenue"
                },
                new DashboardConfiguration {
                Id = 0,
                Theme = "light",
                Type = "bar",
                Path = "budgets.positiv"
                },
                new DashboardConfiguration {
                Id = 0,
                Theme = "light",
                Type = "bar",
                Path = "budgets.negativ"
                },
                new DashboardConfiguration {
                Theme = "light",
                Type = "bar",
                Path = "assets.positiv"
                },
                new DashboardConfiguration {
                Theme = "light",
                Type = "bar",
                Path = "assets.negativ"
                },
                new DashboardConfiguration {
                Theme = "light",
                Type = "bar",
                Path = "revenue.positiv"
                },
                new DashboardConfiguration {
                Theme = "light",
                Type = "bar",
                Path = "revenue.negativ"
                }
            };

            */
            var result = new [] { "budgets", "assets", "revenue" }
                .SelectMany(x => new [] {
                    new DashboardConfiguration {
                        Id = x == "budgets" ? (int?) 0 : null,
                            Theme = "light",
                            Type = "bar",
                            Path = x
                    },
                    new DashboardConfiguration {
                        Id = x == "budgets" ? (int?) 0 : null,
                            Theme = "dark",
                            Type = "bar",
                            Path = x
                    },
                    new DashboardConfiguration {
                        Id = x == "budgets" ? (int?) 0 : null,
                            Theme = "light",
                            Type = "doughnut",
                            Path = x + ".positiv"
                    },
                    new DashboardConfiguration {
                        Id = x == "budgets" ? (int?) 0 : null,
                            Theme = "dark",
                            Type = "doughnut",
                            Path = x + ".positiv"
                    },
                    new DashboardConfiguration {
                        Id = x == "budgets" ? (int?) 0 : null,
                            Theme = "light",
                            Type = "doughnut",
                            Path = x + ".negativ"
                    },
                    new DashboardConfiguration {
                        Id = x == "budgets" ? (int?) 0 : null,
                            Theme = "dark",
                            Type = "doughnut",
                            Path = x + ".negativ"
                    }
                });
            result = result.OrderBy(x => x.Theme).ThenBy(x => x.Type).ThenBy(x => x.Path).ToArray();
            return this.Ok(result);

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