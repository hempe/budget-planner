using System;
using System.Linq;
using System.Threading.Tasks;
using BudgetPlanner.Middleware;
using BudgetPlanner.Models;
using BudgetPlanner.Services;
using BudgetPlanner.Tables;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace BudgetPlanner.Controllers
{

    [Route("api/budgets")]
    [Authorize]
    public class BudgetController : BaseController
    {
        public BudgetController(UserManager<User> userManager, TableStore tableStore) : base(userManager, tableStore) { }

        [HttpGet("")]
        [ProducesResponseType(typeof(BudgetOverview[]), 200)]
        public async Task<IActionResult> GetAll()
        {
            var values = await this.TableStore.GetAllAsync<Tables.Budget>(this.UserArg);
            if (values.Count == 0)
                values.Add(new Tables.Budget { Data = new BudgetData { Name = "Budget", }, Id = Guid.NewGuid().ToString() });

            var result = values
                .Select(b => new { o = ((Group<FrequencyValue>)b.Data).ToOverview(x => x.Value * x.Frequency, b.Id, b.Data?.Name ?? nameof(Tables.Budget)), d = b.Data })
                .Select(x => new BudgetOverview
                {
                    EndYear = x.d?.EndYear,
                    StartYear = x.d?.StartYear,
                    Positive = x.o.Positive,
                    Negative = x.o.Negative,
                    Name = x.o.Name,
                    Enabled = x.d?.Enabled ?? false,
                    Id = x.o.Id,
                    Value = x.o.Value
                });

            return this.Ok(result);
        }

        [HttpGet("{id}")]
        [ProducesResponseType(typeof(BudgetOverview), 200)]
        public async Task<IActionResult> GetOverview([FromRoute] string id)
        {
            var value = await this.TableStore.GetAsync(new Tables.Budget { Id = id, UserId = this.UserId });
            value = value ?? new Tables.Budget { Data = new BudgetData { Name = "Budget" }, Id = id };
            var overview = (value?.Data ?? new Group<FrequencyValue>()).ToOverview(x => x.Value * x.Frequency, value.Id, value?.Data.Name ?? nameof(Tables.Budget));

            return this.Ok(new BudgetOverview
            {
                EndYear = value?.Data?.EndYear,
                StartYear = value?.Data?.StartYear,
                Positive = overview.Positive,
                Negative = overview.Negative,
                Name = overview.Name,
                Enabled = value?.Data?.Enabled ?? false,
                Id = overview.Id,
                Value = overview.Value
            });
        }

        [HttpGet("{id}/{subType}")]
        [ProducesResponseType(typeof(Unit<FrequencyValue>[]), 200)]
        public async Task<IActionResult> GetBudget([FromRoute] string id, [FromRoute] SubType subType)
        {
            var nullValue = new[] { new Unit<FrequencyValue>() };
            var value = await this.TableStore.GetAsync(new Tables.Budget { Id = id, UserId = this.UserId });
            return this.Ok(((subType == SubType.Negative) ? value?.Data?.Negative : value?.Data?.Positive) ?? nullValue);
        }

        [HttpPost("{from}/copy/{to}")]
        [ProducesResponseType(typeof(BudgetOverview), 200)]
        public async Task<IActionResult> CopyBudget([FromRoute] string from, [FromRoute] string to)
        {

            var entity = await this.TableStore.GetAsync(new Tables.Budget { Id = from, UserId = this.UserId });
            if (entity?.Data == null)
                return this.BadRequest("Failed to copy data.");
            entity.Id = to;
            entity.Data.Name = $"{entity.Data.Name} Copy";
            var result = await this.TableStore.AddOrUpdateAsync(entity);
            if (result.Success())
                return await this.GetOverview(to);
            return this.BadRequest("Failed to copy data.");
        }

        [HttpPost("{id}")]
        [ProducesResponseType(typeof(BudgetOverview), 200)]
        public async Task<IActionResult> SetBudgetHeader([FromRoute] string id, [FromBody] BudgetOverview data)
        {
            if (data == null)
                return this.BadRequest("Failed to save data.");

            var entity = await this.TableStore.GetAsync(new Tables.Budget { Id = id, UserId = this.UserId }) ?? new Tables.Budget { Id = id, UserId = this.UserId };
            entity.Data = entity.Data ?? new BudgetData();
            entity.Data.StartYear = data.StartYear;
            entity.Data.EndYear = data.EndYear;
            entity.Data.Enabled = data.Enabled;
            entity.Data.Name = data.Name;

            var result = await this.TableStore.AddOrUpdateAsync(entity);
            if (result.Success())
                return this.Ok(data);
            return this.BadRequest("Failed to save data.");
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(200)]
        public async Task<IActionResult> DeleteBudgetHeader([FromRoute] string id)
        {
            var result = await this.TableStore.DeleteAsync(new Tables.Budget { Id = id, UserId = this.UserId });
            if (result.Success())
                return this.Ok();
            return this.BadRequest("Failed to save data.");
        }

        [HttpPost("{id}/{subType}")]
        [ProducesResponseType(typeof(Unit<FrequencyValue>[]), 200)]
        public async Task<IActionResult> SetBudget([FromRoute] string id, [FromRoute] SubType subType, [FromBody] Unit<FrequencyValue>[] data)
        {
            if (data == null)
                return this.BadRequest("Failed to save data.");

            var entity = await this.TableStore.GetAsync(new Tables.Budget { Id = id, UserId = this.UserId }) ?? new Tables.Budget { Id = id, UserId = this.UserId };
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