using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading.Tasks;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using Serilog;
using Serilog.Sinks.File;
using Serilog.AspNetCore;

namespace BudgetPlanner
{
    public class Program
    {
        public static int Main(string[] args)
        {
            try
            {
                AppDomain.CurrentDomain.UnhandledException += UnhandledExceptionHandler;
                Log.Logger = new LoggerConfiguration()
                    .MinimumLevel.Debug()
                    .WriteTo.Console()
                    .WriteTo.File(Path.Combine("logs","log.txt"), rollingInterval: RollingInterval.Day)
                    .CreateLogger();

                JsonConvert.DefaultSettings = () => new JsonSerializerSettings
                {
                    ContractResolver = new Newtonsoft.Json.Serialization.CamelCasePropertyNamesContractResolver(),
                    Converters = new List<JsonConverter> { new Middleware.FuzzyPropertyNameMatchingConverter() }
                };

                BuildWebHost(args).Run();
                return 0;
            }
            catch (Exception ex)
            {
                Log.Fatal(ex, "Host terminated unexpectedly");
                return -1;
            }
            finally
            {
                Log.CloseAndFlush();
            }
        }

        private static void UnhandledExceptionHandler(object sender, UnhandledExceptionEventArgs e)
        {
            if (Log.Logger != null)
            {
                if (e.ExceptionObject is Exception ex)
                {
                    Log.Fatal(ex, "Unhandled exception. {@Args}", e);
                }
                else
                {
                    Log.Fatal("Unhandled exception. {@Args}", e);
                }

                Log.CloseAndFlush();
            }
        }

        private static IWebHost BuildWebHost(string[] args)
        {
            var path = Environment.GetEnvironmentVariable("ASPNETCORE_CONTENTROOTPATH");
            var fallback = Directory.GetCurrentDirectory();

            var hostBuilder = WebHost.CreateDefaultBuilder(args)
                .UseContentRoot(string.IsNullOrEmpty(path) ? fallback : path)
                .UseStartup<Startup>()
                .UseSerilog();

            return hostBuilder.Build();
        }
    }
}