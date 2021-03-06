using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Threading.Tasks;
using OfficeOpenXml;
using OfficeOpenXml.Style;

namespace BudgetPlanner.Middleware
{

    public class ExcelCell
    {
        public int Row { get; set; }
        public int Rows { get; set; }
        public int Col { get; set; }
        public int Cols { get; set; }
        public ExcelWorksheet Worksheet { get; set; }
    }

    public static class Extensions
    {
        public static TValue GetOrAdd<TKey, TValue>(this Dictionary<TKey, TValue> dict, TKey key, Func<TValue> addValue)
        {
            if (dict.TryGetValue(key, out var t) && t != null)
                return t;
            var val = addValue();
            try
            {
                dict[key] = val;
            }
            catch
            {
                dict[key] = val;
            }
            return val;
        }

        public static async Task<TValue> GetOrAddAsync<TKey, TValue>(this Dictionary<TKey, TValue> dict, TKey key, Func<Task<TValue>> addValue)
        {
            if (dict.TryGetValue(key, out var t) && t != null)
                return t;
            var val = await addValue();
            try
            {
                dict[key] = val;
            }
            catch
            {
                dict[key] = val;
            }
            return val;
        }

        public static bool TryGetValue<TValue>(this Dictionary<string, TValue> dict, string key, out TValue value, StringComparison comparison)
        {
            if (dict.TryGetValue(key, out value))
                return true;
            key = dict.Keys.FirstOrDefault(t => string.Equals(t, key, comparison));
            if (key == null)
                return false;
            if (dict.TryGetValue(key, out value))
                return true;
            return false;
        }

        public static T GetCustomAttribute<T>(this System.Type type)
        {
            var attrs = type.GetCustomAttributes(typeof(T), true);
            if (attrs?.Length != 1)
                return default(T);
            return (T)attrs.FirstOrDefault();
        }

        public static bool HasCustomAttribute<T>(this System.Type type)
        {
            var attrs = type.GetCustomAttributes(typeof(T), true);
            return attrs?.Length > 0;
        }
        public static T GetCustomAttribute<T>(this System.Reflection.PropertyInfo property)
        {
            var attrs = property.GetCustomAttributes(typeof(T), true);
            if (attrs?.Length != 1)
                return default(T);
            return (T)attrs.FirstOrDefault();
        }

        public static bool HasCustomAttribute<T>(this System.Reflection.PropertyInfo property)
        {
            var attrs = property.GetCustomAttributes(typeof(T), true);
            return attrs?.Length > 0;
        }

        public static object DefaultValue(this Type t)
        {
            if (t.IsValueType)
                return Activator.CreateInstance(t);

            return null;
        }

        public static string GetExcelColumnName(this int columnNumber)
        {
            int dividend = columnNumber;
            string columnName = string.Empty;
            int modulo;

            while (dividend > 0)
            {
                modulo = (dividend - 1) % 26;
                columnName = Convert.ToChar(65 + modulo).ToString() + columnName;
                dividend = (int)((dividend - modulo) / 26);
            }

            return columnName;
        }

        public static ExcelRangeBase Cells(this ExcelCell cell)
        {
            return cell.Worksheet.Cells[cell.Row, cell.Col, cell.Row + cell.Rows, cell.Col + cell.Cols];
        }
        public static ExcelCell Cells(this ExcelWorksheet @this, int row, int col, int rows = 0, int cols = 0)
        {

            var cell = new ExcelCell
            {
                Row = row,
                Col = col,
                Rows = rows,
                Cols = cols,
                Worksheet = @this
            };

            cell.Worksheet.Cells[cell.Row, cell.Col, cell.Row + cell.Rows, cell.Col + cell.Cols].Style.VerticalAlignment = ExcelVerticalAlignment.Center;
            return cell;
        }

        public static ExcelCell Height(this ExcelCell @this, int value)
        {
            @this.Worksheet.Row(@this.Row).Height = value;
            return @this;
        }

        public static ExcelCell Column(this ExcelCell @this, Action<ExcelColumn> action)
        {
            action(@this.Worksheet.Column(@this.Col));
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
            @this.Worksheet.Cells[@this.Row, @this.Col, @this.Row + @this.Rows, @this.Col + @this.Cols].Merge = true;
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

        public static ExcelCell FontColor(this ExcelCell @this, int r, int g, int b)
        {
            @this.Cells().Style.Font.Color.SetColor(Color.FromArgb(r, g, b));
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

        public static ExcelCell BackgroundColor(this ExcelCell @this, int r, int g, int b)
        {
            @this.Cells().Style.Fill.PatternType = ExcelFillStyle.Solid;
            @this.Cells().Style.Fill.BackgroundColor.SetColor(Color.FromArgb(r, g, b));
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

        public static int LevenshteinDistance(this string from, string to)
        {
            var fromStringLength = from?.Length ?? 0;
            var toStringLength = to?.Length ?? 0;

            if (fromStringLength == 0)
                return toStringLength;

            if (toStringLength == 0)
                return fromStringLength;

            var distanceMatrix = new int[fromStringLength + 1, toStringLength + 1];

            for (var x = 0; x <= fromStringLength; distanceMatrix[x, 0] = x++) ;
            for (var x = 0; x <= toStringLength; distanceMatrix[0, x] = x++) ;

            for (var col = 1; col <= fromStringLength; col++)
            {
                for (var row = 1; row <= toStringLength; row++)
                {
                    var cost = (to[row - 1] == from[col - 1]) ? 0 : 1;
                    distanceMatrix[col, row] = Math.Min(
                        Math.Min(distanceMatrix[col - 1, row] + 1, distanceMatrix[col, row - 1] + 1),
                        distanceMatrix[col - 1, row - 1] + cost);
                }
            }
            return distanceMatrix[fromStringLength, toStringLength];
        }

        public static Conditional<T> If<T>(this T @this, bool condition) => new Conditional<T>(@this, condition);
        public class Conditional<T>
        {
            private readonly T t;
            private readonly bool condition;
            internal Conditional(T t, bool condition)
            {
                this.t = t;
                this.condition = condition;
            }

            public ConditionalThen Then(Func<T, T> action) => new ConditionalThen(this.t, this.condition, action);

            public class ConditionalThen
            {
                private readonly T t;
                private readonly bool condition;
                private readonly Func<T, T> then;
                internal ConditionalThen(T t, bool condition, Func<T, T> then)
                {
                    this.t = t;
                    this.condition = condition;
                    this.then = then;
                }

                public T Else(Func<T, T> action) => (condition ? this.then : action)(this.t);
            }
        }
    }
}