using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;

namespace BudgetPlanner.Extensions
{
    internal static class Check
    {
        public static string GetPropertyName<T, TProperty>(Expression<Func<T, TProperty>> propertyAccessExpression)
            => ((RemoveConvert(propertyAccessExpression) as MemberExpression)?.Member as PropertyInfo)?.Name;

        private static Expression RemoveConvert(this Expression expression)
        {
            while ((expression != null)
                   && ((expression.NodeType == ExpressionType.Convert)
                       || (expression.NodeType == ExpressionType.ConvertChecked)))
            {
                expression = RemoveConvert(((UnaryExpression)expression).Operand);
            }

            return expression;
        }

    }
}