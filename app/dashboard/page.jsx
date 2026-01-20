"use client";

import { Skeleton } from "@/components/Skeleton";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { Activity, DollarSign, ShoppingBag, Users } from "lucide-react";
import dynamic from "next/dynamic";

// Dynamically import charts with loading skeletons
const StatsCard = dynamic(() => import("@/components/admin/stats-card"), {
  loading: () => <Skeleton className="h-32 w-full rounded-2xl" />,
});
const SalesChart = dynamic(() => import("@/components/admin/sales-chart"), {
  loading: () => <Skeleton className="h-[400px] w-full rounded-2xl" />,
});
const RecentOrders = dynamic(() => import("@/components/admin/recent-orders"), {
  loading: () => <Skeleton className="h-[400px] w-full rounded-2xl" />,
});
const TopProducts = dynamic(() => import("@/components/admin/top-products"), {
  loading: () => <Skeleton className="h-[400px] w-full rounded-2xl" />,
});

export default function DashboardPage() {
  const { data, isLoading } = useDashboardStats();
  const stats = data?.stats;
  const recentOrders = data?.recentOrders;
  const chartData = data?.chartData;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 text-[#2C1810]">
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
        {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-32 w-full rounded-2xl" />
            ))
        ) : (
            <>
                <StatsCard
                title="Total Revenue"
                value={formatCurrency(stats?.revenue.value || 0)}
                change={stats?.revenue.change}
                trend={stats?.revenue.trend}
                icon={DollarSign}
                description="vs. last month"
                />
                <StatsCard
                title="Total Orders"
                value={stats?.orders.value.toLocaleString()}
                change={stats?.orders.change}
                trend={stats?.orders.trend}
                icon={ShoppingBag}
                description="vs. last month"
                />
                <StatsCard
                title="New Customers"
                value={stats?.customers.value.toLocaleString()}
                change={stats?.customers.change}
                trend={stats?.customers.trend}
                icon={Users}
                description="vs. last month"
                />
                <StatsCard
                title="Active Now"
                value={stats?.active.value}
                change={stats?.active.change}
                trend={stats?.active.trend}
                icon={Activity}
                description="users online"
                />
            </>
        )}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SalesChart data={chartData} />
        </div>
        <div>
          <TopProducts />
        </div>
      </div>

      {/* Recent Orders */}
      <RecentOrders orders={recentOrders} />
    </div>
  );
}
