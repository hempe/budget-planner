using System;
using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json;

namespace BudgetPlanner.Models {

    public class Group<T> : ISum where T : ISum, new() {
        public Unit<T>[] Positive { get; set; } = new [] { new Unit<T>() };
        public Unit<T>[] Negative { get; set; } = new [] { new Unit<T>() };

        [JsonIgnore]
        public decimal Sum {
            get {

                var positive = this.Positive?.Select(x => x.Sum).Sum();
                var negative = this.Negative?.Select(x => x.Sum).Sum();
                var value = positive - negative;
                return value ?? 0;
            }
        }
    }

    public static class GroupExtensions {
        public static OverviewValue ToOverview<T>(this Group<T> value, Func<T, decimal> valueSelector, string id, string name) where T : NamedValue, new() {
            var overview = new OverviewValue {
                Id = string.IsNullOrWhiteSpace(id) ? "0" : id,
                Name = string.IsNullOrWhiteSpace(name) ? typeof(T).Name : name,
                Negative = value?.Negative?.ToOverview(valueSelector).ToArray() ?? new OverviewContainer[0],
                Positive = value?.Positive?.ToOverview(valueSelector).ToArray() ?? new OverviewContainer[0],
            };

            overview.Value = overview.Positive.Sum(x => x.Value) - overview.Negative.Sum(x => x.Value);
            return overview;
        }

        private static List<OverviewContainer> ToOverview<T>(this IEnumerable<Unit<T>> x, Func<T, decimal> valueSelector) where T : NamedValue, new() {
            return x?.Select(y => y.ToOverview(valueSelector)).ToList() ?? new List<OverviewContainer>();
        }

        private static OverviewContainer ToOverview<T>(this Unit<T> x, Func<T, decimal> valueSelector) where T : NamedValue, new() {
            return new OverviewContainer {
                Name = x.Name,
                    Value = x.Elements.Select(valueSelector).Sum(),
                    Elements = x.Elements.Select(y => new NamedValue { Name = y.Name, Value = valueSelector.Invoke(y) }).ToArray()
            };
        }
    }
}