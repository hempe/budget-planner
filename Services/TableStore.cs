using Microsoft.Azure; // Namespace for CloudConfigurationManager
using Microsoft.WindowsAzure.Storage; // Namespace for CloudStorageAccount
using Microsoft.WindowsAzure.Storage.Table; // Namespace for Table storage types
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using BudgetPlanner.Attributes;
using BudgetPlanner.Middleware;
using Microsoft.Extensions.Options;
using BudgetPlanner.Extensions;
using System.Linq.Expressions;

namespace BudgetPlanner.Services
{
    public class StoreOption
    {
        public string ConnectionString { get; set; }
        public string ImageContainer { get; set; }
        public string Prefix { get; set; }
    }

    public static class ArgExtensions
    {
        public static Args AsArg<T>(this string value, Expression<Func<T, string>> propertySelector)
        {
            return new Args { { Check.GetPropertyName(propertySelector), value } };
        }
    }

    public class Args : Dictionary<string, string>
    {

    }

    public class TableStore
    {
        private static readonly Dictionary<Type, CloudTable> Tables;
        private static readonly Dictionary<Type, CloudTable> Views;
        private static readonly Dictionary<Type, TableAttribute> TableAttributes;
        private static readonly Dictionary<Type, ViewAttribute> ViewAttributes;

        static TableStore()
        {
            Tables = new Dictionary<Type, CloudTable>();
            Views = new Dictionary<Type, CloudTable>();
            TableAttributes = new Dictionary<Type, TableAttribute>();
            ViewAttributes = new Dictionary<Type, ViewAttribute>();
        }

        private readonly CloudTableClient tableClient;
        private readonly StoreOption options;

        public TableStore(IOptions<StoreOption> options)
        {
            this.options = options.Value;
            var cloudStorageAccount = CloudStorageAccount.Parse(this.options.ConnectionString);
            this.tableClient = cloudStorageAccount.CreateCloudTableClient();
        }

        private TableAttribute GetTableAttribute(Type type) 
            => TableAttributes.GetOrAdd(type, () => type.Table());

        private ViewAttribute GetViewAttribute(Type type) 
            => ViewAttributes.GetOrAdd(type, () => type.View());

        private Task<CloudTable> GetViewAsync(Type type) 
            => Views.GetOrAddAsync(type, () => this.GetCloudTableAsync($"{this.options.Prefix}{this.GetViewAttribute(type).TableName}"));

        private Task<CloudTable> GetTableAsync(Type type) 
            => Tables.GetOrAddAsync(type, () => this.GetCloudTableAsync($"{this.options.Prefix}{this.GetTableAttribute(type).TableName}"));

        private async Task<CloudTable> GetCloudTableAsync(string name)
        {
            var view = tableClient.GetTableReference(name);
            await view.CreateIfNotExistsAsync();
            return view;
        }

        public async Task<TableResult> DeleteAsync(Type type, ITableEntity entity)
        {
            var table = await this.GetTableAsync(type);
            entity.ETag = "*";
            entity = this.GetTableAttribute(type).BeforeSave(entity);
            var tableOperation = TableOperation.Delete(entity);
            return await table.ExecuteAsync(tableOperation);
        }

        public Task<TableResult> DeleteAsync<T>(T entity) where T : class, ITableEntity, new()
            => this.DeleteAsync(typeof(T), entity);

        public Task<TableResult> AddOrUpdateAsync<T>(T entity) where T : class, ITableEntity, new()
            => this.AddOrUpdateAsync(typeof(T), entity);
            
        public async Task<TableResult> AddOrUpdateAsync(Type type, ITableEntity entity)
        {
            var table = await this.GetTableAsync(type);
            entity = this.GetTableAttribute(type).BeforeSave(entity);
            return await table.ExecuteAsync(TableOperation.InsertOrReplace(entity));
        }

        public async Task<T> GetAsync<T>(T entity) where T : class, ITableEntity, new()
        {
            var type = typeof(T);
            var table = await this.GetViewAsync(type);
            var attribute = this.GetViewAttribute(type);
            attribute.BeforeQuery(entity);

            var tableOperation = TableOperation.Retrieve<T>(entity.PartitionKey, entity.RowKey);
            var tableResult = await table.ExecuteAsync(tableOperation);
            try
            {
                var value = tableResult.Result as T;
                attribute.AfterLoad(value);
                return value;
            }
            catch (Exception e)
            {
                Console.Error.WriteLine(e.Message);
                return null;
            }
        }

        public async Task<T> GetAsync<T>(Args parameter) where T : class, ITableEntity, new()
        {
            var type = typeof(T);
            var table = await this.GetViewAsync(type);
            string filter = null;
            var attribute = this.GetViewAttribute(type);
            foreach (var kv in parameter)
            {
                var propertyName = attribute.PropertyName(type, kv.Key);
                var condition = TableQuery.GenerateFilterCondition(propertyName, QueryComparisons.Equal, kv.Value);
                if (filter == null)
                    filter = condition;
                else
                    filter = TableQuery.CombineFilters(filter, TableOperators.And, condition);
            }

            var query = (filter == null ? new TableQuery<T>() : new TableQuery<T>().Where(filter)).Take(1);
            T re = null;
            TableContinuationToken continuationToken = null;
            do
            {
                TableQuerySegment<T> segment = await table.ExecuteQuerySegmentedAsync(query, continuationToken);
                re = segment.Results.FirstOrDefault();
                if (re != null)
                {
                    attribute.AfterLoad(re);
                    return re;
                }
                continuationToken = segment.ContinuationToken;
            } while (continuationToken != null);
            attribute.AfterLoad(re);
            return re;
        }

        public async Task<List<T>> GetAllAsync<T>(Args parameter = null) where T : class, ITableEntity, new()
        {
            string filter = null;
            var type = typeof(T);
            var table = await this.GetViewAsync(type);
            var attribute = this.GetViewAttribute(type);

            foreach (var kv in parameter ?? new Args())
            {
                var propertyName = attribute.PropertyName(type, kv.Key);
                var condition = TableQuery.GenerateFilterCondition(propertyName, QueryComparisons.Equal, kv.Value);
                filter = filter == null
                    ? condition
                    : TableQuery.CombineFilters(filter, TableOperators.And, condition);
            }

            var query = filter == null ? new TableQuery<T>() : new TableQuery<T>().Where(filter);
            var re = new List<T>();
            TableContinuationToken continuationToken = null;
            do
            {
                TableQuerySegment<T> segment = await table.ExecuteQuerySegmentedAsync(query, continuationToken);
                re.AddRange(segment.Results.ToList());
                continuationToken = segment.ContinuationToken;
            } while (continuationToken != null);
            re.ForEach(r => attribute.AfterLoad(r));
            return re;
        }

        public Task<IList<ITableEntity>> GetAllAsync(Type type, Args parameter = null)
            => this.InvokePrivateGeneric<Task<IList<ITableEntity>>>(nameof(this.GetAllTableEntitesAsync), type, parameter ?? new Args());
        
        public Task<ITableEntity> GetAsync(Type type, Args parameter)
            => this.InvokePrivateGeneric<Task<ITableEntity>>(nameof(this.GetEntityAsync), type, parameter ?? new Args());
        
        private async Task<ITableEntity> GetEntityAsync<T>(Args parameter) where T : class, ITableEntity, new()
        {
            var type = typeof(T);
            var table = await this.GetViewAsync(type);
            string filter = null;
            var attribute = this.GetViewAttribute(type);
            foreach (var kv in parameter)
            {
                var propertyName = attribute.PropertyName(type, kv.Key);
                var condition = TableQuery.GenerateFilterCondition(propertyName, QueryComparisons.Equal, kv.Value);
                if (filter == null)
                    filter = condition;
                else
                    filter = TableQuery.CombineFilters(filter, TableOperators.And, condition);
            }

            var query = (filter == null ? new TableQuery<T>() : new TableQuery<T>().Where(filter)).Take(1);
            T re = null;
            TableContinuationToken continuationToken = null;
            do
            {
                TableQuerySegment<T> segment = await table.ExecuteQuerySegmentedAsync(query, continuationToken);
                re = segment.Results.FirstOrDefault();
                if (re != null)
                {
                    attribute.AfterLoad(re);
                    return re;
                }
                continuationToken = segment.ContinuationToken;
            } while (continuationToken != null);
            attribute.AfterLoad(re);
            return re;
        }

        private async Task<IList<ITableEntity>> GetAllTableEntitesAsync<T>(Args parameter) where T : class, ITableEntity, new()
        {
            string filter = null;
            var type = typeof(T);
            var table = await this.GetViewAsync(type);
            var attribute = this.GetViewAttribute(type);
            foreach (var kv in parameter)
            {
                var propertyName = attribute.PropertyName(type, kv.Key);
                var condition = TableQuery.GenerateFilterCondition(propertyName, QueryComparisons.Equal, kv.Value);
                filter = filter == null 
                    ? condition
                    : TableQuery.CombineFilters(filter, TableOperators.And, condition);
            }

            var query = filter == null ? new TableQuery<T>() : new TableQuery<T>().Where(filter);
            var re = new List<ITableEntity>();
            TableContinuationToken continuationToken = null;
            do
            {
                TableQuerySegment<T> segment = await table.ExecuteQuerySegmentedAsync(query, continuationToken);
                re.AddRange(segment.Results.ToList());
                continuationToken = segment.ContinuationToken;
            } while (continuationToken != null);
            return re.Select(r => attribute.AfterLoad(r)).ToList();
        }
    }
}