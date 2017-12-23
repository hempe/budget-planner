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

            worksheet.Cells(row, col, 0, 3)
                .Merge()
                .Value(name)
                .Center().FontSize(20)
                .Height(40);

            row++;

            worksheet.Cells(row, col, 0, 3)
                .Left(1).Bold().FontSize(11).FontColor(Color.White)
                .BackgroundColor(Color.FromArgb(0, 140, 180))
                .Height(30).Width(20);

            worksheet.Cells(row, col + 1)
                .Value("Name")
                .Width(30);

            worksheet.Cells(row, col + 2)
                .Value("Frequency")
                .Width(15);

            worksheet.Cells(row, col + 3)
                .Value("Amount")
                .Width(12);

            worksheet.Column(col + 4).Hidden = true;
            row++;

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

                    worksheet.Cells(row, col + 1).Value(e.Name).Left(1);
                    worksheet.Cells(row, col + 2).Value(e.Frequency).Right(1).Numberformat("0");
                    worksheet.Cells(row, col + 3).Value(e.Value).Right(1).Numberformat("#,###.00");
                    worksheet.Cells(row, col + 4).Formula($"{(col+2).GetExcelColumnName()}{row}*{(col+3).GetExcelColumnName()}{row}");

                    row++;
                }

                worksheet.Cells(start, col)
                    .Value(income.Name)
                    .Left(1)
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
                    .Left(1)
                    .Height(30);

                var subT = (col + 4).GetExcelColumnName();
                worksheet.Cells(row, col + 3)
                    .Formula($"SUM({subT}{start}:{subT}{start+elements.Count})")
                    .Numberformat("#,###.00")
                    .BorderTop(ExcelBorderStyle.Thin, Color.FromArgb(0, 140, 180))
                    .FontColor(Color.FromArgb(0, 140, 180))
                    .Right(1);

                row++;
            }

            worksheet.Cells(row, col, 0, 2)
                .Merge()
                .Value("Total")
                .Left(1).Bold().FontColor(Color.FromArgb(0, 140, 180))
                .BorderTop(ExcelBorderStyle.Medium, Color.FromArgb(0, 140, 180))
                .Height(30);

            var colname = (col + 4).GetExcelColumnName();
            worksheet.Cells(row, col + 3)
                .Formula($"SUM({colname}:{colname})")
                .Numberformat("#,###.00")
                .Right(1).Bold().FontColor(Color.FromArgb(0, 140, 180))
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
                    ExcelWorksheet worksheet = package.Workbook.Worksheets.Add($"Budget {budget.Name}");

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

                package.Save(); //Save the workbook.
            }
            return URL;
        }

        private string UserId { get => this.userManager.GetUserId(this.User); }

    }
}