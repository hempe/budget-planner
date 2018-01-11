namespace BudgetPlanner.Models {
    public class DevelopmentElement {
        public string Group { get; set; }
        public string Name { get; set; }
        public string Type { get; set; }
        public int? Start { get; set; }
        public int? End { get; set; }
        public decimal Value { get; set; }
        public string SubType { get; set; }
        public string Id { get; set; }
    }
}