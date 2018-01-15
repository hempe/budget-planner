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

namespace BudgetPlanner.Services {
    public class StoreOption {
        public string ConnectionString { get; set; }
        public string ImageContainer { get; set; }
        public string Prefix { get; set; }
    }

    public class Args : Dictionary<string, string> { }

    public class TableStore {
        private static readonly Dictionary<Type, CloudTable> Tables;
        private static readonly Dictionary<Type, TableAttribute> Attributes;

        static TableStore() {
            Tables = new Dictionary<Type, CloudTable>();
            Attributes = new Dictionary<Type, TableAttribute>();
        }

        private readonly CloudTableClient tableClient;
        private readonly StoreOption options;

        public TableStore(IOptions<StoreOption> options) {
            this.options = options.Value;
            var cloudStorageAccount = CloudStorageAccount.Parse(this.options.ConnectionString);
            this.tableClient = cloudStorageAccount.CreateCloudTableClient();
        }

        private TableAttribute GetAttribute(Type type) {
            if (Attributes.TryGetValue(type, out var t) && t != null)
                return t;
            var attribute = type.Table();
            try {
                Attributes[type] = attribute;
            } catch {
                Attributes[type] = attribute;
            }
            return attribute;
        }

        private async Task<CloudTable> GetTableAsync(Type type) {
            if (Tables.TryGetValue(type, out var t) && t != null)
                return t;

            var table = tableClient.GetTableReference($"{this.options.Prefix}{this.GetAttribute(type).Name}");
            await table.CreateIfNotExistsAsync();
            try {
                Tables[type] = table;
            } catch {
                Tables[type] = table;
                return table;
            }
            return table;
        }

        public async Task<TableResult> DeleteAsync(Type type, ITableEntity entity) {

            var table = await this.GetTableAsync(type);
            entity.ETag = "*";
            entity = this.GetAttribute(type).BeforeSave(entity);
            var tableOperation = TableOperation.Delete(entity);
            return await table.ExecuteAsync(tableOperation);
        }
        public Task<TableResult> DeleteAsync<T>(T entity) where T : class, ITableEntity, new() => this.DeleteAsync(typeof(T), entity);

        public Task<TableResult> AddOrUpdateAsync<T>(T entity) where T : class, ITableEntity, new() => this.AddOrUpdateAsync(typeof(T), entity);
        public async Task<TableResult> AddOrUpdateAsync(Type type, ITableEntity entity) {
            var table = await this.GetTableAsync(type);
            entity = this.GetAttribute(type).BeforeSave(entity);

            var tableOperation = TableOperation.InsertOrReplace(entity);
            return await table.ExecuteAsync(tableOperation);
        }

        public async Task<T> GetAsync<T>(T entity) where T : class, ITableEntity, new() {
            var type = typeof(T);
            var table = await this.GetTableAsync(type);
            var attribute = this.GetAttribute(type);
            attribute.BeforeSave(entity);

            var tableOperation = TableOperation.Retrieve<T>(entity.PartitionKey, entity.RowKey);
            var tableResult = await table.ExecuteAsync(tableOperation);
            try {
                var value = tableResult.Result as T;
                attribute.AfterLoad(value);
                return value;
            } catch (Exception e) {
                Console.Error.WriteLine(e.Message);
                return null;
            }
        }

        public async Task<T> GetAsync<T>(Args parameter) where T : class, ITableEntity, new() {
            var type = typeof(T);
            var table = await this.GetTableAsync(type);
            string filter = null;
            var attribute = this.GetAttribute(type);
            foreach (var kv in parameter) {
                var propertyName = attribute.PropertyName(type, kv.Key);
                var condition = TableQuery.GenerateFilterCondition(propertyName, QueryComparisons.Equal, kv.Value);
                if (filter == null)
                    filter = condition;
                else
                    filter = TableQuery.CombineFilters(filter, TableOperators.And, condition);
            }

            var query = new TableQuery<T>().Where(filter).Take(1);
            T re = null;
            TableContinuationToken continuationToken = null;
            do {
                TableQuerySegment<T> segment = await table.ExecuteQuerySegmentedAsync(query, continuationToken);
                re = segment.Results.FirstOrDefault();
                if (re != null) {
                    attribute.AfterLoad(re);
                    return re;
                }
                continuationToken = segment.ContinuationToken;
            } while (continuationToken != null);
            attribute.AfterLoad(re);
            return re;
        }

        public async Task<List<T>> GetAllAsync<T>(Args parameter) where T : class, ITableEntity, new() {
            string filter = null;
            var type = typeof(T);
            var table = await this.GetTableAsync(type);
            var attribute = this.GetAttribute(type);
            foreach (var kv in parameter) {
                var propertyName = attribute.PropertyName(type, kv.Key);
                var condition = TableQuery.GenerateFilterCondition(propertyName, QueryComparisons.Equal, kv.Value);
                if (filter == null)
                    filter = condition;
                else
                    filter = TableQuery.CombineFilters(filter, TableOperators.And, condition);
            }

            var query = new TableQuery<T>();
            if (filter != null) {
                query = query.Where(filter);
            }

            var re = new List<T>();
            TableContinuationToken continuationToken = null;
            do {
                TableQuerySegment<T> segment = await table.ExecuteQuerySegmentedAsync(query, continuationToken);
                re.AddRange(segment.Results.ToList());
                continuationToken = segment.ContinuationToken;
            } while (continuationToken != null);
            re.ForEach(r => attribute.AfterLoad(r));
            return re;
        }

        public Task<List<ITableEntity>> GetAllAsync(Type type, Args parameter) {
            return (Task<List<ITableEntity>>) this.GetType().GetMethod(nameof(this.GetAllTableEntitesAsync), BindingFlags.Instance | BindingFlags.NonPublic).MakeGenericMethod(new [] { type }).Invoke(this, new [] { parameter });
        }

        private async Task<List<ITableEntity>> GetAllTableEntitesAsync<T>(Args parameter) where T : class, ITableEntity, new() {
            string filter = null;
            var type = typeof(T);
            var table = await this.GetTableAsync(type);
            var attribute = this.GetAttribute(type);
            foreach (var kv in parameter) {
                var propertyName = attribute.PropertyName(type, kv.Key);
                var condition = TableQuery.GenerateFilterCondition(propertyName, QueryComparisons.Equal, kv.Value);
                if (filter == null)
                    filter = condition;
                else
                    filter = TableQuery.CombineFilters(filter, TableOperators.And, condition);
            }

            var query = new TableQuery<T>();
            if (filter != null) {
                query = query.Where(filter);
            }

            var re = new List<ITableEntity>();
            TableContinuationToken continuationToken = null;
            do {
                TableQuerySegment<T> segment = await table.ExecuteQuerySegmentedAsync(query, continuationToken);
                re.AddRange(segment.Results.ToList());
                continuationToken = segment.ContinuationToken;
            } while (continuationToken != null);
            return re.Select(r => attribute.AfterLoad(r)).ToList();
        }
    }
}