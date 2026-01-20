"use client";

import {
    Area,
    AreaChart,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from "recharts";

const data = [
  { month: "Jan", revenue: 4000, projected: 4000 },
  { month: "Feb", revenue: 3000, projected: 3000 },
  { month: "Mar", revenue: 5000, projected: 5000 },
  { month: "Apr", revenue: 2780, projected: 2780 },
  { month: "May", revenue: 1890, projected: 1890 },
  { month: "Jun", revenue: 2390, projected: 2390 },
  { month: "Jul", revenue: 3490, projected: 3490 },
  { month: "Aug", revenue: 4200, projected: 4200 },
  // Projected Future Data
  { month: "Sep", revenue: null, projected: 5100 },
  { month: "Oct", revenue: null, projected: 5800 },
  { month: "Nov", revenue: null, projected: 6400 },
  { month: "Dec", revenue: null, projected: 7200 },
];

export function PredictiveChart() {
  return (
    <div className="w-full h-[400px] bg-white dark:bg-zinc-900 rounded-lg p-4 border border-gray-100 dark:border-zinc-800 shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-[#2C1810] dark:text-[#D4A574]">Revenue Forecast (AI Powered)</h3>
        <p className="text-sm text-gray-500">Projected revenue growth based on historical data.</p>
      </div>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2C1810" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#2C1810" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorProjected" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#D4A574" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#D4A574" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
          <XAxis 
            dataKey="month" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#6B7280", fontSize: 12 }}
            dy={10}
          />
          <YAxis 
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#6B7280", fontSize: 12 }}
            tickFormatter={(value) => `$${value}`}
            dx={-10}
          />
          <Tooltip 
            contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
            formatter={(value) => [`$${value}`, ""]}
          />
          <Legend />
          <Area
            type="monotone"
            dataKey="revenue"
            stroke="#2C1810"
            fillOpacity={1}
            fill="url(#colorRevenue)"
            strokeWidth={2}
            name="Actual Revenue"
          />
          <Area
            type="monotone"
            dataKey="projected"
            stroke="#D4A574"
            strokeDasharray="5 5"
            fillOpacity={1}
            fill="url(#colorProjected)"
            strokeWidth={2}
            name="Projected Revenue"
            connectNulls
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
