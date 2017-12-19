using System.Collections.Generic;

namespace BudgetPlanner.Models {
    public class Unit<T> where T : new() {
        public string Name { get; set; }
        public IEnumerable<T> Elements { get; set; } = new [] { new T() };
    }
}