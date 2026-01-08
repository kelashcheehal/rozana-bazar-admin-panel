import { ArrowUpRight, ArrowDownRight } from "lucide-react"
import { cn } from "@/lib/utils"

export default function StatsCard({ title, value, change, trend, icon: Icon, description }) {
  const isUp = trend === "up"

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="text-2xl font-bold text-[#2C1810] mt-1 group-hover:scale-105 transition-transform origin-left">
            {value}
          </h3>
        </div>
        <div className="p-3 bg-[#FDF8F3] rounded-xl group-hover:bg-[#2C1810] transition-colors duration-300">
          <Icon className="w-5 h-5 text-[#D4A574]" />
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2">
        <div
          className={cn(
            "flex items-center text-xs font-medium px-2 py-1 rounded-full",
            isUp ? "text-green-700 bg-green-50" : "text-red-700 bg-red-50",
          )}
        >
          {isUp ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
          {change}
        </div>
        <p className="text-xs text-gray-400">{description}</p>
      </div>
    </div>
  )
}
