using System;
using System.Threading.Tasks;
using BudgetPlanner.Models;
using BudgetPlanner.Services;
using BudgetPlanner.Services.Export;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace BudgetPlanner.Controllers {

    [Route("api")]
    [Authorize]
    public class ImportExportController : BaseController {
        public ImportExportController(UserManager<User> userManager, TableStore tableStore) : base(userManager, tableStore) { }

        [HttpGet]
        [Route("export")]
        public async Task<IActionResult> Export(
            [FromServices] BaseHandler json, [FromServices] XlsHandler xls, [FromServices] HtmlHandler html, [FromQuery] string format
        ) {
            try {
                IActionResult file = null;
                switch (format.ToLower()) {
                    case "xlsx":
                    case "xls":
                        file = this.File(await xls.GetExportAsync(this.UserId), "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
                        break;
                    case "html":
                        file = this.File(await html.GetExportAsync(this.UserId), "text/html");
                        break;
                    default:
                        file = this.File(await json.GetExportAsync(this.UserId), "application/json");
                        break;
                }
                return file;
            } catch (Exception e) {
                return this.Ok(e);
            }
        }

        [HttpPost]
        [Route("import")]
        public async Task<IActionResult> ImportJson([FromServices] BaseHandler handler, [FromBody] Complete value) {
            if (value == null)
                return this.BadRequest("CouldNotParseJson");
            await handler.ImportAsync(this.UserId, value);
            return this.Ok();
        }
    }
}