using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using BudgetPlanner.Middleware;
using BudgetPlanner.Models;
using BudgetPlanner.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.NodeServices;

namespace BudgetPlanner.Services.Export {
    public class PdfHandler : IDisposable {
        private readonly HtmlHandler baseHandler;
        private readonly INodeServices nodeServices;

        public PdfHandler(HtmlHandler baseHandler, INodeServices nodeServices) {
            this.baseHandler = baseHandler;
            this.nodeServices = nodeServices;
        }

        public void Dispose() {

        }

        public async Task<Stream> GetExportAsync(string userId) {
            var export = await this.baseHandler.GetExportAsync(userId);
            using(var reader = new StreamReader(export, Encoding.UTF8)) {
                var htmlContent = await reader.ReadToEndAsync();
                var result = await nodeServices.InvokeAsync<byte[]>("./Templates/Pdf", htmlContent);
                return new MemoryStream(result);
            }
        }
    }
}