using System;
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

        public static IServiceCollection AddCustomStores(this IServiceCollection services, string connectionString, string tablePrefix) {
            services
                .AddTransient<IUserStore<User>, Services.UserStore>()
                .AddTransient<IRoleStore<IdentityRole>, Services.RoleStore>()
                .AddTransient<TableStore>()
                .AddTransient<Services.ProfileStore>()
                .AddTransient<Services.IStoreUserInfo, Services.ProfileStore>()
                .Configure<TableStoreOption>(x => {
                    x.Prefix = tablePrefix;
                    x.ConnectionString = connectionString;
                });

            return services;
        }
    }
}