const countries = [
  { name: "America", products: "4,265", flag: "🇺🇸" },
  { name: "China", products: "3,740", flag: "🇨🇳" },
  { name: "Germany", products: "2,980", flag: "🇩🇪" },
  { name: "Japan", products: "1,640", flag: "🇯🇵" },
];

const SalesByCountry = () => {
  return (
    <div className="bg-card rounded-xl p-5 border border-border">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-foreground font-semibold text-base">Sales by Country</h3>
        <button className="text-xs text-primary font-medium hover:underline">View All</button>
      </div>
      <div className="mb-5">
        <span className="text-2xl font-bold text-foreground">$45,314</span>
        <span className="text-xs text-muted-foreground ml-2">+8.2% vs last month</span>
      </div>
      <div className="space-y-4">
        {countries.map((c) => (
          <div key={c.name} className="flex items-center gap-3">
            <span className="text-2xl">{c.flag}</span>
            <div>
              <p className="text-foreground font-semibold text-sm">{c.name}</p>
              <p className="text-xs text-muted-foreground">
                <span className="text-foreground font-bold">{c.products}</span> Products
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SalesByCountry;
