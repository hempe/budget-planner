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

    [Route("api/data/budgets")]
    [Authorize]
    public class BudgetController : Controller {
        private readonly UserManager<User> userManager;
        private readonly TableStore tableStore;
        public BudgetController(UserManager<User> userManager, TableStore tableStore) {
            this.userManager = userManager;
            this.tableStore = tableStore;
        }

        [HttpGet("")]
        [ProducesResponseType(typeof(OverviewValue[]), 200)]
        public async Task<IActionResult> GetAll() {
            var values = await this.tableStore.GetAllAsync<Budget>(new Args { { nameof(Budget.UserId), this.UserId } });
            if (values.Count == 0)
                values.Add(new Budget { Data = new Group<FrequencyValue> { }, Name = "Budget", Id = "0" });

            return this.Ok(values.Select(b => b.Data.ToOverview(x => x.Value * x.Frequency, b.Id, b.Name ?? nameof(Budget))));
        }

        [HttpGet("{id}")]
        [ProducesResponseType(typeof(OverviewValue), 200)]
        public async Task<IActionResult> GetOverview([FromRoute] string id) {
            var value = await this.tableStore.GetAsync(new Budget { Id = id, UserId = this.UserId });
            value = value ?? new Budget { Name = "Budget", Id = id };
            return this.Ok((value?.Data ?? new Group<FrequencyValue>()).ToOverview(x => x.Value * x.Frequency, value.Id, value.Name ?? nameof(Budget)));
        }

        [HttpGet("{id}/{subType}")]
        [ProducesResponseType(typeof(Unit<DatedValue>[]), 200)]
        public async Task<IActionResult> GetBudget([FromRoute] string id, [FromRoute] SubType subType) {
            var nullValue = new [] { new Unit<FrequencyValue>() };
            var value = await this.tableStore.GetAsync(new Budget { Id = id, UserId = this.UserId });
            return this.Ok(((subType == SubType.Negative) ? value?.Data?.Negative : value?.Data?.Positive) ?? nullValue);
        }

        [HttpPost("{id}/{subType}")]
        [ProducesResponseType(typeof(Unit<DatedValue>[]), 200)]
        public async Task<IActionResult> SetBudget([FromRoute] string id, [FromRoute] SubType subType, [FromBody] Unit<FrequencyValue>[] data) {

            var entity = await this.tableStore.GetAsync(new Budget { Id = id, UserId = this.UserId }) ?? new Budget { Id = id, UserId = this.UserId };
            entity.Data = entity.Data ?? new Group<FrequencyValue>();

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