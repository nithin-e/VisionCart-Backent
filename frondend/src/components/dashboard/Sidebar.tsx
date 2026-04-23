import React, { useState } from "react";
import { LayoutDashboard, ShoppingBag, Box, Users, Ticket, Star, CreditCard, List, Briefcase, Layers, Image, Building, DollarSign, Package, Home, MessageSquare, FileText, HeadphonesIcon, Bell, BarChart3, Settings, Menu, X, Store } from "lucide-react";

const sections = [
  {
    header: "MAIN",
    items: [
      { label: "Dashboard", icon: LayoutDashboard, section: "dashboard" },
      { label: "Orders", icon: ShoppingBag, section: "orders" },
      { label: "Products", icon: Box, section: "products" },
      { label: "Customers", icon: Users, section: "customers" },
      { label: "Stores", icon: Building, section: "stores" },
    ],
  },
  {
    header: "STORE",
    items: [
      { label: "Category", icon: List, section: "category" },
      { label: "Collections", icon: Layers, section: "collections" },
      { label: "Brand", icon: Briefcase, section: "brand" },
      { label: "Banners", icon: Image, section: "banners" },
      { label: "Inventory", icon: Package, section: "inventory" },
      { label: "Try @ Home", icon: Home, section: "tryAtHome" },
      { label: "Franchise", icon: Store, section: "franchise" },
      { label: "Coupons", icon: Ticket, section: "coupons" },
      { label: "Reviews", icon: Star, section: "reviews" },
      { label: "Blogs", icon: FileText, section: "blogs" },
    ],
  },
  {
    header: "SUPPORT",
    items: [
      { label: "Support", icon: HeadphonesIcon, section: "support" },
      { label: "Notifications", icon: Bell, section: "notifications" },
      { label: "Reports", icon: BarChart3, section: "reports" },
    ],
  },
  {
    header: "FINANCE",
    items: [
      { label: "Payments", icon: DollarSign, section: "payments" },
      { label: "Settings", icon: Settings, section: "settings" },
    ],
  },
];

const Sidebar = ({ onSectionChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleNavClick = (section) => {
    onSectionChange && onSectionChange(section);
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-zinc-800 text-white rounded-lg"
      >
        <Menu className="w-6 h-6" />
      </button>

      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          h-screen w-64 bg-zinc-900 text-zinc-100 flex flex-col p-4
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          lg:translate-x-0
        `}
      >
        <div className="flex items-center justify-between mb-6 lg:mb-8">
          <div>
            <div className="font-bold text-xl">ShopAdmin</div>
            <div className="text-xs text-zinc-400">v2.4 · Store Panel</div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="lg:hidden p-2 hover:bg-zinc-800 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 flex flex-col gap-5 overflow-y-auto">
          {sections.map((section) => (
            <div key={section.header}>
              <div className="text-zinc-500 text-xs font-semibold mb-2">{section.header}</div>
              <ul className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  if (item.section) {
                    return (
                      <li key={item.label}>
                        <button
                          className="flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium w-full text-left text-zinc-300 hover:bg-zinc-800 hover:text-white"
                          onClick={() => handleNavClick(item.section)}
                        >
                          <Icon className="w-5 h-5" />
                          <span className="truncate">{item.label}</span>
                        </button>
                      </li>
                    );
                  }
                  return (
                    <li key={item.label}>
                      <a
                        href="#"
                        className="flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-sm font-medium text-zinc-300 hover:bg-zinc-800 hover:text-white"
                      >
                        <Icon className="w-5 h-5" />
                        <span className="truncate">{item.label}</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;