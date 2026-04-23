import { Search, Sun, Moon, Mail, Bell, Calendar } from "lucide-react";
import { useTheme } from "./ThemeProvider";

const TopBar = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <div className="h-14 md:h-16 flex items-center justify-between px-4 md:px-6 border-b border-border">
      <div className="flex items-center gap-2 md:gap-4">
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search anything's"
            className="bg-secondary text-foreground placeholder:text-muted-foreground pl-10 pr-4 py-2 rounded-lg text-sm w-48 md:w-64 border-none outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        <div className="hidden md:flex items-center gap-2 bg-secondary px-4 py-2 rounded-full">
          <span className="text-sm text-foreground font-medium">Today New Leads</span>
          <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-full">27</span>
        </div>
        
        <button onClick={toggleTheme} className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground">
          {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
        <button className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground">
          <Mail className="w-4 h-4" />
        </button>
        <button className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground">
          <Bell className="w-4 h-4" />
        </button>
        <div className="flex items-center gap-2">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-medium text-foreground">Robert Brown</p>
            <p className="text-xs text-muted-foreground">Manager</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-primary/30 flex items-center justify-center text-primary font-semibold text-sm">
            RB
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;