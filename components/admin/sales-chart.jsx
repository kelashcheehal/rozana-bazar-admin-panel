"use client";
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
const defaultData = [
  { name: "Jan", value: 2400 },
  { name: "Feb", value: 1398 },
  { name: "Mar", value: 9800 },
  { name: "Apr", value: 3908 },
  { name: "May", value: 4800 },
  { name: "Jun", value: 3800 },
  { name: "Jul", value: 4300 },
];

export default function SalesChart({ data }) {
  const chartData = data && data.length > 0 ? data : defaultData;
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm h-full">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-[#2C1810]">Sales Overview</h3>
          <p className="text-sm text-gray-500">
            Revenue trends over the last 7 months
          </p>
        </div>
        <div className="relative">
          <Select>
            <SelectTrigger className="w-full h-12 px-4 py-3 border border-gray-300 bg-white rounded-lg shadow-sm hover:shadow-md focus:ring-2 focus:ring-[#D4A574] focus:border-[#D4A574] transition-all duration-200 text-left">
              <SelectValue
                placeholder="Select time period"
                className="text-gray-700 text-sm"
              />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-200 rounded-lg shadow-lg">
              <SelectItem
                value="last-7-months"
                className="px-4 py-2 hover:bg-gray-50 cursor-pointer transition-colors duration-150"
              >
                Last 7 Months
              </SelectItem>
              <SelectItem
                value="last-year"
                className="px-4 py-2 hover:bg-gray-50 cursor-pointer transition-colors duration-150"
              >
                Last Year
              </SelectItem>
              <SelectItem
                value="all-time"
                className="px-4 py-2 hover:bg-gray-50 cursor-pointer transition-colors duration-150"
              >
                All Time
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#D4A574" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#D4A574" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#f0f0f0"
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9ca3af", fontSize: 12 }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9ca3af", fontSize: 12 }}
              dx={-10}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#2C1810",
                border: "none",
                borderRadius: "8px",
                color: "#fff",
              }}
              itemStyle={{ color: "#D4A574" }}
              cursor={{
                stroke: "#D4A574",
                strokeWidth: 1,
                strokeDasharray: "5 5",
              }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="#D4A574"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorValue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
