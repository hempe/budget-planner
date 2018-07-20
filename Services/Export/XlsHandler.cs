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

namespace BudgetPlanner.Services.Export {
        public class XlsHandler : IDisposable {

            private readonly ExcelPackage package;
            private readonly BaseHandler baseHandler;
            private string lang;
            public XlsHandler(BaseHandler baseHandler) {
                this.baseHandler = baseHandler;

                this.package = new ExcelPackage();
            }

            public void Dispose() {
                this.package.Dispose();
            }

            private string Translate(string key) {
                return this.baseHandler.I18n.TranslateAsync(this.lang, key).GetAwaiter().GetResult();
            }

            public async Task<Stream> GetExportAsync(string userId) {
                var export = await this.baseHandler.GetJsonAsync(userId);
                this.lang = export?.Client?.Language;

                foreach (var budget in export.Budgets) {
                    ExcelWorksheet worksheet = package.Workbook.Worksheets.Add($"Budget: {budget.Name}");

                    var (rI, cI) = this.DoBudget(worksheet, 2, 2, Translate("Income"), budget.Positive);
                    var (rE, cE) = this.DoBudget(worksheet, 2, cI + 2, Translate("Expenses"), budget.Negative);

                    worksheet.Cells(1, 1, 0, cE)
                        .Merge()
                        .Value(budget.Name)
                        .FontColor(0, 140, 180)
                        .FontSize(40)
                        .Left(3)
                        .Height(60);

                    worksheet.Cells(1, 1, Math.Max(rI, rE), cE)
                        .Style(x => x.Font.Name = "URW Gothic");
                }

                if (export.Revenue != null) {
                    ExcelWorksheet worksheet = package.Workbook.Worksheets.Add(Translate("Revenue"));

                    var (rI, cI) = this.DoRevenue(worksheet, 2, 2, Translate("PlannedRevenue"), export.Revenue.Positive);
                    var (rE, cE) = this.DoRevenue(worksheet, 2, cI + 2, Translate("PlannedExpenses"), export.Revenue.Negative);

                    worksheet.Cells(1, 1, 0, cE)
                        .Merge()
                        .Value(Translate("Revenue"))
                        .FontColor(0, 140, 180)
                        .FontSize(40)
                        .Left(3)
                        .Height(60);

                    worksheet.Cells(1, 1, Math.Max(rI, rE), cE)
                        .Style(x => x.Font.Name = "URW Gothic");
                }

                if (export.Assets != null) {
                    ExcelWorksheet worksheet = package.Workbook.Worksheets.Add(Translate("Assets"));

                    var (rI, cI) = this.DoAssets(worksheet, 2, 2, Translate("Assets"), export.Assets.Positive);
                    var (rE, cE) = this.DoAssets(worksheet, 2, cI + 2, Translate("Debts"), export.Assets.Negative);

                    worksheet.Cells(1, 1, 0, cE)
                        .Merge()
                        .Value(Translate("Assets"))
                        .FontColor(0, 140, 180)
                        .FontSize(40)
                        .Left(3)
                        .Height(60);

                    worksheet.Cells(1, 1, Math.Max(rI, rE), cE)
                        .Style(x => x.Font.Name = "URW Gothic");
                }

                return new MemoryStream(package.GetAsByteArray());
            }

            private(int row, int col) DoBudget(ExcelWorksheet worksheet, int row, int col, string name, IEnumerable<Unit<FrequencyValue>> values) {

                var nameElement = worksheet.Cells(row, col, 0, 3)
                    .Merge()
                    .Value(name);

                row++;

                worksheet.Cells(row, col, 0, 3)
                    .Bold().FontSize(11).FontColor(255, 255, 255)
                    .BackgroundColor(0, 140, 180)
                    .Height(30);

                worksheet.Cells(row, col)
                    .Column(x => {
                        x.Style.HorizontalAlignment = ExcelHorizontalAlignment.Left;
                        x.Style.Indent = 1;
                    })
                    .Width(20);

                worksheet.Cells(row, col + 1)
                    .Value(Translate("Name"))
                    .Column(x => {
                        x.Style.HorizontalAlignment = ExcelHorizontalAlignment.Left;
                        x.Style.Indent = 1;
                    })
                    .Width(30);

                worksheet.Cells(row, col + 2)
                    .Value(Translate("frequency.frequency"))
                    .Column(x => {
                        x.Style.Numberformat.Format = "0";
                        x.Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                        x.Style.Indent = 1;
                    })
                    .Width(15);

                worksheet.Cells(row, col + 3)
                    .Value(Translate("Amount"))
                    .Column(x => {
                        x.Style.Numberformat.Format = "#,###.00";
                        x.Style.HorizontalAlignment = ExcelHorizontalAlignment.Right;
                        x.Style.Indent = 1;
                    })
                    .Width(15);
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
                            .If(i % 2 == 1)
                            .Then(x => x.BackgroundColor(239, 239, 239))
                            .Else(x => x.BackgroundColor(255, 255, 255));

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
                        .BackgroundColor(231, 246, 251)
                        .Height(30);

                    if (elements.Count > 1)
                        worksheet.Cells(start + 1, col, elements.Count - 2, 0)
                        .Merge()
                        .BackgroundColor(231, 246, 251);

                    worksheet.Cells(row, col, 0, 2)
                        .Merge()
                        .Value(Translate("Subtotal"))
                        .BorderTop(ExcelBorderStyle.Thin, Color.FromArgb(0, 140, 180))
                        .FontColor(0, 140, 180)
                        .Height(30);

                    var subT = (col + 4).GetExcelColumnName();
                    worksheet.Cells(row, col + 3)
                        .Formula($"SUM({subT}{start}:{subT}{start+elements.Count})")
                        .BorderTop(ExcelBorderStyle.Thin, Color.FromArgb(0, 140, 180))
                        .FontColor(0, 140, 180);

                    row++;
                }

                worksheet.Cells(row, col, 0, 2)
                    .Merge()
                    .Value(Translate("Total"))
                    .Bold().FontColor(0, 140, 180)
                    .BorderTop(ExcelBorderStyle.Medium, Color.FromArgb(0, 140, 180))
                    .Height(30);

                var colname = (col + 4).GetExcelColumnName();
                worksheet.Cells(row, col + 3)
                    .Formula($"SUM({colname}:{colname})")
                    .Bold().FontColor(0, 140, 180)
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
                    .Bold().FontSize(11).FontColor(255, 255, 255)
                    .BackgroundColor(0, 140, 180)
                    .Height(30);

                worksheet.Cells(row, col)
                    .Column(x => {
                        x.Style.HorizontalAlignment = ExcelHorizontalAlignment.Left;
                        x.Style.Indent = 1;
                    })
                    .Width(20);

                worksheet.Cells(row, col + 1)
                    .Value(Translate("Name"))
                    .Column(x => {
                        x.Style.HorizontalAlignment = ExcelHorizontalAlignment.Left;
                        x.Style.Indent = 1;
                    })
                    .Width(30);

                worksheet.Cells(row, col + 2)
                    .Value(Translate("Year"))
                    .Column(x => {
                        x.Style.Numberformat.Format = "0";
                        x.Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                        x.Style.Indent = 1;
                    })
                    .Width(15);

                worksheet.Cells(row, col + 3)
                    .Value(Translate("Amount"))
                    .Column(x => {
                        x.Style.Numberformat.Format = "#,###.00";
                        x.Style.HorizontalAlignment = ExcelHorizontalAlignment.Right;
                        x.Style.Indent = 1;
                    })
                    .Width(15);
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
                            .If(i % 2 == 1)
                            .Then(x => x.BackgroundColor(239, 239, 239))
                            .Else(x => x.BackgroundColor(255, 255, 255));

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
                        .BackgroundColor(231, 246, 251)
                        .Height(30);

                    if (elements.Count > 1)
                        worksheet.Cells(start + 1, col, elements.Count - 2, 0)
                        .Merge()
                        .BackgroundColor(231, 246, 251);

                    worksheet.Cells(row, col, 0, 2)
                        .Merge()
                        .Value(Translate("Subtotal"))
                        .BorderTop(ExcelBorderStyle.Thin, Color.FromArgb(0, 140, 180))
                        .FontColor(0, 140, 180)
                        .Height(30);

                    var subT = (col + 4).GetExcelColumnName();
                    worksheet.Cells(row, col + 3)
                        .Formula($"SUM({subT}{start}:{subT}{start+elements.Count})")
                        .BorderTop(ExcelBorderStyle.Thin, Color.FromArgb(0, 140, 180))
                        .FontColor(0, 140, 180);

                    row++;
                }

                worksheet.Cells(row, col, 0, 2)
                    .Merge()
                    .Value(Translate("Total"))
                    .Bold().FontColor(0, 140, 180)
                    .BorderTop(ExcelBorderStyle.Medium, Color.FromArgb(0, 140, 180))
                    .Height(30);

                var colname = (col + 4).GetExcelColumnName();
                worksheet.Cells(row, col + 3)
                    .Formula($"SUM({colname}:{colname})")
                    .Bold().FontColor(0, 140, 180)
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
                    .Bold().FontSize(11).FontColor(255, 255, 255)
                    .BackgroundColor(0, 140, 180)
                    .Height(30);

                worksheet.Cells(row, col)
                    .Column(x => {
                        x.Style.HorizontalAlignment = ExcelHorizontalAlignment.Left;
                        x.Style.Indent = 1;
                    })
                    .Width(20);

                worksheet.Cells(row, col + 1, 0, 1)
                    .Value(Translate("Name"))
                    .Column(x => {
                        x.Style.HorizontalAlignment = ExcelHorizontalAlignment.Left;
                        x.Style.Indent = 1;
                    })
                    .Merge()
                    .Width(30);

                worksheet.Cells(row, col + 3)
                    .Value(Translate("Amount"))
                    .Column(x => {
                        x.Style.Numberformat.Format = "#,###.00";
                        x.Style.HorizontalAlignment = ExcelHorizontalAlignment.Right;
                        x.Style.Indent = 1;
                    })
                    .Width(15);
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
                            .If(i % 2 == 1)
                            .Then(x => x.BackgroundColor(239, 239, 239))
                            .Else(x => x.BackgroundColor(255, 255, 255));

                        worksheet.Cells(row, col + 1, 0, 1).Merge().Value(e.Name);

                        if (e.Value != 0)
                            worksheet.Cells(row, col + 3).Value(e.Value);
                        worksheet.Cells(row, col + 4).Formula($"{(col+3).GetExcelColumnName()}{row}");

                        row++;
                    }

                    worksheet.Cells(start, col)
                        .Value(income.Name)
                        .BackgroundColor(231, 246, 251)
                        .Height(30);

                    if (elements.Count > 1)
                        worksheet.Cells(start + 1, col, elements.Count - 2, 0)
                        .Merge()
                        .BackgroundColor(231, 246, 251);

                    worksheet.Cells(row, col, 0, 2)
                        .Merge()
                        .Value(Translate("Subtotal"))
                        .BorderTop(ExcelBorderStyle.Thin, Color.FromArgb(0, 140, 180))
                        .FontColor(0, 140, 180)
                        .Height(30);

                    var subT = (col + 4).GetExcelColumnName();
                    worksheet.Cells(row, col + 3)
                        .Formula($"SUM({subT}{start}:{subT}{start+elements.Count})")
                        .BorderTop(ExcelBorderStyle.Thin, Color.FromArgb(0, 140, 180))
                        .FontColor(0, 140, 180);

                    row++;
                }

                worksheet.Cells(row, col, 0, 2)
                    .Merge()
                    .Value(Translate("Total"))
                    .Bold().FontColor(0, 140, 180)
                    .BorderTop(ExcelBorderStyle.Medium, Color.FromArgb(0, 140, 180))
                    .Height((30);

                        var colname = (col + 4).GetExcelColumnName(); worksheet.Cells(row, col + 3)
                        .Formula($"SUM({colname}:{colname})")
                        .Bold().FontColor(0, 140, 180)
                        .BorderTop(ExcelBorderStyle.Medium, Color.FromArgb(0, 140, 180));

                        row++;

                        return (row, col + 4);
                    }
            }
        }