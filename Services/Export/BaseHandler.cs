using System;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BudgetPlanner.Models;
using Newtonsoft.Json;

namespace BudgetPlanner.Services.Export {
    public class BaseHandler {
        protected TableStore TableStore { get; private set; }
        public BaseHandler(TableStore TableStore) {
            this.TableStore = TableStore;
        }

        public async Task ImportAsync(string userId, Complete value) {
            var budgets = await this.TableStore.GetAllAsync<Budget>(new Args { { nameof(Budget.UserId), userId } });
            foreach (var b in budgets) {
                await this.TableStore.DeleteAsync(b);
            }

            await this.TableStore.AddOrUpdateAsync(new Asset { UserId = userId, Data = value.Assets });
            await this.TableStore.AddOrUpdateAsync(new Revenue { UserId = userId, Data = value.Revenue });
            await this.TableStore.AddOrUpdateAsync(new Profile { UserId = userId, Data = value.Client });

            foreach (var b in value.Budgets) {
                if (string.IsNullOrWhiteSpace(b.Id))
                    b.Id = Guid.NewGuid().ToString();
                await this.TableStore.AddOrUpdateAsync(new Budget { UserId = userId, Name = b.Name, Id = b.Id, Data = b });
            }
        }

        public async Task<Stream> GetExportAsync(string userId) {
            var data = await this.GetJsonAsync(userId);
            return new MemoryStream(Encoding.UTF8.GetBytes(JsonConvert.SerializeObject(data)));
        }

        public async Task<Models.Complete> GetJsonAsync(string userId) {
            var budgets = await this.TableStore.GetAllAsync<Budget>(new Args { { nameof(Budget.UserId), userId } });
            var revenue = await this.TableStore.GetAsync(new Revenue { UserId = userId });
            var assets = await this.TableStore.GetAsync(new Asset { UserId = userId });
            var profile = await this.TableStore.GetAsync(new Profile { UserId = userId });

            budgets.Where(b => b.Data != null).ToList().ForEach(b => {
                b.Data.Id = b.Id;
                b.Data.Name = b.Name;
            });

            return new Models.Complete {
                Budgets = budgets.Where(b => b.Data != null).Select(b => b.Data).ToArray(),
                    Assets = assets.Data,
                    Revenue = revenue.Data,
                    Client = profile.Data
            };
        }
    }
}