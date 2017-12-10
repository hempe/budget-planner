using System;
using Microsoft.WindowsAzure.Storage.Table;

namespace BudgetPlanner.Attributes {
    public class JsonDataAttribute : Attribute {
        public string PropertyName { get; }
        public JsonDataAttribute(string propertyName) {
            this.PropertyName = propertyName;
        }
    }
}