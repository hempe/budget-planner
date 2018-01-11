using System.Threading.Tasks;
using BudgetPlanner.Middleware;
using BudgetPlanner.Models;
using BudgetPlanner.Services;
using BudgetPlanner.Services.I18n;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace BudgetPlanner.Controllers {

    [Route("api/assets")]
    [Authorize]
    public class AssetController : BaseController {

        public AssetController(UserManager<User> userManager, TableStore tableStore) : base(userManager, tableStore) { }

        [HttpGet("")]
        [ProducesResponseType(typeof(OverviewValue), 200)]
        public async Task<IActionResult> GetOverview([FromServices] TranslationService i18n) {
            var value = await this.TableStore.GetAsync(new Tables.Asset { UserId = this.UserId });
            var profile = await this.TableStore.GetAsync(new Tables.Profile { UserId = this.UserId });

            return this.Ok((value?.Data ?? new Group<NamedValue>()).ToOverview(x => x.Value, "", await i18n.TranslateAsync(profile?.Data?.Language, "Assets")));
        }

        [HttpGet("{subType}")]
        [ProducesResponseType(typeof(Unit<NamedValue>[]), 200)]
        public async Task<IActionResult> GetAssets([FromRoute] SubType subType) {
            var nullValue = new [] { new Unit<NamedValue>() };
            var value = await this.TableStore.GetAsync(new Tables.Asset { UserId = this.UserId });
            return this.Ok(((subType == SubType.Negative) ? value?.Data?.Negative : value?.Data?.Positive) ?? nullValue);
        }

        [HttpPost("{subType}")]
        [ProducesResponseType(typeof(Unit<NamedValue>[]), 200)]
        public async Task<IActionResult> SetAssets([FromRoute] SubType subType, [FromBody] Unit<NamedValue>[] data) {
            if (data == null)
                return this.BadRequest("Failed to save data.");
            var entity = await this.TableStore.GetAsync(new Tables.Asset { UserId = this.UserId }) ?? new Tables.Asset { UserId = this.UserId };
            entity.Data = entity.Data ?? new Group<NamedValue>();

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