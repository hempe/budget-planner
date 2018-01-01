using System;
using System.Linq;
using System.Reflection;
using System.Runtime.InteropServices;
using System.Text.RegularExpressions;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json.Serialization;

namespace BudgetPlanner.Middleware {
    public class FuzzyPropertyNameMatchingConverter : JsonConverter {
        public override bool CanConvert(Type objectType) {
            return objectType.Assembly == this.GetType().Assembly && objectType.GetConstructor(Type.EmptyTypes) != null;
        }

        public override bool CanWrite {
            get { return false; }
        }

        public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer) {
            var constructor = objectType.GetConstructor(Type.EmptyTypes);

            var instance = constructor.Invoke(null);
            var props = objectType.GetProperties().Select(x => new {
                Name = this.Simplify(x.Name),
                    Property = x
            }).ToArray();

            var jo = JObject.Load(reader);
            foreach (JProperty jp in jo.Properties()) {
                var name = this.Simplify(jp.Name);
                var prop = props.FirstOrDefault(pi =>
                    pi.Property.CanWrite && string.Equals(pi.Name, name, StringComparison.OrdinalIgnoreCase));

                if (prop != null)
                    prop.Property.SetValue(instance, jp.Value.ToObject(prop.Property.PropertyType, serializer));
            }

            return instance;
        }

        public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer) {
            throw new NotImplementedException();
        }

        private string Simplify(string name) {
            return Regex.Replace(name, "[^A-Za-z0-9]+", "")
                .ToLower()
                // this is needed because the old versions were missing the "e"
                .Replace("negative", "negativ")
                .Replace("positive", "positiv");
        }

    }
}