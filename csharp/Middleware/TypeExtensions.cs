using System;
using System.Linq;
using System.Reflection;
using BudgetPlanner.Attributes;

namespace BudgetPlanner.Middleware {
    internal static class TypeExtensions {
        public static TableAttribute Table(this Type type) => type.GetCustomAttributes(typeof(TableAttribute), false).Cast<TableAttribute>().Single();

        public static bool IsTable(this Type type) => type.GetCustomAttributes(typeof(TableAttribute), false).Any();
    }
}