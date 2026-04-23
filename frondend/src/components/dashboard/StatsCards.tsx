import { Wallet, ShoppingCart, TrendingUp, Target } from "lucide-react";

const stats = [
  {
    label: "Total Earning",
    value: "$12,354",
    change: "+12.4%",
    changeColor: "text-success",
    icon: Wallet,
    iconBg: "bg-primary/15",
    iconColor: "text-primary",
  },
  {
    label: "Total Orders",
    value: "10,654",
    change: "+18.2%",
    changeColor: "text-success",
    icon: ShoppingCart,
    iconBg: "bg-success/15",
    iconColor: "text-success",
  },
  {
    label: "Revenue Growth",
    value: "+18.5%",
    icon: TrendingUp,
    iconBg: "bg-warning/15",
    iconColor: "text-warning",
  },
  {
    label: "Conversion Rate",
    value: "7.6%",
    icon: Target,
    iconBg: "bg-destructive/15",
    iconColor: "text-destructive",
  },
];

const StatsCards = () => {
  return (
    <div className="grid grid-cols-4 gap-4">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <div key={i} className="bg-card rounded-xl p-5 border border-border">
            <div className={`w-12 h-12 rounded-xl ${stat.iconBg} flex items-center justify-center mb-4`}>
              <Icon className={`w-5 h-5 ${stat.iconColor}`} />
            </div>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <div className="flex items-end gap-2 mt-1">
              <span className="text-2xl font-bold text-foreground">{stat.value}</span>
              {stat.change && (
                <span className={`text-xs font-medium ${stat.changeColor} bg-success/10 px-2 py-0.5 rounded-full`}>
                  {stat.change}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCards;
