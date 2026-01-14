"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

import StatsCard from "@/components/admin/stats-card";
import SalesChart from "@/components/admin/sales-chart";
import RecentOrders from "@/components/admin/recent-orders";
import TopProducts from "@/components/admin/top-products";

import { DollarSign, Users, ShoppingBag, Activity } from "lucide-react";
import { useProducts } from "@/lib/useProducts";

export default function DashboardPage() {
  const {data: products} = useProducts()
  console.log(products)
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4  duration-700 text-[#2C1810]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#2C1810]">
            Dashboard Overview
          </h1>
          <p className="text-gray-500">
            Welcome back, Admin. Here's what's happening today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">Last updated: Just now</span>
          <button className="bg-[#2C1810] text-[#D4A574] px-4 py-2 rounded-lg hover:bg-[#3e2216] transition-colors text-sm font-medium">
            Export Reports
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Revenue"
          value="$54,239"
          change="+12.5%"
          trend="up"
          icon={DollarSign}
          description="vs. last month"
        />
        <StatsCard
          title="Total Orders"
          value="1,253"
          change="+8.2%"
          trend="up"
          icon={ShoppingBag}
          description="vs. last month"
        />
        <StatsCard
          title="New Customers"
          value="342"
          change="-2.4%"
          trend="down"
          icon={Users}
          description="vs. last month"
        />
        <StatsCard
          title="Active Now"
          value="573"
          change="+24"
          trend="up"
          icon={Activity}
          description="users online"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SalesChart />
        </div>
        <div>
          <TopProducts />
        </div>
      </div>

      {/* Recent Orders */}
      <RecentOrders />
    </div>
  );
}
