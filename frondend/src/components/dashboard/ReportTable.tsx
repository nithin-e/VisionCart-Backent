import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import { Search, Download, TrendingUp, Users, ShoppingCart, DollarSign, Calendar, BarChart3, PieChart, ArrowUp, ArrowDown, Package, Eye } from "lucide-react";
import { reportsApi } from "@/api/reports";

const ReportTable = () => {
  const [activeTab, setActiveTab] = useState("sales");
  const [dateRange, setDateRange] = useState("7days");
  const [loading, setLoading] = useState(false);
  const [salesData, setSalesData] = useState({});
  const [userData, setUserData] = useState({});

  const fetchSalesData = async () => {
    try {
      setLoading(true);
      console.log("Fetching sales data for:", dateRange);
      const response = await reportsApi.getSales({ period: dateRange });
      console.log("Sales response:", response);
      setSalesData(response?.data || {});
    } catch (error) {
      console.error("Error fetching sales:", error);
      toast.error(error.message || 'Failed to fetch sales data');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await reportsApi.getUsers({ period: dateRange });
      console.log("Users response:", response);
      setUserData(response?.data || {});
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchSalesData();
    fetchUserData();
  }, [dateRange]);

  const sales = salesData || {};
  const users = userData || {};

  const tabs = [
    { id: "sales", label: "Sales", icon: TrendingUp },
    { id: "users", label: "Users", icon: Users },
    { id: "products", label: "Products", icon: Package },
  ];

  return (
    <div className="bg-zinc-900 rounded-xl p-6 w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Reports & Analytics</h2>
          <p className="text-sm text-zinc-400">Comprehensive business insights</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 rounded-lg bg-zinc-800 text-white border border-zinc-700 focus:border-blue-500 focus:outline-none"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
            <option value="year">This Year</option>
          </select>
          <button className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      <div className="flex border-b border-zinc-800 mb-6">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 text-sm font-medium capitalize flex items-center gap-2 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "text-blue-400 border-blue-400"
                  : "text-zinc-400 border-transparent hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === "sales" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-zinc-800 p-5 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-zinc-400 text-sm">Total Sales</span>
                <TrendingUp className="w-4 h-4 text-green-400" />
              </div>
              <div className="text-2xl font-bold text-white">₹{(sales.totalSales || 0).toLocaleString()}</div>
              <div className="flex items-center gap-1 mt-1 text-green-400 text-xs">
                <ArrowUp className="w-3 h-3" />
                <span>+12.5% from last period</span>
              </div>
            </div>
            <div className="bg-zinc-800 p-5 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-zinc-400 text-sm">Total Orders</span>
                <ShoppingCart className="w-4 h-4 text-blue-400" />
              </div>
              <div className="text-2xl font-bold text-white">{sales.totalOrders || 0}</div>
              <div className="flex items-center gap-1 mt-1 text-green-400 text-xs">
                <ArrowUp className="w-3 h-3" />
                <span>+8.3% from last period</span>
              </div>
            </div>
            <div className="bg-zinc-800 p-5 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-zinc-400 text-sm">Avg Order Value</span>
                <DollarSign className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-2xl font-bold text-white">₹{sales.averageOrderValue || 0}</div>
              <div className="flex items-center gap-1 mt-1 text-red-400 text-xs">
                <ArrowDown className="w-3 h-3" />
                <span>-3.2% from last period</span>
              </div>
            </div>
          </div>

          <div className="bg-zinc-800 p-5 rounded-lg">
            <h3 className="text-white font-semibold mb-4">Sales by Category</h3>
            <div className="space-y-3">
              {(sales.salesByCategory || []).map((cat) => {
                const percentage = sales.totalSales ? (cat.sales / sales.totalSales) * 100 : 0;
                return (
                  <div key={cat.name}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-zinc-300">{cat.name}</span>
                      <span className="text-white font-medium">₹{cat.sales.toLocaleString()}</span>
                    </div>
                    <div className="h-2 bg-zinc-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-zinc-800 p-5 rounded-lg">
            <h3 className="text-white font-semibold mb-4">Sales by Payment Method</h3>
            <div className="grid grid-cols-3 gap-4">
              {(sales.salesByPayment || []).map((pm) => (
                <div key={pm.method} className="bg-zinc-700 p-4 rounded-lg">
                  <div className="text-zinc-400 text-sm mb-1">{pm.method}</div>
                  <div className="text-xl font-bold text-white">{pm.count}</div>
                  <div className="text-green-400 text-sm">₹{pm.amount.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "users" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-zinc-800 p-5 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-zinc-400 text-sm">Total Users</span>
                <Users className="w-4 h-4 text-blue-400" />
              </div>
              <div className="text-2xl font-bold text-white">{users.totalUsers || 0}</div>
              <div className="flex items-center gap-1 mt-1 text-green-400 text-xs">
                <ArrowUp className="w-3 h-3" />
                <span>+15% from last month</span>
              </div>
            </div>
            <div className="bg-zinc-800 p-5 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-zinc-400 text-sm">New Users</span>
                <Users className="w-4 h-4 text-green-400" />
              </div>
              <div className="text-2xl font-bold text-white">{users.newUsers || 0}</div>
              <div className="flex items-center gap-1 mt-1 text-green-400 text-xs">
                <ArrowUp className="w-3 h-3" />
                <span>+22% from last month</span>
              </div>
            </div>
            <div className="bg-zinc-800 p-5 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-zinc-400 text-sm">Active Users</span>
                <Eye className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-2xl font-bold text-white">{users.activeUsers || 0}</div>
              <div className="flex items-center gap-1 mt-1 text-green-400 text-xs">
                <ArrowUp className="w-3 h-3" />
                <span>+8% from last month</span>
              </div>
            </div>
          </div>

          <div className="bg-zinc-800 p-5 rounded-lg">
            <h3 className="text-white font-semibold mb-4">User Segments</h3>
            <div className="grid grid-cols-4 gap-4">
              {(users.userSegments || []).map((seg) => (
                <div key={seg.segment} className="bg-zinc-700 p-4 rounded-lg text-center">
                  <div className="text-zinc-400 text-sm mb-1">{seg.segment}</div>
                  <div className="text-xl font-bold text-white">{seg.count}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "products" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-zinc-800 p-5 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-zinc-400 text-sm">Total Products</span>
                <Package className="w-4 h-4 text-blue-400" />
              </div>
              <div className="text-2xl font-bold text-white">{productData.totalProducts}</div>
            </div>
            <div className="bg-zinc-800 p-5 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-zinc-400 text-sm">Out of Stock</span>
                <TrendingUp className="w-4 h-4 text-red-400" />
              </div>
              <div className="text-2xl font-bold text-red-400">{productData.outOfStock}</div>
            </div>
            <div className="bg-zinc-800 p-5 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-zinc-400 text-sm">Low Stock</span>
                <TrendingUp className="w-4 h-4 text-yellow-400" />
              </div>
              <div className="text-2xl font-bold text-yellow-400">{productData.lowStock}</div>
            </div>
          </div>

          <div className="bg-zinc-800 p-5 rounded-lg">
            <h3 className="text-white font-semibold mb-4">Top Selling Products</h3>
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-semibold text-zinc-400 border-b border-zinc-700">
                  <th className="pb-2">Product</th>
                  <th className="pb-2">Units Sold</th>
                  <th className="pb-2">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {productData.topProducts.map((product, idx) => (
                  <tr key={product.name} className="border-b border-zinc-700/50">
                    <td className="py-3 text-white">{product.name}</td>
                    <td className="py-3 text-zinc-300">{product.sales}</td>
                    <td className="py-3 text-green-400 font-medium">₹{product.revenue.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportTable;