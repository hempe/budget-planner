using System.Linq;
using System.Threading.Tasks;
using BudgetPlanner.Models;
using BudgetPlanner.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace BudgetPlanner.Controllers
{

    [Route("api/dashboard")]
    [Authorize]
    public class DashboardController : BaseController
    {
        public DashboardController(UserManager<User> userManager, TableStore tableStore) : base(userManager, tableStore) { }

        [HttpGet("")]
        [ProducesResponseType(typeof(DashboardConfiguration[]), 200)]
        public async Task<IActionResult> GetAll()
        {
            var values = await this.TableStore.GetAllAsync<Tables.Dashboard>(this.UserArg);
            return this.Ok(values.Select(x => (DashboardConfiguration)x));
        }

        [HttpGet("{path}")]
        [ProducesResponseType(200)]
        public async Task<IActionResult> GetTheme([FromRoute] string path)
        {
            Tables.Dashboard source = new DashboardConfiguration { Path = path };
            source.UserId = this.UserId;
            var result = await this.TableStore.GetAsync(source);
            return this.Ok(new { Theme = result?.Theme });
        }

        [HttpGet("{path}/{id}")]
        [ProducesResponseType(200)]
        public async Task<IActionResult> GetTheme([FromRoute] string path, [FromRoute] string id)
        {
            Tables.Dashboard source = new DashboardConfiguration { Path = path, Id = id };
            source.UserId = this.UserId;
            var result = await this.TableStore.GetAsync(source);
            return this.Ok(new { Theme = result?.Theme });
        }

        [HttpDelete("{path}")]
        [ProducesResponseType(200)]
        public async Task<IActionResult> Delete([FromRoute] string path)
        {
            Tables.Dashboard source = new DashboardConfiguration { Path = path };
            source.UserId = this.UserId;
            await this.TableStore.DeleteAsync(source);
            return this.Ok();
        }

        [HttpDelete("{path}/{id}")]
        [ProducesResponseType(200)]
        public async Task<IActionResult> Delete([FromRoute] string path, [FromRoute] string id)
        {
            Tables.Dashboard source = new DashboardConfiguration { Path = path, Id = id };
            source.UserId = this.UserId;
            await this.TableStore.DeleteAsync(source);
            return this.Ok();
        }

        [HttpPost("")]
        [ProducesResponseType(200)]
        public async Task<IActionResult> Add([FromBody] DashboardConfiguration config)
        {
            Tables.Dashboard dashboard = config;
            dashboard.UserId = this.UserId;
            await this.TableStore.AddOrUpdateAsync(dashboard);
            return this.Ok(config);
        }
    }
}