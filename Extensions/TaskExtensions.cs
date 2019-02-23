using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BudgetPlanner
{
    public static class TaskExtensions
    {

        public static Task WhenAll(this IEnumerable<Task> tasks) => Task.WhenAll(tasks);
        public static async Task<TResult> Transform<TResult, TValue>(this Task<TValue> task, Func<TValue, TResult> transform)
            where TResult : class
         => transform(await task);

        public static async Task<IList<TResult>> Select<TResult, TValue>(this Task<List<TValue>> task, Func<TValue, TResult> then)
        where TResult : class
        {
            var items = await task;
            return items?.Select(z => then(z)).ToList() ?? new List<TResult>();
        }


        public static async Task<TResult> TransformAsync<TResult, TValue>(this Task<TValue> task, Func<TValue, Task<TResult>> transform)
            where TResult : class
         => await transform(await task);

        public static async Task<IList<TResult>> SelectAsync<TResult, TValue>(this Task<List<TValue>> task, Func<TValue, Task<TResult>> then)
        where TResult : class
        {
            var items = await task;
            var result = await Task.WhenAll(items.Select(z => then(z)));
            return result;
        }


        public static async Task WhenAll<TValue>(this Task<IList<TValue>> task, Func<TValue, Task> then)
        {
            var items = await task;
            await Task.WhenAll(items.Select(z => then(z)));
        }


        public static async Task CatchException(this Task task)
        {
            try
            {
                await task;
            }
            catch { }
        }

        public static async Task<TResult> IfNull<TResult>(this Task<TResult> task, Func<Task<TResult>> ifNull)
            where TResult : class
         => await task ?? await ifNull();

        public static async Task<TResult> IfNotNull<TResult, TValue>(this Task<TValue> task, Func<TValue, Task<TResult>> ifNotNull)
            where TValue : class
        {
            var result = await task;
            if (result == null)
                return default(TResult);
            return await ifNotNull(result);
        }

        public static Task<TResult> IfNotNull<TResult, TValue>(this Task<TValue> task, Func<TValue, TResult> ifNotNull)
            where TValue : class
            => task.ContinueWith(t =>
            {
                if (t.Result == null)
                    return default(TResult);
                return ifNotNull(t.Result);
            });
    }
}