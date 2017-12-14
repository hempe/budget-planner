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
        public IEnumerable<Unit<T>> Positiv { get; set; } = new [] { new Unit<T>() };
        public IEnumerable<Unit<T>> Negativ { get; set; } = new [] { new Unit<T>() };

    }

    public class OverviewValue : NamedValue {
        public string Id { get; set; }
        public IEnumerable<OverviewContainer> Positiv { get; set; }
        public IEnumerable<OverviewContainer> Negativ { get; set; }
    }

    public class OverviewContainer : Unit<NamedValue> {
        public decimal Value { get; set; }
    }

    public static class GroupExtensions {
        public static OverviewValue ToOverview<T>(this Group<T> value, Func<T, decimal> valueSelector, string id, string name) where T : NamedValue, new() {
            var overview = new OverviewValue {
                Id = string.IsNullOrWhiteSpace(id) ? "0" : id,
                Name = string.IsNullOrWhiteSpace(name) ? typeof(T).Name : name,
                Negativ = value.Negativ.ToOverview(valueSelector),
                Positiv = value.Positiv.ToOverview(valueSelector),
            };

            overview.Value = overview.Positiv.Sum(x => x.Value) - overview.Negativ.Sum(x => x.Value);
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