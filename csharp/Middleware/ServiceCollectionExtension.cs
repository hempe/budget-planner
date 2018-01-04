using System;
using System.Linq;
using System.Reflection;
using BudgetPlanner.Models;
using BudgetPlanner.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;

namespace BudgetPlanner.Middleware {

    /// <summary>
    /// Service collection extensions.
    /// </summary>
    public static class ServiceCollectionExtension {

        public static IServiceCollection AddCustomStores(this IServiceCollection services, string connectionString, string tablePrefix, string imageContainer) {
            services
                .AddTransient<IUserStore<User>, Services.UserStore>()
                .AddTransient<IRoleStore<IdentityRole>, Services.RoleStore>()
                .AddTransient<TableStore>()
                .Configure<StoreOption>(x => {
                    x.Prefix = tablePrefix;
                    x.ConnectionString = connectionString;
                    x.ImageContainer = imageContainer;
                });

            return services;
        }
    }
}