using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using BudgetPlanner.Middleware;
using BudgetPlanner.Models;
using BudgetPlanner.Services;
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
        [Route("export/xlsx")]
        public async Task<IActionResult> ExportPdf() {
            using(var package = new PdfHandler()) {

                var stream = package.Create(
                    await this.TableStore.GetAllAsync<Budget>(new Args { { nameof(Budget.UserId), this.UserId } }),
                    await this.TableStore.GetAsync(new Revenue { UserId = this.UserId }),
                    await this.TableStore.GetAsync(new Asset { UserId = this.UserId })
                );

                return File(stream, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "export.xlsx");
            }
        }

        [HttpGet]
        [Route("export/json")]
        public async Task<IActionResult> ExportJson() {

            var budgets = await this.TableStore.GetAllAsync<Budget>(new Args { { nameof(Budget.UserId), this.UserId } });
            var revenue = await this.TableStore.GetAsync(new Revenue { UserId = this.UserId });
            var assets = await this.TableStore.GetAsync(new Asset { UserId = this.UserId });
            var profile = await this.TableStore.GetAsync(new Profile { UserId = this.UserId });

            budgets.Where(b => b.Data != null).ToList().ForEach(b => {
                b.Data.Id = b.Id;
                b.Data.Name = b.Name;
            });

            return this.Ok(new Models.Complete {
                Budgets = budgets.Where(b => b.Data != null).Select(b => b.Data).ToArray(),
                    Assets = assets.Data,
                    Revenue = revenue.Data,
                    Client = profile.Data
            });
        }

        [HttpPost]
        [Route("import/json")]
        public async Task<IActionResult> ImportJson([FromBody] Complete value) {
            var budgets = await this.TableStore.GetAllAsync<Budget>(new Args { { nameof(Budget.UserId), this.UserId } });
            foreach (var b in budgets) {
                await this.TableStore.DeleteAsync(b);
            }

            await this.TableStore.AddOrUpdateAsync(new Asset { UserId = this.UserId, Data = value.Assets });
            await this.TableStore.AddOrUpdateAsync(new Revenue { UserId = this.UserId, Data = value.Revenue });
            await this.TableStore.AddOrUpdateAsync(new Profile { UserId = this.UserId, Data = value.Client });

            foreach (var b in value.Budgets) {
                if (string.IsNullOrWhiteSpace(b.Id))
                    b.Id = Guid.NewGuid().ToString();
                await this.TableStore.AddOrUpdateAsync(new Budget { UserId = this.UserId, Name = b.Name, Id = b.Id, Data = b });
            }

            return this.Ok();
        }
    }
}