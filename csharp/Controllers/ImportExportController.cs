using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BudgetPlanner.Middleware;
using BudgetPlanner.Models;
using BudgetPlanner.Services;
using BudgetPlanner.Services.Export;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using OfficeOpenXml;
using OfficeOpenXml.Style;

namespace BudgetPlanner.Controllers {

    [Route("api/data")]
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
            await handler.ImportAsync(this.UserId, value);
            return this.Ok();
        }
    }
}