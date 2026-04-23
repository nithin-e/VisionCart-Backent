const MonthlyTarget = () => {
  const percentage = 75.7;
  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="bg-card rounded-xl p-5 border border-border">
      <h3 className="text-foreground font-semibold text-base mb-4">Monthly Target</h3>

      <div className="flex justify-center mb-4">
        <div className="relative">
          <svg width="140" height="140" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="54" fill="none" stroke="hsl(228, 10%, 20%)" strokeWidth="8" />
            <circle
              cx="60" cy="60" r="54" fill="none"
              stroke="hsl(262, 83%, 58%)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              transform="rotate(-90 60 60)"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-foreground">{percentage}%</span>
            <span className="text-xs text-muted-foreground">32,500 Sales</span>
          </div>
        </div>
      </div>

      <h4 className="text-foreground font-semibold text-sm mb-3">Sales Status</h4>
      <div className="flex gap-1 mb-4 h-3 rounded-full overflow-hidden">
        <div className="bg-primary rounded-l-full" style={{ width: "75%" }} />
        <div className="bg-info" style={{ width: "22%" }} />
        <div className="bg-muted rounded-r-full" style={{ width: "3%" }} />
      </div>
      <div className="space-y-2">
        {[
          { label: "Paid", value: "75%", color: "bg-primary" },
          { label: "Cancelled", value: "22%", color: "bg-info" },
          { label: "Refunded", value: "3%", color: "bg-muted-foreground" },
        ].map((item) => (
          <div key={item.label} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-sm ${item.color}`} />
              <span className="text-muted-foreground">{item.label}</span>
            </div>
            <span className="text-foreground font-medium">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MonthlyTarget;
