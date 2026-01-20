import { PredictiveChart } from "@/components/admin/predictive-chart";
import { ArrowUpRight, TrendingUp, Users } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-[#2C1810]">
          Smart Analytics
        </h1>
        <p className="text-gray-500">AI-powered insights and forecasting for your store.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg border border-gray-100 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-500">Predicted Revenue</span>
            <TrendingUp className="w-4 h-4 text-green-500" />
          </div>
          <div className="flex items-end gap-2">
            <h3 className="text-2xl font-bold text-[#2C1810] dark:text-[#D4A574]">$12,450</h3>
            <span className="text-xs text-green-600 mb-1">+15% vs last month</span>
          </div>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg border border-gray-100 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-500">Customer Lifetime Value</span>
            <Users className="w-4 h-4 text-[#D4A574]" />
          </div>
          <div className="flex items-end gap-2">
            <h3 className="text-2xl font-bold text-[#2C1810] dark:text-[#D4A574]">$850</h3>
            <span className="text-xs text-green-600 mb-1">+5% vs avg</span>
          </div>
        </div>
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg border border-gray-100 dark:border-zinc-800 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-500">Conversion Rate</span>
            <ArrowUpRight className="w-4 h-4 text-blue-500" />
          </div>
          <div className="flex items-end gap-2">
            <h3 className="text-2xl font-bold text-[#2C1810] dark:text-[#D4A574]">3.2%</h3>
            <span className="text-xs text-red-500 mb-1">-0.1% vs last week</span>
          </div>
        </div>
      </div>

      {/* Charts */}
      <PredictiveChart />

    </div>
  );
}
