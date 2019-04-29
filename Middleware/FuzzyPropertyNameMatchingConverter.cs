using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text.RegularExpressions;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace BudgetPlanner.Middleware
{
    public class FuzzyPropertyNameMatchingConverter : JsonConverter
    {
        public override bool CanConvert(Type objectType)
            => objectType.Assembly == this.GetType().Assembly && objectType.GetConstructor(Type.EmptyTypes) != null;
    
        public override bool CanWrite => false;

        public override object ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
        {
            var constructor = objectType.GetConstructor(Type.EmptyTypes);
            var instance = constructor.Invoke(null);

            if (reader.ValueType.IsSimple())
                return reader.Value;

            var properties = objectType.GetProperties().ToDictionary(x => this.Simplify(x.Name), x => x);

            foreach (var jProperty in JObject.Load(reader).Properties())
            {
                var property = this.FindBestMatch(properties, jProperty.Name, 3);
                if (property == null)
                    continue;

                if (property.PropertyType.IsArray && !(jProperty.Value is JArray))
                {
                    this.ParseDictionaryAsListByType(
                        property.PropertyType.GetElementType(),
                        jProperty,
                        serializer,
                        property,
                        instance
                    );
                }
                else
                {
                    property.SetValue(instance, jProperty.Value.ToObject(property.PropertyType, serializer));
                }
            }
            return instance;
        }

        private PropertyInfo FindBestMatch(Dictionary<string, PropertyInfo> properties, string name, int maxDistance)
        {

            PropertyInfo prop = null;
            int distance = Int32.MaxValue;
            var search = this.Simplify(name);

            foreach (var kv in properties)
            {
                if (kv.Key.Equals(search))
                    return kv.Value;
                
                var d = kv.Key.LevenshteinDistance(search);
                if (0 < d && d < distance && d < maxDistance)
                {
                    d = distance;
                    prop = kv.Value;
                }
            }

            return prop;
        }

        private void ParseDictionaryAsListByType(Type elementType, JProperty jp, JsonSerializer serializer, PropertyInfo prop, object instance)
            => this.InvokePrivateGeneric<object>(nameof(ParseDictionaryAsList), elementType, jp, serializer, prop, instance);
        
        private void ParseDictionaryAsList<TElement>(JProperty jp, JsonSerializer serializer, PropertyInfo prop, object instance)
        {
            var surogateValue = (Dictionary<string, object>)jp.Value.ToObject(typeof(Dictionary<string, object>), serializer);
            if(surogateValue == null)
                return;
                
            var value = surogateValue
                .Where(kv => int.TryParse(kv.Key.ToString(), out _))
                .Select(x => x.Value as JObject)
                .Where(x => x != null)
                .Select(x => x.ToObject<TElement>())
                .ToArray();
            prop.SetValue(instance, value);
        }

        public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer) =>
            throw new NotImplementedException();

        public bool IsGenericArray(Type type) => type.IsGenericType && type.IsArray;

        private string Simplify(string name) => Regex.Replace(name, "[^A-Za-z0-9]+", "").ToLowerInvariant();
    }
}