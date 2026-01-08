"use client";
import { useState, useMemo } from "react";
import { Search, Download } from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function OrdersPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");

  // Fake data
  const orders = [
    {
      id: 101,
      customer_name: "John Doe",
      created_at: "2026-01-02T10:00:00Z",
      order_items: [{ name: "Product 1" }, { name: "Product 2" }],
      total: 120.5,
      status: "Processing",
      payment_status: "Paid",
      payment_method: "Credit Card",
    },
    {
      id: 102,
      customer_name: "Jane Smith",
      created_at: "2026-01-01T14:30:00Z",
      order_items: [{ name: "Product 3" }],
      total: 75.0,
      status: "Shipped",
      payment_status: "Unpaid",
      payment_method: "Cash on Delivery",
    },
    {
      id: 103,
      customer_name: "Alice Johnson",
      created_at: "2025-12-30T09:15:00Z",
      order_items: [
        { name: "Product 4" },
        { name: "Product 5" },
        { name: "Product 6" },
      ],
      total: 200.0,
      status: "Delivered",
      payment_status: "Paid",
      payment_method: "PayPal",
    },
    {
      id: 104,
      customer_name: "Bob Williams",
      created_at: "2025-12-29T11:45:00Z",
      order_items: [],
      total: 0,
      status: "Cancelled",
      payment_status: "Unpaid",
      payment_method: "N/A",
    },
  ];

  // Badge styles
  const statusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-700";
      case "processing":
        return "bg-blue-100 text-blue-700";
      case "shipped":
        return "bg-purple-100 text-purple-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const paymentStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "paid":
        return "bg-green-100 text-green-700";
      case "unpaid":
        return "bg-red-100 text-red-700";
      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  // Filtered orders based on search, status, and payment
  const filteredOrders = useMemo(() => {
    return orders
      .filter((o) =>
        search
          ? o.customer_name.toLowerCase().includes(search.toLowerCase()) ||
            o.id.toString().includes(search)
          : true
      )
      .filter((o) =>
        statusFilter === "all" ? true : o.status.toLowerCase() === statusFilter
      )
      .filter((o) =>
        paymentFilter === "all"
          ? true
          : o.payment_status.toLowerCase() === paymentFilter
      );
  }, [orders, search, statusFilter, paymentFilter]);

  // Compute summary counts based on filtered orders
  const paymentSummary = useMemo(() => {
    const summary = { paid: 0, unpaid: 0 };
    filteredOrders.forEach((o) => {
      const status = o.payment_status?.toLowerCase();
      if (status === "paid") summary.paid += 1;
      else if (status === "unpaid") summary.unpaid += 1;
    });
    return summary;
  }, [filteredOrders]);

  return (
    <div className="space-y-6 text-[#2C1810]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Orders</h1>
          <p className="text-gray-500 text-sm">Track and manage orders</p>
        </div>
        <button className="bg-white border px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm hover:bg-gray-50">
          <Download size={20} />
          <span className="text-sm font-medium">Export</span>
        </button>
      </div>

      {/* Search + Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border flex flex-col sm:flex-row gap-4 justify-between items-center">
        {/* Search */}
        <div className="relative w-full sm:w-96">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search orders..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm placeholder-gray-400"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-4">
          {/* Order Status Filter */}
          <div className="relative w-32">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full h-12 px-4 py-3 border border-gray-300 bg-white rounded-lg shadow-sm hover:shadow-md focus:ring-2 focus:ring-[#D4A574] focus:border-[#D4A574] transition-all duration-200 text-left">
                <SelectValue
                  placeholder="All Status"
                  className="text-gray-700 text-sm capitalize"
                />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 rounded-lg shadow-lg">
                {["all", "processing", "shipped", "delivered", "cancelled"].map(
                  (s) => (
                    <SelectItem
                      key={s}
                      value={s}
                      className="px-4 py-2 hover:bg-gray-50 cursor-pointer capitalize"
                    >
                      {s}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Payment Status Filter */}
          <div className="relative w-30">
            <Select value={paymentFilter} onValueChange={setPaymentFilter}>
              <SelectTrigger className="w-full h-12 px-4 py-3 border border-gray-300 bg-white rounded-lg shadow-sm hover:shadow-md focus:ring-2 focus:ring-[#D4A574] focus:border-[#D4A574] transition-all duration-200 text-left">
                <SelectValue
                  placeholder="All Payments"
                  className="text-gray-700 text-sm capitalize"
                />
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 rounded-lg shadow-lg">
                {["all", "paid", "unpaid"].map((s) => (
                  <SelectItem
                    key={s}
                    value={s}
                    className="px-4 py-2 hover:bg-gray-50 cursor-pointer capitalize"
                  >
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Payment Summary */}
      <div className="flex gap-4">
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
          Paid: {paymentSummary.paid}
        </span>
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
          Unpaid: {paymentSummary.unpaid}
        </span>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                {[
                  "Order ID",
                  "Customer",
                  "Date",
                  "Items",
                  "Total",
                  "Status",
                  "Update",
                  "Payment",
                  "Method",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-6 py-4 text-left text-xs font-semibold"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-4">
                    No orders found.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-sm">
                      #{order.id}
                    </td>
                    <td className="px-6 py-4 text-sm">{order.customer_name}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(order.created_at).toISOString().split("T")[0]}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {order.order_items?.length || 0} items
                    </td>
                    <td className="px-6 py-4 font-medium text-sm">
                      ${order.total}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyle(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="relative">
                        <Select
                          value={order.status.toLowerCase()}
                          onValueChange={(value) =>
                            console.log(`Update order ${order.id} to ${value}`)
                          }
                        >
                          <SelectTrigger className="w-full h-12 px-4 py-3 border border-gray-300 bg-white rounded-lg shadow-sm hover:shadow-md focus:ring-2 focus:ring-[#D4A574] focus:border-[#D4A574] transition-all duration-200 text-left">
                            <SelectValue
                              placeholder="Select status"
                              className="text-gray-700 text-sm capitalize"
                            />
                          </SelectTrigger>
                          <SelectContent className="bg-white border border-gray-200 rounded-lg shadow-lg">
                            {[
                              "processing",
                              "shipped",
                              "delivered",
                              "cancelled",
                            ].map((s) => (
                              <SelectItem
                                key={s}
                                value={s}
                                className="px-4 py-2 hover:bg-gray-50 cursor-pointer capitalize"
                              >
                                {s}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${paymentStyle(
                          order.payment_status
                        )}`}
                      >
                        {order.payment_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {order.payment_method}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
