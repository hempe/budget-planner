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

    [Route("api/data/revenue")]
    [Authorize]
    public class RevenueController : Controller {
        private readonly UserManager<User> userManager;
        private readonly TableStore tableStore;
        public RevenueController(UserManager<User> userManager, TableStore tableStore) {
            this.userManager = userManager;
            this.tableStore = tableStore;
        }

        [HttpGet("")]
        [ProducesResponseType(typeof(OverviewValue[]), 200)]
        public async Task<IActionResult> GetOverview() {
            var value = await this.tableStore.GetAsync(new Revenue { UserId = this.UserId });
            return this.Ok((value?.Data ?? new Group<DatedValue>()).ToOverview(x => x.Value, "", nameof(Revenue)));
        }

        [HttpGet("{subType}")]
        [ProducesResponseType(typeof(Unit<DatedValue>[]), 200)]
        public async Task<IActionResult> GetRevenue([FromRoute] SubType subType) {
            var nullValue = new [] { new Unit<DatedValue>() };
            var value = await this.tableStore.GetAsync(new Revenue { UserId = this.UserId });
            return this.Ok(((subType == SubType.Negative) ? value?.Data?.Negative : value?.Data?.Positive) ?? nullValue);
        }

        [HttpPost("{subType}")]
        [ProducesResponseType(typeof(Unit<DatedValue>[]), 200)]
        public async Task<IActionResult> SetRevenue([FromRoute] SubType subType, [FromBody] Unit<DatedValue>[] data) {

            var entity = await this.tableStore.GetAsync(new Revenue { UserId = this.UserId }) ?? new Revenue { UserId = this.UserId };
            entity.Data = entity.Data ?? new Group<DatedValue>();

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