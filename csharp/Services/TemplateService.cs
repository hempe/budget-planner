using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Scriban;
using Scriban.Parsing;
using Scriban.Runtime;
using Scriban.Syntax;

namespace BudgetPlanner.Services {
    public class TemplateService {

        I18n.TranslationService I18n;
        private string language;
        private object data;
        public TemplateService(I18n.TranslationService translationService) {
            I18n = translationService;
        }

        public string Render(string template, object data, string language = null) {
            this.language = language;
            this.data = data;

            var parsed = Template.Parse(template);
            var context = new TemplateContext() {
                TryGetMember = this.TryGetMember,
                TryGetVariable = this.TryGetVariable,
                MemberFilter = x => false,
                MemberRenamer = x => ToCamelCase(x.Name),
            };

            return parsed.Render(context);
        }

        public async Task<string> LoadTemplateAsync(string path) {
            var filePath = Path.Combine(Directory.GetCurrentDirectory(), path);
            if (File.Exists(filePath)) {
                return System.IO.File.ReadAllText(filePath);
            }

            var resource = $"BudgetPlanner.{string.Join(".", path.Split("/"))}";
            var stream = this.GetType().Assembly.GetManifestResourceStream(resource);
            using(var reader = new StreamReader(stream, Encoding.UTF8)) {
                return await reader.ReadToEndAsync();
            }
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

                if (variable.Name == "translate") {
                    value = new Translate(this.I18n, this.language);
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

        private class Translate : IScriptCustomFunction {
            private readonly I18n.TranslationService i18n;
            private readonly string lang;

            public Translate(I18n.TranslationService i18n, string lang) {
                this.i18n = i18n;
                this.lang = lang;
            }

            object IScriptCustomFunction.Invoke(TemplateContext context, ScriptNode callerContext, ScriptArray arguments, ScriptBlockStatement blockStatement) {
                var key = arguments[0].ToString();
                return this.i18n.TranslateAsync(this.lang, key).GetAwaiter().GetResult();
            }
        }

        public Dictionary<string, object> Default = new Dictionary<string, object> { { "decimal", default(decimal) } };

        // Convert the string to camel case.
        public string ToCamelCase(string str) =>(str == null || str.Length < 2) ? str : Char.ToLowerInvariant(str[0]) + str.Substring(1);
    }
}