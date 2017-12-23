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

            var nameElement = worksheet.Cells(row, col, 0, 3)
                .Merge()
                .Value(name);

            row++;

            worksheet.Cells(row, col, 0, 3)
                .Bold().FontSize(11).FontColor(Color.White)
                .BackgroundColor(Color.FromArgb(0, 140, 180))
                .Height(30);

            worksheet.Cells(row, col)
                .Column(x => {
                    x.Style.HorizontalAlignment = ExcelHorizontalAlignment.Left;
                    x.Style.Indent = 1;
                })
                .Width(20);

            worksheet.Cells(row, col + 1)
                .Value("Name")
                .Column(x => {
                    x.Style.HorizontalAlignment = ExcelHorizontalAlignment.Left;
                    x.Style.Indent = 1;
                })
                .Width(30);

            worksheet.Cells(row, col + 2)
                .Value("Frequency")
                .Column(x => {
                    x.Style.Numberformat.Format = "0";
                    x.Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                    x.Style.Indent = 1;
                })
                .Width(15);

            worksheet.Cells(row, col + 3)
                .Value("Amount")
                .Column(x => {
                    x.Style.Numberformat.Format = "#,###.00";
                    x.Style.HorizontalAlignment = ExcelHorizontalAlignment.Right;
                    x.Style.Indent = 1;
                })
                .Width(12);
            worksheet.Column(col + 4).Hidden = true;
            row++;

            nameElement.Center().FontSize(20).Height(40);

            foreach (var income in values) {
                var start = row;
                var i = 0;
                var elements = income.Elements.ToList();
                elements.AddRange(new [] { new FrequencyValue { }, new FrequencyValue { } });

                foreach (var e in elements) {
                    i++;
                    worksheet.Cells(row, col + 1, 0, 3)
                        .Height(30)
                        .BackgroundColor(i % 2 == 1 ? Color.FromArgb(239, 239, 239) : Color.White);

                    worksheet.Cells(row, col + 1).Value(e.Name);
                    if (e.Frequency != 0)
                        worksheet.Cells(row, col + 2).Value(e.Frequency);
                    if (e.Value != 0)
                        worksheet.Cells(row, col + 3).Value(e.Value);
                    worksheet.Cells(row, col + 4).Formula($"{(col+2).GetExcelColumnName()}{row}*{(col+3).GetExcelColumnName()}{row}");

                    row++;
                }

                worksheet.Cells(start, col)
                    .Value(income.Name)
                    .BackgroundColor(Color.FromArgb(231, 246, 251))
                    .Height(30);

                if (elements.Count > 1)
                    worksheet.Cells(start + 1, col, elements.Count - 2, 0)
                    .Merge()
                    .BackgroundColor(Color.FromArgb(231, 246, 251));

                worksheet.Cells(row, col, 0, 2)
                    .Merge()
                    .Value("Sub Total")
                    .BorderTop(ExcelBorderStyle.Thin, Color.FromArgb(0, 140, 180))
                    .FontColor(Color.FromArgb(0, 140, 180))
                    .Height(30);

                var subT = (col + 4).GetExcelColumnName();
                worksheet.Cells(row, col + 3)
                    .Formula($"SUM({subT}{start}:{subT}{start+elements.Count})")
                    .BorderTop(ExcelBorderStyle.Thin, Color.FromArgb(0, 140, 180))
                    .FontColor(Color.FromArgb(0, 140, 180));

                row++;
            }

            worksheet.Cells(row, col, 0, 2)
                .Merge()
                .Value("Total")
                .Bold().FontColor(Color.FromArgb(0, 140, 180))
                .BorderTop(ExcelBorderStyle.Medium, Color.FromArgb(0, 140, 180))
                .Height(30);

            var colname = (col + 4).GetExcelColumnName();
            worksheet.Cells(row, col + 3)
                .Formula($"SUM({colname}:{colname})")
                .Bold().FontColor(Color.FromArgb(0, 140, 180))
                .BorderTop(ExcelBorderStyle.Medium, Color.FromArgb(0, 140, 180));

            row++;

            return (row, col + 4);
        }

        private(int row, int col) DoRevenue(ExcelWorksheet worksheet, int row, int col, string name, IEnumerable<Unit<DatedValue>> values) {

            var nameElement = worksheet.Cells(row, col, 0, 3)
                .Merge()
                .Value(name);

            row++;

            worksheet.Cells(row, col, 0, 3)
                .Bold().FontSize(11).FontColor(Color.White)
                .BackgroundColor(Color.FromArgb(0, 140, 180))
                .Height(30);

            worksheet.Cells(row, col)
                .Column(x => {
                    x.Style.HorizontalAlignment = ExcelHorizontalAlignment.Left;
                    x.Style.Indent = 1;
                })
                .Width(20);

            worksheet.Cells(row, col + 1)
                .Value("Name")
                .Column(x => {
                    x.Style.HorizontalAlignment = ExcelHorizontalAlignment.Left;
                    x.Style.Indent = 1;
                })
                .Width(30);

            worksheet.Cells(row, col + 2)
                .Value("Year")
                .Column(x => {
                    x.Style.Numberformat.Format = "0";
                    x.Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                    x.Style.Indent = 1;
                })
                .Width(15);

            worksheet.Cells(row, col + 3)
                .Value("Amount")
                .Column(x => {
                    x.Style.Numberformat.Format = "#,###.00";
                    x.Style.HorizontalAlignment = ExcelHorizontalAlignment.Right;
                    x.Style.Indent = 1;
                })
                .Width(12);
            worksheet.Column(col + 4).Hidden = true;
            row++;

            nameElement.Center().FontSize(20).Height(40);

            foreach (var income in values) {
                var start = row;
                var i = 0;
                var elements = income.Elements.ToList();
                elements.AddRange(new [] { new DatedValue { }, new DatedValue { } });

                foreach (var e in elements) {
                    i++;
                    worksheet.Cells(row, col + 1, 0, 3)
                        .Height(30)
                        .BackgroundColor(i % 2 == 1 ? Color.FromArgb(239, 239, 239) : Color.White);

                    worksheet.Cells(row, col + 1).Value(e.Name);
                    if (e.Year != 0)
                        worksheet.Cells(row, col + 2).Value(e.Year);
                    if (e.Value != 0)
                        worksheet.Cells(row, col + 3).Value(e.Value);
                    worksheet.Cells(row, col + 4).Formula($"{(col+3).GetExcelColumnName()}{row}");

                    row++;
                }

                worksheet.Cells(start, col)
                    .Value(income.Name)
                    .BackgroundColor(Color.FromArgb(231, 246, 251))
                    .Height(30);

                if (elements.Count > 1)
                    worksheet.Cells(start + 1, col, elements.Count - 2, 0)
                    .Merge()
                    .BackgroundColor(Color.FromArgb(231, 246, 251));

                worksheet.Cells(row, col, 0, 2)
                    .Merge()
                    .Value("Sub Total")
                    .BorderTop(ExcelBorderStyle.Thin, Color.FromArgb(0, 140, 180))
                    .FontColor(Color.FromArgb(0, 140, 180))
                    .Height(30);

                var subT = (col + 4).GetExcelColumnName();
                worksheet.Cells(row, col + 3)
                    .Formula($"SUM({subT}{start}:{subT}{start+elements.Count})")
                    .BorderTop(ExcelBorderStyle.Thin, Color.FromArgb(0, 140, 180))
                    .FontColor(Color.FromArgb(0, 140, 180));

                row++;
            }

            worksheet.Cells(row, col, 0, 2)
                .Merge()
                .Value("Total")
                .Bold().FontColor(Color.FromArgb(0, 140, 180))
                .BorderTop(ExcelBorderStyle.Medium, Color.FromArgb(0, 140, 180))
                .Height(30);

            var colname = (col + 4).GetExcelColumnName();
            worksheet.Cells(row, col + 3)
                .Formula($"SUM({colname}:{colname})")
                .Bold().FontColor(Color.FromArgb(0, 140, 180))
                .BorderTop(ExcelBorderStyle.Medium, Color.FromArgb(0, 140, 180));

            row++;

            return (row, col + 4);
        }

        private(int row, int col) DoAssets(ExcelWorksheet worksheet, int row, int col, string name, IEnumerable<Unit<NamedValue>> values) {

            var nameElement = worksheet.Cells(row, col, 0, 3)
                .Merge()
                .Value(name);

            row++;

            worksheet.Cells(row, col, 0, 3)
                .Bold().FontSize(11).FontColor(Color.White)
                .BackgroundColor(Color.FromArgb(0, 140, 180))
                .Height(30);

            worksheet.Cells(row, col)
                .Column(x => {
                    x.Style.HorizontalAlignment = ExcelHorizontalAlignment.Left;
                    x.Style.Indent = 1;
                })
                .Width(20);

            worksheet.Cells(row, col + 1, 0, 1)
                .Value("Name")
                .Column(x => {
                    x.Style.HorizontalAlignment = ExcelHorizontalAlignment.Left;
                    x.Style.Indent = 1;
                })
                .Merge()
                .Width(30);

            worksheet.Cells(row, col + 3)
                .Value("Amount")
                .Column(x => {
                    x.Style.Numberformat.Format = "#,###.00";
                    x.Style.HorizontalAlignment = ExcelHorizontalAlignment.Right;
                    x.Style.Indent = 1;
                })
                .Width(12);
            worksheet.Column(col + 4).Hidden = true;
            row++;

            nameElement.Center().FontSize(20).Height(40);

            foreach (var income in values) {
                var start = row;
                var i = 0;
                var elements = income.Elements.ToList();
                elements.AddRange(new [] { new NamedValue { }, new NamedValue { } });

                foreach (var e in elements) {
                    i++;
                    worksheet.Cells(row, col + 1, 0, 3)
                        .Height(30)
                        .BackgroundColor(i % 2 == 1 ? Color.FromArgb(239, 239, 239) : Color.White);

                    worksheet.Cells(row, col + 1, 0, 1).Merge().Value(e.Name);

                    if (e.Value != 0)
                        worksheet.Cells(row, col + 3).Value(e.Value);
                    worksheet.Cells(row, col + 4).Formula($"{(col+3).GetExcelColumnName()}{row}");

                    row++;
                }

                worksheet.Cells(start, col)
                    .Value(income.Name)
                    .BackgroundColor(Color.FromArgb(231, 246, 251))
                    .Height(30);

                if (elements.Count > 1)
                    worksheet.Cells(start + 1, col, elements.Count - 2, 0)
                    .Merge()
                    .BackgroundColor(Color.FromArgb(231, 246, 251));

                worksheet.Cells(row, col, 0, 2)
                    .Merge()
                    .Value("Sub Total")
                    .BorderTop(ExcelBorderStyle.Thin, Color.FromArgb(0, 140, 180))
                    .FontColor(Color.FromArgb(0, 140, 180))
                    .Height(30);

                var subT = (col + 4).GetExcelColumnName();
                worksheet.Cells(row, col + 3)
                    .Formula($"SUM({subT}{start}:{subT}{start+elements.Count})")
                    .BorderTop(ExcelBorderStyle.Thin, Color.FromArgb(0, 140, 180))
                    .FontColor(Color.FromArgb(0, 140, 180));

                row++;
            }

            worksheet.Cells(row, col, 0, 2)
                .Merge()
                .Value("Total")
                .Bold().FontColor(Color.FromArgb(0, 140, 180))
                .BorderTop(ExcelBorderStyle.Medium, Color.FromArgb(0, 140, 180))
                .Height(30);

            var colname = (col + 4).GetExcelColumnName();
            worksheet.Cells(row, col + 3)
                .Formula($"SUM({colname}:{colname})")
                .Bold().FontColor(Color.FromArgb(0, 140, 180))
                .BorderTop(ExcelBorderStyle.Medium, Color.FromArgb(0, 140, 180));

            row++;

            return (row, col + 4);
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
                    ExcelWorksheet worksheet = package.Workbook.Worksheets.Add($"Budget: {budget.Name}");

                    var (rI, cI) = this.DoBudget(worksheet, 2, 2, "Income", budget.Data.Positive);
                    var (rE, cE) = this.DoBudget(worksheet, 2, cI + 2, "Expenses", budget.Data.Negative);

                    worksheet.Cells(1, 1, 0, cE)
                        .Merge()
                        .Value(budget.Name)
                        .FontColor(Color.FromArgb(0, 140, 180))
                        .FontSize(40)
                        .Left(3)
                        .Height(60);

                    worksheet.Cells(1, 1, Math.Max(rI, rE), cE)
                        .Style(x => x.Font.Name = "URW Gothic");
                }

                var revenue = await this.tableStore.GetAsync(new Revenue { UserId = this.UserId });
                if (revenue?.Data != null) {
                    ExcelWorksheet worksheet = package.Workbook.Worksheets.Add("Revenue");

                    var (rI, cI) = this.DoRevenue(worksheet, 2, 2, "Planned income", revenue.Data.Positive);
                    var (rE, cE) = this.DoRevenue(worksheet, 2, cI + 2, "Planned expenses", revenue.Data.Negative);

                    worksheet.Cells(1, 1, 0, cE)
                        .Merge()
                        .Value("Revenue")
                        .FontColor(Color.FromArgb(0, 140, 180))
                        .FontSize(40)
                        .Left(3)
                        .Height(60);

                    worksheet.Cells(1, 1, Math.Max(rI, rE), cE)
                        .Style(x => x.Font.Name = "URW Gothic");
                }

                var assets = await this.tableStore.GetAsync(new Asset { UserId = this.UserId });
                if (assets?.Data != null) {
                    ExcelWorksheet worksheet = package.Workbook.Worksheets.Add("Assets");

                    var (rI, cI) = this.DoAssets(worksheet, 2, 2, "Assets", assets.Data.Positive);
                    var (rE, cE) = this.DoAssets(worksheet, 2, cI + 2, "Debts", assets.Data.Negative);

                    worksheet.Cells(1, 1, 0, cE)
                        .Merge()
                        .Value("Assets")
                        .FontColor(Color.FromArgb(0, 140, 180))
                        .FontSize(40)
                        .Left(3)
                        .Height(60);

                    worksheet.Cells(1, 1, Math.Max(rI, rE), cE)
                        .Style(x => x.Font.Name = "URW Gothic");
                }

                package.Save(); //Save the workbook.
            }
            return URL;
        }

        private string UserId { get => this.userManager.GetUserId(this.User); }

    }
}