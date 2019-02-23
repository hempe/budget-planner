using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BudgetPlanner
{
    internal static class ObjectExtesion
    {
        public static Task<TResult> AsTask<TResult>(this TResult value) => Task.FromResult(value);
        
        public static Task<TResult> AsTask<TValue, TResult>(this TValue value, Func<TValue,TResult> func)
            => Task.FromResult(func(value));
 
        public static Task<TResult[]> WhenAll<TValue,TResult>(this IEnumerable<TValue> enumerable, Func<TValue,Task<TResult>> func)
            => Task.WhenAll(enumerable.Select(z => func(z)));
    }
}