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
    public class BudgetController : BaseController {
        public BudgetController(UserManager<User> userManager, TableStore tableStore) : base(userManager, tableStore) { }

        [HttpGet("")]
        [ProducesResponseType(typeof(BudgetOverview[]), 200)]
        public async Task<IActionResult> GetAll() {
            var values = await this.TableStore.GetAllAsync<Budget>(new Args { { nameof(Budget.UserId), this.UserId } });
            if (values.Count == 0)
                values.Add(new Budget { Data = new BudgetData { }, Name = "Budget", Id = "0" });

            var result = values
                .Select(b => new { o = b.Data.ToOverview(x => x.Value * x.Frequency, b.Id, b.Name ?? nameof(Budget)), d = b.Data })
                .Select(x => new BudgetOverview {
                    EndYear = x.d?.EndYear,
                        StartYear = x.d?.StartYear,
                        Positive = x.o.Positive,
                        Negative = x.o.Negative,
                        Name = x.o.Name,
                        Id = x.o.Id,
                        Value = x.o.Value
                });

            return this.Ok(result);
        }

        [HttpGet("{id}")]
        [ProducesResponseType(typeof(BudgetOverview), 200)]
        public async Task<IActionResult> GetOverview([FromRoute] string id) {
            var value = await this.TableStore.GetAsync(new Budget { Id = id, UserId = this.UserId });
            value = value ?? new Budget { Name = "Budget", Id = id };
            var overview = (value?.Data ?? new Group<FrequencyValue>()).ToOverview(x => x.Value * x.Frequency, value.Id, value.Name ?? nameof(Budget));

            return this.Ok(new BudgetOverview {
                EndYear = value?.Data?.EndYear,
                    StartYear = value?.Data?.StartYear,
                    Positive = overview.Positive,
                    Negative = overview.Negative,
                    Name = overview.Name,
                    Id = overview.Id,
                    Value = overview.Value
            });
        }

        [HttpGet("{id}/{subType}")]
        [ProducesResponseType(typeof(Unit<FrequencyValue>[]), 200)]
        public async Task<IActionResult> GetBudget([FromRoute] string id, [FromRoute] SubType subType) {
            var nullValue = new [] { new Unit<FrequencyValue>() };
            var value = await this.TableStore.GetAsync(new Budget { Id = id, UserId = this.UserId });
            return this.Ok(((subType == SubType.Negative) ? value?.Data?.Negative : value?.Data?.Positive) ?? nullValue);
        }

        [HttpPost("{id}")]
        [ProducesResponseType(typeof(BudgetOverview), 200)]
        public async Task<IActionResult> SetBudgetHeader([FromRoute] string id, [FromBody] BudgetOverview data) {

            var entity = await this.TableStore.GetAsync(new Budget { Id = id, UserId = this.UserId }) ?? new Budget { Id = id, UserId = this.UserId };
            entity.Data = entity.Data ?? new BudgetData();
            entity.Data.StartYear = data.StartYear;
            entity.Data.EndYear = data.EndYear;
            entity.Name = data.Name;

            var result = await this.TableStore.AddOrUpdateAsync(entity);
            if (result.Success())
                return this.Ok(data);
            return this.BadRequest("Failed to save data.");
        }

        [HttpPost("{id}/{subType}")]
        [ProducesResponseType(typeof(Unit<FrequencyValue>[]), 200)]
        public async Task<IActionResult> SetBudget([FromRoute] string id, [FromRoute] SubType subType, [FromBody] Unit<FrequencyValue>[] data) {

            var entity = await this.TableStore.GetAsync(new Budget { Id = id, UserId = this.UserId }) ?? new Budget { Id = id, UserId = this.UserId };
            entity.Data = entity.Data ?? new BudgetData();

            if (subType == SubType.Negative)
                entity.Data.Negative = data;
            else
                entity.Data.Positive = data;

            var result = await this.TableStore.AddOrUpdateAsync(entity);
            if (result.Success())
                return this.Ok(data);
            return this.BadRequest("Failed to save data.");
        }

    }
}