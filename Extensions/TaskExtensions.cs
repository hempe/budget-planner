using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Threading.Tasks;

namespace BudgetPlanner
{
    public static class TaskExtensions
    {
        public static async Task<TResult> ContinueWithAsync<TResult>(this Task task, Func<TResult> transform){
            await task;
            return transform();   
        }

        public static async Task<TResult> ContinueWithAsync<TResult, TValue>(this Task<TValue> task, Func<TValue, TResult> transform)
            => transform(await task);

        public static async Task<TResult> ContinueWithAsync<TResult, TValue>(this Task<TValue> task, Func<TValue, Task<TResult>> transform)
         => await transform(await task);
         
        public static async Task ContinueWithAsync<T>(this Task<T> task, Func<T, Task> then)
            => await then(await task);

        public static async Task CatchException(this Task task)
        {
            try
            {
                await task;
            }
            catch { }
        }

        public static Task WhenAllAsync<TSource>(this IEnumerable<TSource> source, Func<TSource, Task> selector)
            => Task.WhenAll(source.Select(selector));

        public static Task WhenAllAsync(this IEnumerable<Func<Task>> source)
            => Task.WhenAll(source.Select(x=>x()));

        public static Task<TResult[]> WhenAllAsync<TSource, TResult>(this IEnumerable<TSource> source, Func<TSource, Task<TResult>> selector)
            => Task.WhenAll(source.Select(selector));

        public static Task WhenAllAsync(this IEnumerable<Task> tasks) => Task.WhenAll(tasks);
        public static Task<TResult[]> WhenAllAsync<TResult>(this IEnumerable<Task<TResult>> tasks) => Task.WhenAll(tasks);
    }
}