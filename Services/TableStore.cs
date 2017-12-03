using Microsoft.Azure; // Namespace for CloudConfigurationManager
using Microsoft.WindowsAzure.Storage; // Namespace for CloudStorageAccount
using Microsoft.WindowsAzure.Storage.Table; // Namespace for Table storage types
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Options;

namespace BudgetPlanner.Services {
    public class TableStoreOption {
        public string ConnectionString { get; set; }
        public string Prefix { get; set; }
    }

    public class Args : Dictionary<string, string> { }
    public class TableStore {
        private readonly CloudTableClient tableClient;
        private readonly TableStoreOption options;

        private static Dictionary<string, CloudTable> Tables = new Dictionary<string, CloudTable>();

        public TableStore(IOptions<TableStoreOption> options) {
            this.options = options.Value;
            var cloudStorageAccount = CloudStorageAccount.Parse(this.options.ConnectionString);
            this.tableClient = cloudStorageAccount.CreateCloudTableClient();
        }

        private async Task<CloudTable> GetTableAsync(string name) {
            if (Tables.TryGetValue(name, out var t) && t != null)
                return t;

            var table = tableClient.GetTableReference($"{this.options.Prefix}{name}");
            await table.CreateIfNotExistsAsync();
            Tables[name] = table;
            return table;
        }

        public async Task<TableResult> DeleteAsync<T>(T entity) where T : class, ITableEntity, new() {
            var table = await this.GetTableAsync(typeof(T).Name);
            entity.ETag = "*";
            var tableOperation = TableOperation.Delete(entity);
            return await table.ExecuteAsync(tableOperation);
        }

        public async Task<TableResult> AddOrUpdateAsync<T>(T entity) where T : class, ITableEntity, new() {
            var table = await this.GetTableAsync(typeof(T).Name);
            var tableOperation = TableOperation.InsertOrReplace(entity);
            return await table.ExecuteAsync(tableOperation);
        }

        public async Task<T> GetAsync<T>(T entity) where T : class, ITableEntity, new() {
            var table = await this.GetTableAsync(typeof(T).Name);
            var tableOperation = TableOperation.Retrieve<T>(entity.PartitionKey, entity.RowKey);
            var tableResult = await table.ExecuteAsync(tableOperation);
            try {
                var value = tableResult.Result as T;
                return value;
            } catch {
                return null;
            }
        }

        public async Task<T> GetByPropertiesAsync<T>(Args parameter) where T : class, ITableEntity, new() {
            var table = await this.GetTableAsync(typeof(T).Name);

            string filter = null;
            foreach (var kv in parameter) {
                var condition = TableQuery.GenerateFilterCondition(kv.Key, QueryComparisons.Equal, kv.Value);
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
                continuationToken = segment.ContinuationToken;
            } while (continuationToken != null);
            return re;
        }

        public async Task<List<T>> GetAllByPropertiesAsync<T>(Args parameter) where T : class, ITableEntity, new() {
            var table = await this.GetTableAsync(typeof(T).Name);

            string filter = null;
            foreach (var kv in parameter) {
                var condition = TableQuery.GenerateFilterCondition(kv.Key, QueryComparisons.Equal, kv.Value);
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
            return re;
        }
    }
}