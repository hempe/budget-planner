using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;

namespace BudgetPlanner
{
    internal static class ObjectExtesion
    {
        public static Task<TResult> AsTask<TResult>(this TResult value) => Task.FromResult(value);
        
        public static Task<TResult> AsTask<TValue, TResult>(this TValue value, Func<TValue,TResult> func)
            => Task.FromResult(func(value));
 
        public static TTarget InvokePrivateGeneric<TTarget>(
            this object source, 
            string method,
            Type genericType,
            params Object[] parameters)
            where TTarget: class
            =>  (TTarget) source.GetType()
                .GetMethod(method, BindingFlags.Instance | BindingFlags.NonPublic)
                .MakeGenericMethod(new[] { genericType }).Invoke(source, parameters);
    }
}