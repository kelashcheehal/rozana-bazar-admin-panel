"use client"

import { useState } from "react"
import { Search, Filter, Mail, MoreHorizontal, User } from "lucide-react"

export default function CustomersPage() {
  // Mock Data
  const [customers] = useState([
    {
      id: 1,
      name: "Alex Morgan",
      email: "alex.m@example.com",
      orders: 12,
      spent: "$4,250.00",
      status: "Active",
      lastOrder: "2 hours ago",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah.j@example.com",
      orders: 5,
      spent: "$890.50",
      status: "Active",
      lastOrder: "1 day ago",
    },
    {
      id: 3,
      name: "Michael Brown",
      email: "michael.b@example.com",
      orders: 1,
      spent: "$129.00",
      status: "Inactive",
      lastOrder: "3 months ago",
    },
    {
      id: 4,
      name: "Emily Davis",
      email: "emily.d@example.com",
      orders: 8,
      spent: "$2,100.00",
      status: "Active",
      lastOrder: "5 hours ago",
    },
    {
      id: 5,
      name: "James Wilson",
      email: "james.w@example.com",
      orders: 3,
      spent: "$450.00",
      status: "Blocked",
      lastOrder: "1 week ago",
    },
  ])

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#2C1810]">Customers</h1>
          <p className="text-gray-500">Manage customer relationships</p>
        </div>
        <button className="bg-[#2C1810] hover:bg-[#2C1810]/90 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
          <User size={20} />
          <span>Add Customer</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search customers..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D4A574]/20 focus:border-[#D4A574]"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button className="px-4 py-2 border border-gray-200 rounded-lg flex items-center gap-2 text-gray-600 hover:bg-gray-50 transition-colors">
            <Filter size={18} />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Orders
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Total Spent
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Last Order
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-[#D4A574]/10 flex items-center justify-center text-[#D4A574] font-bold">
                        {customer.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium text-[#2C1810]">{customer.name}</div>
                        <div className="text-xs text-gray-500">{customer.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">{customer.orders} orders</td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-[#2C1810]">{customer.spent}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        customer.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : customer.status === "Inactive"
                            ? "bg-gray-100 text-gray-700"
                            : "bg-red-100 text-red-700"
                      }`}
                    >
                      {customer.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{customer.lastOrder}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-gray-400 hover:text-[#D4A574] transition-colors rounded-lg hover:bg-[#D4A574]/10">
                        <Mail size={18} />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100">
                        <MoreHorizontal size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
          <span className="text-sm text-gray-500">Showing 1 to 5 of 5 entries</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-gray-200 rounded-md text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50">
              Previous
            </button>
            <button className="px-3 py-1 border border-gray-200 rounded-md text-sm text-gray-600 hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
