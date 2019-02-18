using System.Threading.Tasks;
using BudgetPlanner.Middleware;
using BudgetPlanner.Models;
using BudgetPlanner.Services;
using BudgetPlanner.Services.I18n;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace BudgetPlanner.Controllers
{

    [Route("api/revenue")]
    [Authorize]
    public class RevenueController : BaseController
    {
        public RevenueController(UserManager<User> userManager, TableStore tableStore) : base(userManager, tableStore) { }

        [HttpGet("")]
        [ProducesResponseType(typeof(OverviewValue[]), 200)]
        public async Task<IActionResult> GetOverview([FromServices] TranslationService i18n)
        {
            var value = await this.TableStore.GetAsync(new Tables.Revenue { UserId = this.UserId });
            var profile = await this.TableStore.GetAsync(new Tables.Profile { UserId = this.UserId });
            return this.Ok((value?.Data ?? new Group<DatedValue>()).ToOverview(x => x.Value, "", await i18n.TranslateAsync(profile?.Data?.Language, "Revenue")));
        }

        [HttpGet("{subType}")]
        [ProducesResponseType(typeof(Unit<DatedValue>[]), 200)]
        public async Task<IActionResult> GetRevenue([FromRoute] SubType subType)
        {
            var nullValue = new[] { new Unit<DatedValue>() };
            var value = await this.TableStore.GetAsync(new Tables.Revenue { UserId = this.UserId });
            return this.Ok(((subType == SubType.Negative) ? value?.Data?.Negative : value?.Data?.Positive) ?? nullValue);
        }

        [HttpPost("{subType}")]
        [ProducesResponseType(typeof(Unit<DatedValue>[]), 200)]
        public async Task<IActionResult> SetRevenue([FromRoute] SubType subType, [FromBody] Unit<DatedValue>[] data)
        {

            var entity = await this.TableStore.GetAsync(new Tables.Revenue { UserId = this.UserId }) ?? new Tables.Revenue { UserId = this.UserId };
            entity.Data = entity.Data ?? new Group<DatedValue>();

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