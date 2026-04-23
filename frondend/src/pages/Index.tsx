import Sidebar from "@/components/dashboard/Sidebar";
import TopBar from "@/components/dashboard/TopBar";
import StatsCards from "@/components/dashboard/StatsCards";
import SalesReport from "@/components/dashboard/SalesReport";
import MonthlyTarget from "@/components/dashboard/MonthlyTarget";
import SalesByCountry from "@/components/dashboard/SalesByCountry";
import OrdersTable from "@/components/dashboard/OrdersTable";
import ProductsTable from "@/components/dashboard/ProductsTable";
import CustomersTable from "@/components/dashboard/CustomersTable";
import CategoryTable from "@/components/dashboard/CategoryTable";
import CollectionTable from "@/components/dashboard/CollectionTable";
import BannerTable from "@/components/dashboard/BannerTable";
import StoreTable from "@/components/dashboard/StoreTable";
import PaymentTable from "@/components/dashboard/PaymentTable";
import InventoryTable from "@/components/dashboard/InventoryTable";
import CouponTable from "@/components/dashboard/CouponTable";
import TryAtHomeTable from "@/components/dashboard/TryAtHomeTable";
import ReviewTable from "@/components/dashboard/ReviewTable";
import BlogTable from "@/components/dashboard/BlogTable";
import FranchiseTable from "@/components/dashboard/FranchiseTable";
import SupportTable from "@/components/dashboard/SupportTable";
import NotificationTable from "@/components/dashboard/NotificationTable";
import ReportTable from "@/components/dashboard/ReportTable";
import SettingsTable from "@/components/dashboard/SettingsTable";
import BrandTable from "@/components/dashboard/BrandTable";
import { ThemeProvider } from "@/components/dashboard/ThemeProvider";
import { Home, ChevronRight } from "lucide-react";
import React, { useState } from "react";


const Index = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  return (
    <ThemeProvider>
      <div className="flex h-screen overflow-hidden">
        <Sidebar onSectionChange={setActiveSection} />
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          <TopBar />
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
            {activeSection === "dashboard" && (
              <>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Home className="w-4 h-4" />
                  <span>Home</span>
                  <ChevronRight className="w-3 h-3" />
                  <span className="text-foreground">Sales Dashboard</span>
                </div>
                <StatsCards />
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                  <div className="lg:col-span-7">
                    <SalesReport />
                  </div>
                  <div className="lg:col-span-5 xl:col-span-2">
                    <MonthlyTarget />
                  </div>
                  <div className="lg:col-span-5 xl:col-span-3">
                    <SalesByCountry />
                  </div>
                </div>
              </>
            )}
            {activeSection === "orders" && <OrdersTable />}
            {activeSection === "products" && <ProductsTable />}
            {activeSection === "customers" && <CustomersTable />}
            {activeSection === "category" && <CategoryTable />}
            {activeSection === "collections" && <CollectionTable />}
            {activeSection === "banners" && <BannerTable />}
            {activeSection === "stores" && <StoreTable />}
            {activeSection === "payments" && <PaymentTable />}
            {activeSection === "inventory" && <InventoryTable />}
            {activeSection === "coupons" && <CouponTable />}
            {activeSection === "tryAtHome" && <TryAtHomeTable />}
            {activeSection === "reviews" && <ReviewTable />}
            {activeSection === "blogs" && <BlogTable />}
            {activeSection === "franchise" && <FranchiseTable />}
            {activeSection === "support" && <SupportTable />}
            {activeSection === "notifications" && <NotificationTable />}
            {activeSection === "reports" && <ReportTable />}
            {activeSection === "settings" && <SettingsTable />}
            {activeSection === "brand" && <BrandTable />}
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Index;
