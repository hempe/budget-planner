using System;
using System.Drawing;
using OfficeOpenXml;
using OfficeOpenXml.Style;

namespace BudgetPlanner.Middleware {

        public class ExcelCell {
            public int Row { get; set; }
            public int Rows { get; set; }
            public int Col { get; set; }
            public int Cols { get; set; }
            public ExcelWorksheet Worksheet { get; set; }
        }

        public static class Extensions {
            public static string GetExcelColumnName(this int columnNumber) {
                int dividend = columnNumber;
                string columnName = string.Empty;
                int modulo;

                while (dividend > 0) {
                    modulo = (dividend - 1) % 26;
                    columnName = Convert.ToChar(65 + modulo).ToString() + columnName;
                    dividend = (int) ((dividend - modulo) / 26);
                }

                return columnName;
            }

            public static ExcelRangeBase Cells(this ExcelCell cell) {
                return cell.Worksheet.Cells[cell.Row, cell.Col, cell.Row + cell.Rows, cell.Col + cell.Cols];
            }
            public static ExcelCell Cells(this ExcelWorksheet @this, int row, int col, int rows = 0, int cols = 0){
                
                var cell = new  ExcelCell {
                Row = row,
                Col = col,
                Rows = rows,
                Cols = cols,
                Worksheet = @this           
                };

                cell.Worksheet.Cells[cell.Row, cell.Col, cell.Row+cell.Rows, cell.Col+cell.Cols].Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                return cell;
            }

            public static ExcelCell Height(this ExcelCell @this, int value) 
            {
                @this.Worksheet.Row(@this.Row).Height = value;
                return @this;
            }

            public static ExcelCell Width(this ExcelCell @this, int value) 
            {
                @this.Worksheet.Column(@this.Col).Width = value;
                return @this;
            }

            public static ExcelCell Set(this ExcelCell @this, Action<ExcelRangeBase> action) 
            {
                action(@this.Cells());
                return @this;
            }

            public static ExcelCell Value(this ExcelCell @this, object value) 
            {
                @this.Cells().Value = value;
                return @this;
            }

            public static ExcelCell Formula(this ExcelCell @this, string value) 
            {
                @this.Cells().Formula = value;
                return @this;
            }

            public static ExcelCell Merge(this ExcelCell @this) 
            {
                @this.Worksheet.Cells[@this.Row, @this.Col, @this.Row+@this.Rows,@this.Col+@this.Cols].Merge = true;
                return @this;
            }

            public static ExcelCell Numberformat(this ExcelCell @this, string format) 
            {
                @this.Cells().Style.Numberformat.Format = format;
                return @this;
            }
            
            public static ExcelCell Style(this ExcelCell @this, Action<ExcelStyle> action) 
            {
                action(@this.Cells().Style);
                return @this;
            }
            
            public static ExcelCell BorderTop(this ExcelCell @this, ExcelBorderStyle style, Color color) 
            {
                @this.Cells().Style.Border.Top.Style = style;
                @this.Cells().Style.Border.Top.Color.SetColor(color);
                return @this;
            }

            public static ExcelCell FontColor(this ExcelCell @this, Color color) 
            {
                @this.Cells().Style.Font.Color.SetColor(color);
                return @this;
            }

            public static ExcelCell Bold(this ExcelCell @this) 
            {
                @this.Cells().Style.Font.Bold = true;
                return @this;
            }

            public static ExcelCell FontSize(this ExcelCell @this, int value) 
            {
                @this.Cells().Style.Font.Size = value;
                return @this;
            }

            public static ExcelCell BackgroundColor(this ExcelCell @this, Color color) 
            {
                @this.Cells().Style.Fill.PatternType = ExcelFillStyle.Solid; 
                @this.Cells().Style.Fill.BackgroundColor.SetColor(color);
                return @this;
            }
            public static ExcelCell Left(this ExcelCell @this, int indent) 
            {
                @this.Cells().Style.Indent = indent;                
                @this.Cells().Style.HorizontalAlignment = ExcelHorizontalAlignment.Left;
                
                return @this;
            }

            public static ExcelCell Center(this ExcelCell @this) 
            {
                @this.Cells().Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                return @this;
            }

            public static ExcelCell Right(this ExcelCell @this, int indent)
            {
                @this.Cells().Style.Indent = indent;
                @this.Cells().Style.HorizontalAlignment = ExcelHorizontalAlignment.Right;
                return @this;
            }


            public static ExcelRow Set(this ExcelRow @this, Action<ExcelRow> action) 
            {
                action(@this);
                return @this;
            }
    }
}