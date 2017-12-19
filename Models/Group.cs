using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Identity;
using Microsoft.WindowsAzure.Storage.Table;

namespace BudgetPlanner.Models {

    public class FrequencyValue : NamedValue {
        public int Frequency { get; set; }
    }

    public class DatedValue : NamedValue {
        public int Year { get; set; }
    }

    public class NamedValue {
        public string Name { get; set; }
        public decimal Value { get; set; }
    }

    public class Unit<T> where T : new() {
        public string Name { get; set; }
        public IEnumerable<T> Elements { get; set; } = new [] { new T() };
    }

    public class Group<T> where T : new() {
        public IEnumerable<Unit<T>> Positive { get; set; } = new [] { new Unit<T>() };
        public IEnumerable<Unit<T>> Negative { get; set; } = new [] { new Unit<T>() };

    }

    public class OverviewValue : NamedValue {
        public string Id { get; set; }
        public IEnumerable<OverviewContainer> Positive { get; set; }
        public IEnumerable<OverviewContainer> Negative { get; set; }
    }

    public class OverviewContainer : Unit<NamedValue> {
        public decimal Value { get; set; }
    }

    public static class GroupExtensions {
        public static OverviewValue ToOverview<T>(this Group<T> value, Func<T, decimal> valueSelector, string id, string name) where T : NamedValue, new() {
            var overview = new OverviewValue {
                Id = string.IsNullOrWhiteSpace(id) ? "0" : id,
                Name = string.IsNullOrWhiteSpace(name) ? typeof(T).Name : name,
                Negative = value.Negative.ToOverview(valueSelector),
                Positive = value.Positive.ToOverview(valueSelector),
            };

            overview.Value = overview.Positive.Sum(x => x.Value) - overview.Negative.Sum(x => x.Value);
            return overview;
        }

        private static IEnumerable<OverviewContainer> ToOverview<T>(this IEnumerable<Unit<T>> x, Func<T, decimal> valueSelector) where T : NamedValue, new() {
            return x.Select(y => y.ToOverview(valueSelector));
        }

        private static OverviewContainer ToOverview<T>(this Unit<T> x, Func<T, decimal> valueSelector) where T : NamedValue, new() {
            return new OverviewContainer {
                Name = x.Name,
                    Value = x.Elements.Select(valueSelector).Sum(),
                    Elements = x.Elements.Select(y => new NamedValue { Name = y.Name, Value = valueSelector.Invoke(y) })
            };
        }
    }
}