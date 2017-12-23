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
using OfficeOpenXml;
using OfficeOpenXml.Style;

namespace BudgetPlanner.Controllers {

    [Route("api/data/export/pdf")]
    [Authorize]
    public class PdfController : Controller {
        private readonly IHostingEnvironment _hostingEnvironment;
        private readonly UserManager<User> userManager;
        private readonly TableStore tableStore;

        public PdfController(IHostingEnvironment hostingEnvironment, UserManager<User> userManager, TableStore tableStore) {
            this._hostingEnvironment = hostingEnvironment;
            this.userManager = userManager;
            this.tableStore = tableStore;
        }

        private(int row, int col) DoBudget(ExcelWorksheet worksheet, int row, int col, string name, IEnumerable<Unit<FrequencyValue>> values) {

            worksheet.Row(row)
                .Set(x => x.Height = 40);

            worksheet.Cells[row, col, row, col + 3]
                .Set(x => x.Merge = true)
                .Set(x => x.Value = name)
                .Set(x => x.Style.Font.Size = 20)
                .Set(x => x.Style.VerticalAlignment = ExcelVerticalAlignment.Center)
                .Set(x => x.Style.HorizontalAlignment = ExcelHorizontalAlignment.Center);

            row++;

            worksheet.Row(row)
                .Set(x => x.Height = 30)
                .Set(x => x.Style.Font.Size = 11);

            worksheet.Cells[row, col, row, col + 3]
                .Set(x => x.Style.Fill.PatternType = ExcelFillStyle.Solid)
                .Set(x => x.Style.Font.Bold = true)
                .Set(x => x.Style.Font.Color.SetColor(Color.White))
                .Set(x => x.Style.Fill.BackgroundColor.SetColor(Color.FromArgb(0, 140, 180)))
                .Set(x => x.Style.HorizontalAlignment = ExcelHorizontalAlignment.Left)
                .Set(x => x.Style.VerticalAlignment = ExcelVerticalAlignment.Center)
                .Set(x => x.Style.Indent = 1);

            worksheet.Column(col + 0).Width = 20;

            worksheet.Cells[row, col + 1]
                .Set(x => x.Value = "Nameing");

            worksheet.Column(col + 1).Width = 30;

            worksheet.Cells[row, col + 2]
                .Set(x => x.Value = "Frequency");
            worksheet.Column(col + 2).Width = 15;

            worksheet.Cells[row, col + 3]
                .Set(x => x.Value = "Amount")
                .Set(x => x.Style.Numberformat.Format = "0.00");
            worksheet.Column(col + 3).Width = 12;

            worksheet.Column(col + 4).Hidden = true;
            row++;

            foreach (var income in values) {
                var start = row;
                var i = 0;
                var elements = income.Elements.ToList();
                elements.AddRange(new [] {
                    new FrequencyValue { },
                    new FrequencyValue { }
                });

                foreach (var e in elements) {
                    i++;
                    worksheet.Row(row)
                        .Set(x => x.Height = 30);

                    worksheet.Cells[row, col + 1].Value = e.Name;
                    worksheet.Cells[row, col + 2].Value = e.Frequency;
                    worksheet.Cells[row, col + 3].Value = e.Value;
                    worksheet.Cells[row, col + 4].Formula = $"{(col+2).GetExcelColumnName()}{row}*{(col+3).GetExcelColumnName()}{row}";
                    var color = i % 2 == 1 ? Color.FromArgb(239, 239, 239) : Color.White;

                    worksheet.Cells[row, col + 1]
                        .Set(x => x.Style.Fill.PatternType = ExcelFillStyle.Solid)
                        .Set(x => x.Style.Fill.BackgroundColor.SetColor(color))
                        .Set(x => x.Style.HorizontalAlignment = ExcelHorizontalAlignment.Left)
                        .Set(x => x.Style.VerticalAlignment = ExcelVerticalAlignment.Center)
                        .Set(x => x.Style.Indent = 1);

                    worksheet.Cells[row, col + 2, row, col + 3]
                        .Set(x => x.Style.Fill.PatternType = ExcelFillStyle.Solid)
                        .Set(x => x.Style.Fill.BackgroundColor.SetColor(color))
                        .Set(x => x.Style.HorizontalAlignment = ExcelHorizontalAlignment.Right)
                        .Set(x => x.Style.VerticalAlignment = ExcelVerticalAlignment.Center)
                        .Set(x => x.Style.Indent = 1);

                    row++;
                }

                var end = row - 1;

                worksheet.Row(row)
                    .Set(x => x.Height = 30)
                    .Set(x => x.Style.VerticalAlignment = ExcelVerticalAlignment.Center);

                worksheet.Cells[start, col]
                    .Set(x => x.Value = income.Name)
                    .Set(x => x.Style.HorizontalAlignment = ExcelHorizontalAlignment.Left)
                    .Set(x => x.Style.VerticalAlignment = ExcelVerticalAlignment.Center)
                    .Set(x => x.Style.Indent = 1)
                    .Set(x => x.Style.Fill.PatternType = ExcelFillStyle.Solid)
                    .Set(x => x.Style.Fill.BackgroundColor.SetColor(Color.FromArgb(231, 246, 251)));

                if (end > start)
                    worksheet.Cells[start + 1, col, end, col]
                    .Set(x => x.Merge = true)
                    .Set(x => x.Style.Fill.PatternType = ExcelFillStyle.Solid)
                    .Set(x => x.Style.Fill.BackgroundColor.SetColor(Color.FromArgb(231, 246, 251)));

                worksheet.Cells[row, col + 0].Value = "Sub Total";

                worksheet.Cells[row, col + 0, row, col + 2]
                    .Set(x => x.Merge = true);

                worksheet.Cells[row, col + 0, row, col + 2]
                    .Set(x => x.Style.Font.Color.SetColor(Color.FromArgb(0, 140, 180)))
                    .Set(x => x.Style.Border.Top.Style = ExcelBorderStyle.Thin)
                    .Set(x => x.Style.Border.Top.Color.SetColor(Color.FromArgb(0, 140, 180)))
                    .Set(x => x.Style.HorizontalAlignment = ExcelHorizontalAlignment.Left)
                    .Set(x => x.Style.VerticalAlignment = ExcelVerticalAlignment.Center)
                    .Set(x => x.Style.Indent = 1);

                var subT = (col + 4).GetExcelColumnName();
                worksheet.Cells[row, col + 3]
                    .Set(x => x.Formula = $"SUM({subT}{start}:{subT}{end})")
                    .Set(x => x.Style.Font.Color.SetColor(Color.FromArgb(0, 140, 180)))
                    .Set(x => x.Style.Border.Top.Style = ExcelBorderStyle.Thin)
                    .Set(x => x.Style.Border.Top.Color.SetColor(Color.FromArgb(0, 140, 180)))
                    .Set(x => x.Style.HorizontalAlignment = ExcelHorizontalAlignment.Right)
                    .Set(x => x.Style.VerticalAlignment = ExcelVerticalAlignment.Center)
                    .Set(x => x.Style.Indent = 1);
                row++;
            }

            worksheet.Cells[row, col + 0, row, col + 2]
                .Set(x => x.Merge = true)
                .Set(x => x.Value = "Total");

            worksheet.Cells[row, col + 0, row, col + 2]
                .Set(x => x.Style.Font.Bold = true)
                .Set(x => x.Style.Font.Color.SetColor(Color.FromArgb(0, 140, 180)))
                .Set(x => x.Style.Border.Top.Style = ExcelBorderStyle.Medium)
                .Set(x => x.Style.Border.Top.Color.SetColor(Color.FromArgb(0, 140, 180)))
                .Set(x => x.Style.HorizontalAlignment = ExcelHorizontalAlignment.Left)
                .Set(x => x.Style.VerticalAlignment = ExcelVerticalAlignment.Center)
                .Set(x => x.Style.Indent = 1);

            worksheet.Row(row)
                .Set(x => x.Height = 30)
                .Set(x => x.Style.VerticalAlignment = ExcelVerticalAlignment.Center);

            var colname = (col + 4).GetExcelColumnName();
            worksheet.Cells[row, col + 3]
                .Set(x => x.Formula = $"SUM({colname}:{colname})")
                .Set(x => x.Style.Font.Bold = true)
                .Set(x => x.Style.Font.Color.SetColor(Color.FromArgb(0, 140, 180)))
                .Set(x => x.Style.Border.Top.Style = ExcelBorderStyle.Medium)
                .Set(x => x.Style.Border.Top.Color.SetColor(Color.FromArgb(0, 140, 180)))
                .Set(x => x.Style.HorizontalAlignment = ExcelHorizontalAlignment.Right)
                .Set(x => x.Style.VerticalAlignment = ExcelVerticalAlignment.Center)
                .Set(x => x.Style.Indent = 1);

            row++;

            return (row, col + 4);
        }

        private void DoRevenue(ExcelWorksheet worksheet, int row, int col, string name, IEnumerable<Unit<DatedValue>> values) {

            worksheet.Cells[row, col].Value = name;
            worksheet.Cells[row, col, row, col + 3].Merge = true;
            row++;

            worksheet.Cells[row, col + 0].Value = "Group";
            worksheet.Cells[row, col + 1].Value = "Name";
            worksheet.Cells[row, col + 2].Value = "Year";
            worksheet.Cells[row, col + 3].Value = "Value";

            foreach (var income in values) {
                row++;

                var start = row;
                worksheet.Cells[row, col + 0].Value = income.Name;

                foreach (var e in income.Elements) {
                    worksheet.Cells[row, col + 1].Value = e.Name;
                    worksheet.Cells[row, col + 2].Value = e.Year;
                    worksheet.Cells[row, col + 3].Value = e.Value;
                    row++;
                }

                var end = row - 1;
                worksheet.Cells[start, col, end, col].Merge = true;
                row++;
            }
        }

        private void DoAssets(ExcelWorksheet worksheet, int row, int col, string name, IEnumerable<Unit<NamedValue>> values) {

            worksheet.Cells[row, col].Value = name;
            worksheet.Cells[row, col, row, col + 3].Merge = true;
            row++;

            worksheet.Cells[row, col + 0].Value = "Group";
            worksheet.Cells[row, col + 1].Value = "Name";
            worksheet.Cells[row, col + 2].Value = "Value";

            foreach (var income in values) {
                row++;

                var start = row;
                worksheet.Cells[row, col + 0].Value = income.Name;

                foreach (var e in income.Elements) {
                    worksheet.Cells[row, col + 1].Value = e.Name;
                    worksheet.Cells[row, col + 2].Value = e.Value;
                    row++;
                }

                var end = row - 1;
                worksheet.Cells[start, col, end, col].Merge = true;
                row++;
            }
        }

        [HttpGet]
        [Route("")]
        public async Task<string> Export() {

            string sWebRootFolder = _hostingEnvironment.ContentRootPath;
            string sFileName = @"demo.xlsx";
            string URL = string.Format("{0}://{1}/{2}", Request.Scheme, Request.Host, sFileName);
            FileInfo file = new FileInfo(Path.Combine(sWebRootFolder, sFileName));
            if (file.Exists) {
                file.Delete();
                file = new FileInfo(Path.Combine(sWebRootFolder, sFileName));
            }

            using(ExcelPackage package = new ExcelPackage(file)) {

                var budgets = await this.tableStore.GetAllAsync<Budget>(new Args { { nameof(Budget.UserId), this.UserId } });
                foreach (var budget in budgets.Where(b => b.Data != null)) {
                    ExcelWorksheet worksheet = package.Workbook.Worksheets.Add($"Budget {budget.Name}");

                    var (rI, cI) = this.DoBudget(worksheet, 2, 2, "Income", budget.Data.Positive);
                    var (rE, cE) = this.DoBudget(worksheet, 2, cI + 2, "Expenses", budget.Data.Negative);

                    worksheet.Row(1)
                        .Set(x => x.Height = 60)
                        .Set(x => x.Style.Font.Size = 40)
                        .Set(x => x.Style.VerticalAlignment = ExcelVerticalAlignment.Center)
                        .Set(x => x.Style.HorizontalAlignment = ExcelHorizontalAlignment.Left)
                        .Set(x => x.Style.Indent = 3)
                        .Set(x => x.Style.Font.Color.SetColor(Color.FromArgb(0, 140, 180)));

                    worksheet.Cells[1, 1, 1, cE + 1]
                        .Set(x => x.Merge = true)
                        .Set(x => x.Value = budget.Name);

                    worksheet.Cells[1, 1, Math.Max(rI, rE) + 1, cE + 1].Style.Font.Name = "URW Gothic";
                }

                var revenue = await this.tableStore.GetAsync(new Revenue { UserId = this.UserId });
                if (revenue?.Data != null) {
                    ExcelWorksheet worksheet = package.Workbook.Worksheets.Add("Revenue");
                    worksheet.Cells[1, 1].Value = "Revenue";
                    worksheet.Cells[1, 1, 1, 9].Merge = true;

                    this.DoRevenue(worksheet, 2, 1, "Planned income", revenue.Data.Positive);
                    this.DoRevenue(worksheet, 2, 6, "Planned expenses", revenue.Data.Negative);
                }

                var assets = await this.tableStore.GetAsync(new Asset { UserId = this.UserId });
                if (assets?.Data != null) {
                    ExcelWorksheet worksheet = package.Workbook.Worksheets.Add("Assets");
                    worksheet.Cells[1, 1].Value = "Assets";
                    worksheet.Cells[1, 1, 1, 9].Merge = true;

                    this.DoAssets(worksheet, 2, 1, "Assets", assets.Data.Positive);
                    this.DoAssets(worksheet, 2, 6, "Debts", assets.Data.Negative);
                }

                /*
                                // add a new worksheet to the empty workbook
                                ExcelWorksheet worksheet = package.Workbook.Worksheets.Add("Employee");
                                //First add the headers
                                worksheet.Cells[1, 1].Value = "ID";
                                worksheet.Cells[1, 2].Value = "Name";
                                worksheet.Cells[1, 3].Value = "Gender";
                                worksheet.Cells[1, 4].Value = "Salary (in $)";

                                //Add values
                                worksheet.Cells["A2"].Value = 1000;
                                worksheet.Cells["B2"].Value = "Jon";
                                worksheet.Cells["C2"].Value = "M";
                                worksheet.Cells["D2"].Value = 5000;

                                worksheet.Cells["A3"].Value = 1001;
                                worksheet.Cells["B3"].Value = "Graham";
                                worksheet.Cells["C3"].Value = "M";
                                worksheet.Cells["D3"].Value = 10000;

                                worksheet.Cells["A4"].Value = 1002;
                                worksheet.Cells["B4"].Value = "Jenny";
                                worksheet.Cells["C4"].Value = "F";
                                worksheet.Cells["D4"].Value = 5000;
                 */

                package.Save(); //Save the workbook.
            }
            return URL;
        }

        private string UserId { get => this.userManager.GetUserId(this.User); }

    }
}