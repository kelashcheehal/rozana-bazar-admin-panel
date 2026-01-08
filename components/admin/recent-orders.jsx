import { MoreHorizontal } from "lucide-react"

const orders = [
  {
    id: "#ORD-3201",
    customer: "Alex Morgan",
    product: "Premium Teak Sofa",
    amount: "$1,299.00",
    status: "Completed",
    date: "May 21, 2025",
  },
  {
    id: "#ORD-3202",
    customer: "Sarah Williams",
    product: "Outdoor Swing Chair",
    amount: "$850.00",
    status: "Processing",
    date: "May 21, 2025",
  },
  {
    id: "#ORD-3203",
    customer: "Michael Brown",
    product: "Wooden Dining Table",
    amount: "$2,100.00",
    status: "Pending",
    date: "May 20, 2025",
  },
  {
    id: "#ORD-3204",
    customer: "Emma Davis",
    product: "Study Desk Set",
    amount: "$450.00",
    status: "Completed",
    date: "May 19, 2025",
  },
  {
    id: "#ORD-3205",
    customer: "James Wilson",
    product: "Modern Bookshelf",
    amount: "$620.00",
    status: "Cancelled",
    date: "May 19, 2025",
  },
]

const statusStyles = {
  Completed: "bg-green-100 text-green-700",
  Processing: "bg-blue-100 text-blue-700",
  Pending: "bg-yellow-100 text-yellow-700",
  Cancelled: "bg-red-100 text-red-700",
}

export default function RecentOrders() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-6 flex items-center justify-between border-b border-gray-100">
        <div>
          <h3 className="text-lg font-bold text-[#2C1810]">Recent Orders</h3>
          <p className="text-sm text-gray-500">Manage and track your recent sales</p>
        </div>
        <button className="text-sm font-medium text-[#D4A574] hover:text-[#b38b5e] transition-colors">
          View All Orders
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-500 font-medium">
            <tr>
              <th className="px-6 py-4">Order ID</th>
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Product</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 font-medium text-[#2C1810]">{order.id}</td>
                <td className="px-6 py-4 text-gray-600">{order.customer}</td>
                <td className="px-6 py-4 text-gray-600">{order.product}</td>
                <td className="px-6 py-4 text-gray-500">{order.date}</td>
                <td className="px-6 py-4 font-medium text-[#2C1810]">{order.amount}</td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[order.status]}`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-[#2C1810] transition-colors">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
