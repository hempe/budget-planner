using System.IO;
using System.Linq;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.FileProviders;

namespace BudgetPlanner.Middleware {

    /// <summary>
    /// Application builder extensions.
    /// </summary>
    public static class CustomServerExtension {

        /// <summary>
        /// Use custom static files hosting.
        /// </summary>
        /// <param name="app">The application builder</param>
        /// <returns>The updated application builder</returns>
        public static IApplicationBuilder UseCustomStaticFiles(this IApplicationBuilder app, string rootDirectory) {
            var options = new StaticFileOptions() {
                FileProvider = new PhysicalFileProvider(rootDirectory),
                    ServeUnknownFileTypes = true,
                    OnPrepareResponse = (context) => {
                        context.Context.Response.Headers.Add("Cache-Control", "no-cache, no-store, must-revalidate");
                        context.Context.Response.Headers.Append("Pragma", "no-cache"); // HTTP 1.0
                        context.Context.Response.Headers.Add("Expires", "-1");
                    }
            };

            app.UseStaticFiles(options);

            app.MapWhen(context =>
                !context.Request.Path.StartsWithSegments("/api") &&
                !context.Request.Path.StartsWithSegments("/.auth") &&
                !context.Request.Path.StartsWithSegments("/swagger") &&
                !Path.HasExtension(context.Request.Path), innerApp => {
                    innerApp.Use((ctx, next) => {
                        ctx.Request.Path = "/index.html";
                        ctx.Response.StatusCode = 200;

                        return next();
                    });

                    innerApp.UseStaticFiles(options);
                });
            return app;
        }
    }
}