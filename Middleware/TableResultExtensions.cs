using Microsoft.WindowsAzure.Storage.Table;

namespace BudgetPlanner.Middleware
{
    public static class TableResultExtensions
    {
        public static bool Success(this TableResult result) 
            => (result.HttpStatusCode >= 200 && result.HttpStatusCode < 300);
    }
}