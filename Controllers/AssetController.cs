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

    [Route("api/data/assets")]
    [Authorize]
    public class AssetController : Controller {
        private readonly UserManager<User> userManager;
        private readonly TableStore tableStore;
        public AssetController(UserManager<User> userManager, TableStore tableStore) {
            this.userManager = userManager;
            this.tableStore = tableStore;
        }

        [HttpGet("")]
        [ProducesResponseType(typeof(OverviewValue), 200)]
        public async Task<IActionResult> GetOverview() {
            var value = await this.tableStore.GetAsync(new Asset { UserId = this.UserId });
            return this.Ok((value?.Data ?? new Group<NamedValue>()).ToOverview(x => x.Value, "", nameof(Asset)));
        }

        [HttpGet("{subType}")]
        [ProducesResponseType(typeof(Unit<NamedValue>[]), 200)]
        public async Task<IActionResult> GetAssets([FromRoute] SubType subType) {
            var nullValue = new [] { new Unit<NamedValue>() };
            var value = await this.tableStore.GetAsync(new Asset { UserId = this.UserId });
            return this.Ok(((subType == SubType.Negative) ? value?.Data?.Negative : value?.Data?.Positive) ?? nullValue);
        }

        [HttpPost("{subType}")]
        [ProducesResponseType(typeof(Unit<NamedValue>[]), 200)]
        public async Task<IActionResult> SetAssets([FromRoute] SubType subType, [FromBody] Unit<NamedValue>[] data) {
            var entity = await this.tableStore.GetAsync(new Asset { UserId = this.UserId }) ?? new Asset { UserId = this.UserId };
            entity.Data = entity.Data ?? new Group<NamedValue>();

            if (subType == SubType.Negative)
                entity.Data.Negative = data;
            else
                entity.Data.Positive = data;

            var result = await this.tableStore.AddOrUpdateAsync(entity);
            if (result.Success())
                return this.Ok(data);
            return this.BadRequest("Failed to save data.");
        }

        private string UserId { get => this.userManager.GetUserId(this.User); }

    }
}