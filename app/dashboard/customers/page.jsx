"use client";

import { supabase } from "@/lib/supabaseClient";
import { useUser } from "@clerk/nextjs";
import { Filter, Mail, MoreHorizontal, Search, User } from "lucide-react";
import { useEffect, useState } from "react";

export default function CustomersPage() {
  const [users, setUsers] = useState([
    {
      id: 1,
      user_firstname: "John",
      user_lastname: "Doe",
      user_email: "john.doe@example.com",
      total_orders: 5,
      total_spent: "$100.00",
      status: "Active",
      lastOrder: "2023-04-01",
    },
    {
      id: 2,
      user_firstname: "Jane",
      user_lastname: "Smith",
      user_email: "jane.smith@example.com",
      total_orders: 3,
      total_spent: "$75.00",
      status: "Active",
      lastOrder: "2023-04-05",
    },
    {
      id: 3,
      user_firstname: "Mike",
      user_lastname: "Johnson",
      user_email: "mike.johnson@example.com",
      total_orders: 7,
      total_spent: "$150.00",
      status: "Inactive",
      lastOrder: "2023-04-10",
    },
    {
      id: 4,
      user_firstname: "Emily",
      user_lastname: "Williams",
      user_email: "emily.williams@example.com",
      total_orders: 2,
      total_spent: "$50.00",
      status: "Active",
      lastOrder: "2023-04-15",
    },
    {
      id: 5,
      user_firstname: "Michael",
      user_lastname: "Brown",
      user_email: "michael.brown@example.com",
      total_orders: 4,
      total_spent: "$100.00",
      status: "Active",
      lastOrder: "2023-04-20",
    },
  ]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
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

      {/* Search & Filter */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full sm:w-96">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
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
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
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
              {users.map((customer) => (
                <tr
                  key={customer.id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-[#D4A574]/10 flex items-center justify-center text-[#D4A574] font-bold">
                        {customer.user_firstname?.charAt(0) || "?"}
                      </div>
                      <div>
                        <div className="font-medium text-[#2C1810]">
                          {customer.user_firstname || "Unknown"}
                        </div>
                        <div className="text-xs text-gray-500">
                          {customer.user_email || "-"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                    {customer.total_orders || 0} orders
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-[#2C1810]">
                    {customer.total_spent || 0}
                  </td>
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
                      {customer.status || "Unknown"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {customer.lastOrder || "-"}
                  </td>
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
          <span className="text-sm text-gray-500">
            Showing 1 to {users.length} of {users.length} entries
          </span>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50">
              Previous
            </button>
            <button className="px-3 py-1 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
