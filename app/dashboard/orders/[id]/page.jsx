"use client"

import { ArrowLeft, Package, MapPin, Phone, Mail } from "lucide-react"
import Link from "next/link"
import Breadcrumb from "@/components/breadcrumb"

const MOCK_ORDER = {
  id: "RZ2024001",
  date: "2024-01-15",
  status: "Shipped",
  total: 2497.0,
  items: [
    { id: 1, name: "Luxury Wingback Chair", price: 599.0, quantity: 2, image: "/luxury-wingback-chair.jpg" },
    { id: 2, name: "Oak Dining Table", price: 899.0, quantity: 1, image: "/oak-dining-table.jpg" },
  ],
  shipping: {
    name: "John Doe",
    email: "john@example.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main St, New York, NY 10001",
  },
  timeline: [
    { step: "Order Placed", date: "2024-01-15", completed: true },
    { step: "Processing", date: "2024-01-16", completed: true },
    { step: "Shipped", date: "2024-01-17", completed: true },
    { step: "Out for Delivery", date: "2024-01-19", completed: false },
    { step: "Delivered", date: null, completed: false },
  ],
}

export default function OrderDetailPage({ params }) {
  const order = MOCK_ORDER

  return (
    <div className="p-6 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Breadcrumb items={[{ label: "Orders", href: "/orders" }, { label: `Order ${order.id}` }]} />

      <Link
        href="/orders"
        className="inline-flex items-center gap-2 text-[#D4A574] hover:text-[#D4A574]/80 font-medium"
      >
        <ArrowLeft size={18} />
        Back to Orders
      </Link>

      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold text-[#2C1810]">Order {order.id}</h1>
          <p className="text-gray-600 mt-1">Placed on {new Date(order.date).toLocaleDateString()}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <p className="text-xs uppercase text-gray-500 font-semibold mb-1">Order Status</p>
            <p className="text-xl font-bold text-[#2C1810]">{order.status}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <p className="text-xs uppercase text-gray-500 font-semibold mb-1">Order Total</p>
            <p className="text-xl font-bold text-[#D4A574]">${order.total.toFixed(2)}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <p className="text-xs uppercase text-gray-500 font-semibold mb-1">Items</p>
            <p className="text-xl font-bold text-[#2C1810]">{order.items.length}</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <p className="text-xs uppercase text-gray-500 font-semibold mb-1">Order Date</p>
            <p className="text-xl font-bold text-[#2C1810]">{new Date(order.date).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Items & Timeline */}
        <div className="lg:col-span-2 space-y-6">
          {/* Items */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
            <h2 className="text-lg font-bold text-[#2C1810]">Order Items</h2>
            {order.items.map((item) => (
              <div key={item.id} className="flex gap-4 pb-4 border-b border-gray-100 last:pb-0 last:border-b-0">
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  className="h-20 w-20 rounded-lg object-cover bg-gray-100"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-[#2C1810]">{item.name}</h3>
                  <p className="text-gray-600 text-sm">Quantity: {item.quantity}</p>
                  <p className="text-[#D4A574] font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
            <h2 className="text-lg font-bold text-[#2C1810]">Delivery Timeline</h2>
            <div className="space-y-4">
              {order.timeline.map((event, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                        event.completed ? "bg-green-100 border-green-300" : "bg-gray-100 border-gray-300"
                      }`}
                    >
                      <Package className={`w-5 h-5 ${event.completed ? "text-green-600" : "text-gray-400"}`} />
                    </div>
                    {idx < order.timeline.length - 1 && (
                      <div className={`w-0.5 h-8 my-2 ${event.completed ? "bg-green-300" : "bg-gray-200"}`} />
                    )}
                  </div>
                  <div className="py-1">
                    <p className={`font-semibold ${event.completed ? "text-[#2C1810]" : "text-gray-500"}`}>
                      {event.step}
                    </p>
                    {event.date && <p className="text-sm text-gray-500">{new Date(event.date).toLocaleDateString()}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Shipping Information */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
            <h2 className="text-lg font-bold text-[#2C1810]">Shipping Address</h2>
            <div className="space-y-3">
              <div className="flex gap-2">
                <Phone size={18} className="text-[#D4A574] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium text-[#2C1810]">{order.shipping.phone}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Mail size={18} className="text-[#D4A574] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-[#2C1810]">{order.shipping.email}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <MapPin size={18} className="text-[#D4A574] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="font-medium text-[#2C1810]">{order.shipping.address}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
            <h2 className="text-lg font-bold text-[#2C1810]">Order Summary</h2>
            <div className="space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${(order.total * 0.909).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax</span>
                <span>${(order.total * 0.091).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-[#2C1810] border-t border-gray-200 pt-2">
                <span>Total</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
