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

    [Route("api/data")]
    [Authorize]
    public class DataController : Controller {
        private readonly UserManager<User> userManager;
        private readonly TableStore tableStore;
        public DataController(UserManager<User> userManager, TableStore tableStore) {
            this.userManager = userManager;
            this.tableStore = tableStore;
        }

        [HttpGet("profile")]
        [ProducesResponseType(typeof(object), 200)]
        public async Task<IActionResult> GetProfile() {
            var value = await this.tableStore.GetAsync(new Profile { UserId = this.UserId });
            return this.Ok(value?.Data ?? new object());
        }

        [HttpPost("profile")]
        [ProducesResponseType(typeof(object), 200)]
        public async Task<IActionResult> SetProfile([FromBody] object data) {
            await this.tableStore.AddOrUpdateAsync(new Profile { UserId = this.UserId, Data = data });
            return this.Ok(data);
        }

        private string UserId { get => this.userManager.GetUserId(this.User); }

    }
}