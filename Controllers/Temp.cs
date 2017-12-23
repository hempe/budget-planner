namespace BudgetPlanner.Controllers {
    public class Temp {
        /*
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
         */
        /*
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
        */

        /*
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
                 */

    }
}