using Microsoft.AspNetCore.Identity;
using Microsoft.WindowsAzure.Storage.Table;

namespace BudgetPlanner.Models {
    public class NamedValue {
        public string Name { get; set; }
        public decimal Value { get; set; }
    }

    public class ElementContainer<T> where T : new() {
        public string Name { get; set; }
        public T[] Elements { get; set; } = new [] { new T() };
    }

    public class Group<T> where T : new() {
        public ElementContainer<T>[] Positiv { get; set; } = new [] { new ElementContainer<T>() };
        public ElementContainer<T>[] Negativ { get; set; } = new [] { new ElementContainer<T>() };
    }
}