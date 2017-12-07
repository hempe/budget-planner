using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
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

        public DataController(UserManager<User> userManager) {
            this.userManager = userManager;
        }

        [HttpGet("profile")]
        [ProducesResponseType(typeof(object), 200)]
        public async Task<IActionResult> GetProfile([FromServices] UserDataStore<ProfileEntity> store) {
            var value = await store.GetAsync(this.userManager.GetUserId(this.User));
            return this.Ok(value?.Data ?? new object());
        }

        [HttpPost("profile")]
        [ProducesResponseType(typeof(object), 200)]
        public async Task<IActionResult> SetProfile([FromServices] UserDataStore<ProfileEntity> store, [FromBody] object data) {
            await store.SaveAsync(new ProfileEntity { UserId = this.userManager.GetUserId(this.User), Data = data });
            return this.Ok(data);
        }

        [HttpGet("assets")]
        [ProducesResponseType(typeof(Group<NamedValue>), 200)]
        public async Task<IActionResult> GetAssets([FromServices] UserDataStore<AssetsEntity> store) {
            var value = await store.GetAsync(this.userManager.GetUserId(this.User));
            return this.Ok(value?.Data ?? new Group<NamedValue>());
        }

        [HttpPost("assets")]
        [ProducesResponseType(typeof(Group<NamedValue>), 200)]
        public async Task<IActionResult> SetAssets([FromServices] UserDataStore<AssetsEntity> store, [FromBody] Group<NamedValue> data) {
            await store.SaveAsync(new AssetsEntity { UserId = this.userManager.GetUserId(this.User), Data = data });
            return this.Ok(data);
        }

        [HttpGet("revenue")]
        [ProducesResponseType(typeof(Group<object>), 200)]
        public async Task<IActionResult> GetRevenue([FromServices] UserDataStore<RevenueEntity> store) {
            var value = await store.GetAsync(this.userManager.GetUserId(this.User));
            return this.Ok(value?.Data ?? new Group<object>());
        }

        [HttpPost("revenue")]
        [ProducesResponseType(typeof(Group<object>), 200)]
        public async Task<IActionResult> SetRevenue([FromServices] UserDataStore<RevenueEntity> store, [FromBody] Group<object> data) {
            await store.SaveAsync(new RevenueEntity { UserId = this.userManager.GetUserId(this.User), Data = data });
            return this.Ok(data);
        }
    }
}