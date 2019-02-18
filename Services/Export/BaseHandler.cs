using System;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BudgetPlanner.Models;
using Newtonsoft.Json;

namespace BudgetPlanner.Services.Export
{
    public class BaseHandler
    {
        internal TableStore TableStore { get; private set; }
        internal I18n.TranslationService I18n { get; private set; }

        public BaseHandler(TableStore TableStore, I18n.TranslationService i18n)
        {
            this.TableStore = TableStore;
            this.I18n = i18n;
        }

        public async Task ImportAsync(string userId, Complete value)
        {
            var budgets = await this.TableStore.GetAllAsync<Tables.Budget>(new Args { { nameof(Tables.Budget.UserId), userId } });
            foreach (var b in budgets)
            {
                await this.TableStore.DeleteAsync(b);
            }

            await this.TableStore.AddOrUpdateAsync(new Tables.Asset { UserId = userId, Data = value.Assets });
            await this.TableStore.AddOrUpdateAsync(new Tables.Revenue { UserId = userId, Data = value.Revenue });
            await this.TableStore.AddOrUpdateAsync(new Tables.Profile { UserId = userId, Data = value.Client });

            foreach (var b in value.Budgets)
            {
                if (string.IsNullOrWhiteSpace(b.Id) || !Guid.TryParse(b.Id, out var _))
                    b.Id = Guid.NewGuid().ToString();
                if (b.StartYear.GetValueOrDefault() == 0 && b.EndYear.GetValueOrDefault() == 0)
                {
                    try
                    {
                        var fromName = b.Name.Split("-").Select(x => int.Parse(x)).ToList();
                        b.StartYear = fromName[0];
                        b.EndYear = fromName[1];
                    }
                    catch { }
                }
                await this.TableStore.AddOrUpdateAsync(new Tables.Budget { UserId = userId, Name = b.Name, Id = b.Id, Data = b });
            }
        }
        public async Task<Stream> GetExportAsync(string userId)
        {
            var data = await this.GetJsonAsync(userId);
            return new MemoryStream(Encoding.UTF8.GetBytes(JsonConvert.SerializeObject(data)));
        }

        public async Task<Models.Complete> GetJsonAsync(string userId)
        {
            var budgets = await this.TableStore.GetAllAsync<Tables.Budget>(new Args { { nameof(Tables.Budget.UserId), userId } });
            var revenue = await this.TableStore.GetAsync(new Tables.Revenue { UserId = userId });
            var assets = await this.TableStore.GetAsync(new Tables.Asset { UserId = userId });
            var profile = await this.TableStore.GetAsync(new Tables.Profile { UserId = userId });

            budgets.Where(b => b.Data != null).ToList().ForEach(b =>
            {
                b.Data.Id = b.Id;
                b.Data.Name = b.Name;
            });

            return new Models.Complete
            {
                Budgets = budgets.Where(b => b.Data != null).Select(b => b.Data).ToArray(),
                Assets = assets.Data,
                Revenue = revenue.Data,
                Client = profile.Data
            };
        }
    }
}