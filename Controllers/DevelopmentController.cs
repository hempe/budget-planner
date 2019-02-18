using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BudgetPlanner.Models;
using BudgetPlanner.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace BudgetPlanner.Controllers
{

    [Route("api")]
    [Authorize]
    public class DevelopmentController : BaseController
    {

        public DevelopmentController(UserManager<User> userManager, TableStore tableStore) : base(userManager, tableStore) { }

        [HttpGet("development")]
        [ProducesResponseType(typeof(DevelopmentElement[]), 200)]
        public async Task<IActionResult> GetDevelopment()
        {
            var all = new List<DevelopmentElement>();
            var budgets = await this.TableStore.GetAllAsync<Tables.Budget>(new Args { { nameof(Tables.Budget.UserId), this.UserId } });
            if (budgets != null)
            {
                all.AddRange(budgets
                    .Where(b => b.Data != null)
                    .SelectMany(b => b.Data.Positive.Select(x => new DevelopmentElement
                    {
                        Group = b.Name,
                        Name = x.Name,
                        Value = x.Elements == null ? 0 : x.Elements.Sum(y => y.Value * y.Frequency),
                        Start = b.Data.StartYear,
                        End = b.Data.EndYear,
                        Type = "budgets",
                        SubType = "positive",
                        Id = b.Id
                    }))
                    .ToList());

                all.AddRange(budgets
                    .Where(b => b.Data != null)
                    .SelectMany(b => b.Data.Negative.Select(x => new DevelopmentElement
                    {
                        Group = b.Name,
                        Name = x.Name,
                        Value = -(x.Elements == null ? 0 : x.Elements.Sum(y => y.Value * y.Frequency)),
                        Start = b.Data.StartYear,
                        End = b.Data.EndYear,
                        Type = "budgets",
                        SubType = "negative",
                        Id = b.Id
                    }))
                    .ToList());
            }

            var revenue = await this.TableStore.GetAsync(new Tables.Revenue { UserId = this.UserId });
            if (revenue?.Data != null)
            {
                all.AddRange(
                    revenue.Data.Positive.SelectMany(x => x.Elements.Select(y => new
                    {
                        Name = x.Name,
                        Value = y.Value,
                        Year = y.Year,
                    })).GroupBy(x => (x.Name, x.Year))
                    .Select(x => new DevelopmentElement
                    {
                        Group = nameof(Tables.Revenue),
                        Name = x.Key.Name,
                        Start = x.Key.Year,
                        End = x.Key.Year,
                        Value = x.Sum(y => y.Value),
                        Type = "revenue",
                        SubType = "positive"
                    }));

                all.AddRange(
                    revenue.Data.Negative.SelectMany(x => x.Elements.Select(y => new
                    {
                        Name = x.Name,
                        Value = -y.Value,
                        Year = y.Year,
                    })).GroupBy(x => (x.Name, x.Year))
                    .Select(x => new DevelopmentElement
                    {
                        Group = nameof(Tables.Revenue),
                        Name = x.Key.Name,
                        Start = x.Key.Year,
                        End = x.Key.Year,
                        Value = x.Sum(y => y.Value),
                        Type = "revenue",
                        SubType = "negative"
                    }));
            }

            var assets = await this.TableStore.GetAsync(new Tables.Asset { UserId = this.UserId });
            if (assets?.Data != null)
            {
                all.AddRange(
                    assets.Data.Positive.SelectMany(x => x.Elements.Select(y => new
                    {
                        Name = x.Name,
                        Value = y.Value,
                    })).GroupBy(x => x.Name)
                    .Select(x => new DevelopmentElement
                    {
                        Group = nameof(Tables.Asset),
                        Name = x.Key,
                        Value = x.Sum(y => y.Value),
                        Type = "assets",
                        SubType = "positive"
                    }));
                all.AddRange(
                    assets.Data.Negative.SelectMany(x => x.Elements.Select(y => new
                    {
                        Name = x.Name,
                        Value = -y.Value,
                    })).GroupBy(x => x.Name)
                    .Select(x => new DevelopmentElement
                    {
                        Group = nameof(Tables.Asset),
                        Name = x.Key,
                        Value = x.Sum(y => y.Value),
                        Type = "assets",
                        SubType = "negative"
                    }));
            }

            return this.Ok(all);
        }
    }
}