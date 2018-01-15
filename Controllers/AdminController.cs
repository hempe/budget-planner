using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BudgetPlanner.Attributes;
using BudgetPlanner.Middleware;
using BudgetPlanner.Models;
using BudgetPlanner.Services;
using BudgetPlanner.Services.I18n;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.WindowsAzure.Storage.Table;

namespace BudgetPlanner.Controllers {

    public class TableEntry {
        public string PartitionKey { get; set; }
        public string RowKey { get; set; }
        public string Table { get; set; }
        public Dictionary<string, object> Data { get; set; }
    }

    [Route("api/admin")]
    [Authorize(Roles = "admin")]
    [Authorize]
    public class AdminController : BaseController {
        public AdminController(UserManager<User> userManager, TableStore tableStore) : base(userManager, tableStore) { }

        [HttpGet("tables")]
        [ProducesResponseType(typeof(string[]), 200)]
        public IActionResult GetTables() {
            var tables = this.GetType().Assembly.GetTypes()
                .Where(t => t.IsTable())
                .Select(t => t.Table().Name).ToList();
            return this.Ok(tables);
        }

        [HttpGet("tables/{tableName}")]
        [ProducesResponseType(typeof(TableEntity[]), 200)]
        public async Task<IActionResult> GetAll([FromRoute] string tableName) {
            var table = this.FindTableType(tableName);
            var all = await this.TableStore.GetAllAsync(table, new Args { });
            var cleaned = this.ToTableEntries(table, all);
            return this.Ok(cleaned);
        }

        [HttpGet("tables/{tableName}/{partitionKey}")]
        [ProducesResponseType(typeof(TableEntity[]), 200)]
        public async Task<IActionResult> GetByPartitionKey([FromRoute] string tableName, string partitionKey) {
            var table = this.FindTableType(tableName);
            var all = await this.TableStore.GetAllAsync(table, new Args { { nameof(ITableEntity.PartitionKey), partitionKey } });
            var cleaned = this.ToTableEntries(table, all);
            return this.Ok(cleaned);
        }

        [HttpGet("tables/{tableName}/{partitionKey}/{rowKey}")]
        [ProducesResponseType(typeof(TableEntity[]), 200)]
        public async Task<IActionResult> GetByPartitionAndRowKey([FromRoute] string tableName, [FromRoute] string partitionKey, [FromRoute] string rowKey) {
            var table = this.FindTableType(tableName);
            var all = await this.TableStore.GetAllAsync(table,
                new Args { { nameof(ITableEntity.PartitionKey), partitionKey }, { nameof(ITableEntity.RowKey), rowKey }
                });
            var cleaned = this.ToTableEntries(table, all);
            return this.Ok(cleaned);
        }

        [HttpDelete("tables/{tableName}/{partitionKey}/{rowKey}")]
        [ProducesResponseType(typeof(TableEntity[]), 200)]
        public async Task<IActionResult> Delete([FromRoute] string tableName, [FromRoute] string partitionKey, [FromRoute] string rowKey) {
            var table = this.FindTableType(tableName);
            var all = await this.TableStore.GetAllAsync(table,
                new Args { { nameof(ITableEntity.PartitionKey), partitionKey }, { nameof(ITableEntity.RowKey), rowKey }
                });
            foreach (var del in all) {
                await this.TableStore.DeleteAsync(table, del);
            }
            var cleaned = this.ToTableEntries(table, all);
            return this.Ok(cleaned);
        }

        [HttpGet("tables/byPartition/{partitionKey}")]
        [ProducesResponseType(typeof(TableEntity[]), 200)]
        public async Task<IActionResult> GetAllByPartition([FromRoute] string partitionKey) {

            var merged = new List<TableEntry>();
            foreach (var tableName in this.GetType().Assembly.GetTypes().Where(t => t.IsTable()).Select(t => t.Table().Name).ToList()) {

                var table = this.FindTableType(tableName);
                var all = await this.TableStore.GetAllAsync(table,
                    new Args { { nameof(ITableEntity.PartitionKey), partitionKey } });
                merged.AddRange(this.ToTableEntries(table, all));
            }
            return this.Ok(merged);
        }

        private List<TableEntry> ToTableEntries(Type type, List<ITableEntity> values) {
            var rows = new List<TableEntry>();
            if (values == null)
                return rows;
            var tableName = type.Table().Name;
            var toIgnore = type.GetProperties()
                .Where(p => p.HasCustomAttribute<JsonDataAttribute>())
                .Select(p => p.GetCustomAttribute<JsonDataAttribute>().PropertyName)
                .ToList();

            var properties = type.GetProperties()
                .Where(p => !p.HasCustomAttribute<SecretValueAttribute>())
                .Where(p => !toIgnore.Contains(p.Name))
                .Where(p => typeof(ITableEntity).GetProperty(p.Name) == null);

            foreach (var obj in values) {
                if (obj == null)
                    continue;
                var value = new TableEntry {
                    PartitionKey = obj.PartitionKey,
                    RowKey = obj.RowKey,
                    Table = tableName,
                    Data = new Dictionary<string, object>()
                };

                foreach (var property in properties) {
                    value.Data[property.Name] = property.GetValue(obj);
                }
                rows.Add(value);
            }

            return rows;
        }

        private Type FindTableType(string tableName) {
            var type = this.GetType().Assembly.GetTypes()
                .Where(t => t.IsTable())
                .Where(t => string.Equals(t.Table().Name, tableName, StringComparison.OrdinalIgnoreCase))
                .FirstOrDefault();
            return type;
        }
    }
}