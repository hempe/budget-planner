using System;
using OfficeOpenXml;

namespace BudgetPlanner.Middleware {
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

            public static ExcelRangeBase Set(this ExcelRangeBase @this, Action<ExcelRangeBase> action) 
            {
                action(@this);
                return @this;
            }
            public static ExcelRow Set(this ExcelRow @this, Action<ExcelRow> action) 
            {
                action(@this);
                return @this;
            }
            
            public static ExcelColumn Set(this ExcelColumn @this, Action<ExcelColumn> action) 
            {
                action(@this);
                return @this;
            }
    }
}