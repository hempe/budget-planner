using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using BudgetPlanner.Middleware;
using BudgetPlanner.Models;
using BudgetPlanner.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Scriban;
using Scriban.Parsing;
using Scriban.Runtime;
using Scriban.Syntax;

namespace BudgetPlanner.Services.Export
{
    public class HtmlHandler : IDisposable
    {
        private readonly BaseHandler baseHandler;
        private readonly TemplateService templateService;
        public HtmlHandler(BaseHandler baseHandler, TemplateService templateService)
        {
            this.baseHandler = baseHandler;
            this.templateService = templateService;
        }

        public void Dispose() { }

        public async Task<Stream> GetExportAsync(string userId)
        {
            var data = await this.baseHandler.GetJsonAsync(userId);
            var result = await this.templateService.RenderAsync("Templates/Export.html.template", data, data?.Client.Language);
            return new MemoryStream(Encoding.UTF8.GetBytes(result));
        }

    }
}