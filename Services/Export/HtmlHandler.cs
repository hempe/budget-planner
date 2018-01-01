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

namespace BudgetPlanner.Services.Export {
    public class HtmlHandler : IDisposable {

        private readonly BaseHandler baseHandler;
        private Complete data;

        public HtmlHandler(BaseHandler baseHandler) {
            this.baseHandler = baseHandler;
        }

        public void Dispose() {

        }

        public async Task<Stream> GetExportAsync(string userId) {
            this.data = await this.baseHandler.GetJsonAsync(userId);
            var content = string.Empty;
            var path = Path.Combine(Directory.GetCurrentDirectory(), "Templates", "Export.html");
            content = File.ReadAllText(path);
            /*
                var stream = this.GetType().Assembly.GetManifestResourceStream("BudgetPlanner.Templates.Export.html");
            
                using(var reader = new StreamReader(stream, Encoding.UTF8)) {
                    content = await reader.ReadToEndAsync();
                }
                */

            var template = Template.Parse(content);
            var context = new TemplateContext() {
                TryGetMember = this.TryGetMember,
                TryGetVariable = this.TryGetVariable,
                MemberFilter = x => false,
                MemberRenamer = x => ToCamelCase(x.Name),
            };

            var result = template.Render(context);
            return new MemoryStream(Encoding.UTF8.GetBytes(result));

            //throw new NotImplementedException("Not yet done");

            //            return new MemoryStream(package.GetAsByteArray());
        }

        private bool TryGetMember(TemplateContext context, SourceSpan span, object target, string member, out object value) {
            try {
                value = target?.GetType()
                    .GetProperties()
                    .Where(p => ToCamelCase(p.Name) == member)
                    .FirstOrDefault()
                    .GetValue(target);
                return true;
            } catch {
                value = null;
                return false;
            }
        }

        private bool TryGetVariable(TemplateContext context, SourceSpan span, ScriptVariable variable, out object value) {
            try {
                if (variable.Name == "default") {
                    value = Default;
                    return true;
                }
                if (variable.Name == "total") {
                    value = new Total();
                    return true;
                }

                if (variable.Name == "numberWithSeperator") {
                    value = new NumberWithSeperator();
                    return true;
                }

                value = this.data?.GetType()
                    .GetProperties()
                    .Where(p => ToCamelCase(p.Name) == variable.Name)
                    .FirstOrDefault()
                    .GetValue(this.data);
                return true;
            } catch {
                value = null;
                return false;
            }
        }

        private class NumberWithSeperator : IScriptCustomFunction {
            object IScriptCustomFunction.Invoke(TemplateContext context, ScriptNode callerContext, ScriptArray arguments, ScriptBlockStatement blockStatement) {
                var seperator = "'";
                var str = arguments[0].ToString();
                if (decimal.TryParse(str, out var dec)) {
                    return dec.ToString("#,##0.00").Replace(",", seperator);
                }
                return string.Empty;
            }
        }
        private class Total : IScriptCustomFunction {
            object IScriptCustomFunction.Invoke(TemplateContext context, ScriptNode callerContext, ScriptArray arguments, ScriptBlockStatement blockStatement) {
                return "Totals";
            }
        }

        private static Dictionary<string, object> Default = new Dictionary<string, object> { { "decimal", default(decimal) } };

        // Convert the string to camel case.
        public string ToCamelCase(string str) =>(str == null || str.Length < 2) ? str : Char.ToLowerInvariant(str[0]) + str.Substring(1);
    }
}