using System.Collections.Generic;
using System.Linq;

namespace BudgetPlanner
{
    internal static class EnumerableExtesions
    {
        public static IList<TSource> ToIList<TSource>(this IEnumerable<TSource> source)
            => source.ToList();
    }
}