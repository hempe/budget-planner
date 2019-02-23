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
        {
            var parameterExpression = propertyAccessExpression.Parameters.Single();
            var propertyPath = MatchPropertyAccess(propertyAccessExpression.Body, parameterExpression);
            return propertyPath.Name;
        }

        private static PropertyInfo MatchPropertyAccess(Expression parameterExpression, Expression propertyAccessExpression)
            => (RemoveConvert(propertyAccessExpression) as MemberExpression)?.Member as PropertyInfo;

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