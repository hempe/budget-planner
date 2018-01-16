using System;
using System.Linq;
using BudgetPlanner.Attributes;

namespace BudgetPlanner.Middleware {
    internal static class TypeExtensions {
        public static TableAttribute Table(this Type type) => type.GetCustomAttributes(typeof(TableAttribute), false).Cast<TableAttribute>().Single();
        public static bool IsTable(this Type type) => type.GetCustomAttributes(typeof(TableAttribute), false).Any();

        public static bool IsSimple(this Type type) {
            if (type.IsGenericType && type.GetGenericTypeDefinition() == typeof(Nullable<>)) {
                return IsSimple(type.GetGenericArguments() [0]);
            }
            return type.IsPrimitive ||
                type.IsEnum ||
                type.Equals(typeof(string)) ||
                type.Equals(typeof(decimal));
        }
    }
}