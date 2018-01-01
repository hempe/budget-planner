using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json;

namespace BudgetPlanner.Models {
    public class Unit<T> : ISum where T : ISum, new() {
        public string Name { get; set; }
        public T[] Elements { get; set; } = new [] { new T() };

        [JsonIgnore]
        public decimal Sum {
            get => this.Elements?.Select(x => x.Sum).Sum() ?? default(decimal);
        }
    }
}