using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Microsoft.WindowsAzure.Storage.Table;

namespace BudgetPlanner
{
    internal static class TableResultExtension
    {
        public static async Task<IdentityResult> MapToResult(this Task<TableResult> task)
        {
            var result = await task;
            return (result.HttpStatusCode >= 200 && result.HttpStatusCode < 300)
                ? IdentityResult.Success
                : IdentityResult.Failed(new IdentityError { Code = result.HttpStatusCode.ToString() });
        }

        public static async Task<TableResult> ThrowOnError(this Task<TableResult> task)
        {
            var result = await task;
            if (result.HttpStatusCode >= 200 && result.HttpStatusCode < 300)
                return result;

            throw new Exception("Failed to update");
        }
    }
}