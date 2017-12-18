using System;
using System.Linq;
using Microsoft.WindowsAzure.Storage.Table;
using Newtonsoft.Json;

namespace BudgetPlanner.Attributes {
    public class TableAttribute : Attribute {

        public TableAttribute(string name) {
            this.Name = name;
        }

        public string Name { get; private set; }

        //        public string PartitionKey { get; set; } = nameof(Models.UserData.UserId);
        //        public string RowKey { get; set; }

        public ITableEntity BeforeSave(ITableEntity entity) {
            if (entity == null)
                return entity;
            var type = entity.GetType();
            var rowKey = this.RowKey(type);
            var partitionKey = this.PartitionKey(type);

            if (!string.IsNullOrWhiteSpace(partitionKey) && type.GetProperty(partitionKey).CanRead)
                entity.PartitionKey = (string) type.GetProperty(partitionKey).GetValue(entity);

            if (!string.IsNullOrWhiteSpace(rowKey) && type.GetProperty(partitionKey).CanRead)
                entity.RowKey = (string) type.GetProperty(rowKey).GetValue(entity);

            foreach (var p in entity.GetType().GetProperties()) {
                var jsonData = p.GetCustomAttributes(typeof(JsonDataAttribute), true).Cast<JsonDataAttribute>().FirstOrDefault();
                if (jsonData == null)
                    continue;
                type.GetProperty(jsonData.PropertyName).SetValue(entity, ToJson(p.GetValue(entity)));
            }

            return entity;
        }

        public ITableEntity AfterLoad(ITableEntity entity) {
            if (entity == null)
                return entity;
            var type = entity.GetType();
            var rowKey = this.RowKey(type);
            var partitionKey = this.PartitionKey(type);

            if (!string.IsNullOrWhiteSpace(partitionKey) && type.GetProperty(partitionKey).CanWrite)
                type.GetProperty(partitionKey).SetValue(entity, entity.PartitionKey);

            if (!string.IsNullOrWhiteSpace(rowKey) && type.GetProperty(rowKey).CanWrite)
                type.GetProperty(rowKey).SetValue(entity, entity.RowKey);

            foreach (var p in entity.GetType().GetProperties()) {
                var jsonData = p.GetCustomAttributes(typeof(JsonDataAttribute), true).Cast<JsonDataAttribute>().FirstOrDefault();
                if (jsonData == null)
                    continue;
                p.SetValue(entity, ToObject(p.PropertyType, (string) type.GetProperty(jsonData.PropertyName).GetValue(entity)));
            }

            return entity;
        }

        public string PropertyName(Type type, string propertyName) {
            var rowKey = this.RowKey(type);
            var partitionKey = this.PartitionKey(type);

            if (string.Equals(partitionKey, propertyName))
                return nameof(ITableEntity.PartitionKey);

            if (string.Equals(rowKey, propertyName))
                return nameof(ITableEntity.RowKey);

            return propertyName;
        }

        private string PartitionKey(Type type) {
            var prop = type.GetProperties().Where(p => p.GetCustomAttributes(typeof(PartitionKeyAttribute), true).Any()).FirstOrDefault();
            return prop?.Name;
        }

        private string RowKey(Type type) {
            var prop = type.GetProperties().Where(p => p.GetCustomAttributes(typeof(RowKeyAttribute), true).Any()).FirstOrDefault();
            return prop?.Name;
        }

        private static string ToJson(object value) {
            return value == null ? null : JsonConvert.SerializeObject(value);
        }

        private static object ToObject(Type type, string value) {
            try {
                return string.IsNullOrEmpty(value) ? default(object) : JsonConvert.DeserializeObject(value, type);
            } catch {
                return default(object);
            }
        }
    }
}