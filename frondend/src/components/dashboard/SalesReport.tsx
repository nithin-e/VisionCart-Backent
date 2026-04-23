import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useState } from "react";

const data = [
  { month: "Jan", income: 30000, expenses: 18000 },
  { month: "Feb", income: 28000, expenses: 16000 },
  { month: "Mar", income: 35000, expenses: 20000 },
  { month: "Apr", income: 32000, expenses: 15000 },
  { month: "May", income: 40000, expenses: 18000 },
  { month: "Jun", income: 38000, expenses: 22000 },
  { month: "Jul", income: 45000, expenses: 20000 },
  { month: "Aug", income: 50000, expenses: 25000 },
  { month: "Sep", income: 48000, expenses: 22000 },
  { month: "Oct", income: 55000, expenses: 28000 },
  { month: "Nov", income: 60000, expenses: 26000 },
  { month: "Dec", income: 65000, expenses: 30000 },
];

const tabs = ["Today", "Week", "Month"];

const SalesReport = () => {
  const [activeTab, setActiveTab] = useState("Month");

  return (
    <div className="bg-card rounded-xl p-5 border border-border">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-foreground font-semibold text-base">Sales Report</h3>
        <div className="flex bg-secondary rounded-lg p-0.5">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeTab === tab ? "bg-card text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-8 mb-6">
        <div>
          <p className="text-2xl font-bold text-foreground">
            $87,352<span className="text-primary">50</span>
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-muted-foreground">Average Income</span>
            <span className="text-xs text-success font-medium">+12.4%</span>
          </div>
        </div>
        <div>
          <p className="text-2xl font-bold text-foreground">
            $97,500<span className="text-destructive">50</span>
          </p>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-muted-foreground">Average Expenses</span>
            <span className="text-xs text-destructive font-medium">-7.3%</span>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(262, 83%, 58%)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(262, 83%, 58%)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(228, 10%, 20%)" />
          <XAxis dataKey="month" tick={{ fill: "hsl(228, 10%, 55%)", fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: "hsl(228, 10%, 55%)", fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${v / 1000}K`} />
          <Tooltip
            contentStyle={{ backgroundColor: "hsl(228, 12%, 14%)", border: "1px solid hsl(228, 10%, 20%)", borderRadius: 8, color: "hsl(0, 0%, 95%)" }}
          />
          <Area type="monotone" dataKey="income" stroke="hsl(262, 83%, 58%)" fill="url(#incomeGrad)" strokeWidth={2} />
          <Area type="monotone" dataKey="expenses" stroke="hsl(0, 84%, 60%)" fill="url(#expenseGrad)" strokeWidth={2} />
          <Legend
            formatter={(value: string) => <span className="text-xs text-muted-foreground capitalize">{value}</span>}
            iconType="circle"
            iconSize={8}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesReport;
