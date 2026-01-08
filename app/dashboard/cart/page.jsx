"use client"

import { useState } from "react"
import { Trash2, Plus, Minus } from "lucide-react"
import Link from "next/link"
import Breadcrumb from "@/components/breadcrumb"

const MOCK_CART = [
  {
    id: 1,
    name: "Luxury Wingback Chair",
    price: 599.0,
    quantity: 2,
    image: "/luxury-wingback-chair.jpg",
  },
  {
    id: 2,
    name: "Oak Dining Table",
    price: 899.0,
    quantity: 1,
    image: "/oak-dining-table.jpg",
  },
]

export default function CartPage() {
  const [cartItems, setCartItems] = useState(MOCK_CART)

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = subtotal * 0.1
  const total = subtotal + tax

  const handleUpdateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      setCartItems(cartItems.filter((item) => item.id !== id))
    } else {
      setCartItems(cartItems.map((item) => (item.id === id ? { ...item, quantity } : item)))
    }
  }

  const handleRemoveItem = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id))
  }

  return (
    <div className="p-6 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Breadcrumb items={[{ label: "Cart" }]} />

      <h1 className="text-3xl font-bold text-[#2C1810]">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <p className="text-gray-500 mb-4">Your cart is empty</p>
          <Link href="/products" className="text-[#D4A574] hover:text-[#D4A574]/80 font-medium">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 flex gap-4">
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  className="h-24 w-24 rounded-lg object-cover bg-gray-100"
                />
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-semibold text-[#2C1810]">{item.name}</h3>
                    <p className="text-[#D4A574] font-medium">${item.price.toFixed(2)}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        className="p-1 hover:bg-gray-100 rounded-lg"
                      >
                        <Minus size={16} className="text-gray-600" />
                      </button>
                      <span className="w-8 text-center font-semibold">{item.quantity}</span>
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        className="p-1 hover:bg-gray-100 rounded-lg"
                      >
                        <Plus size={16} className="text-gray-600" />
                      </button>
                    </div>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-fit space-y-4">
            <h2 className="text-lg font-bold text-[#2C1810]">Order Summary</h2>
            <div className="space-y-2 border-b border-gray-200 pb-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax (10%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
            </div>
            <div className="flex justify-between text-lg font-bold text-[#2C1810]">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <Link
              href="/checkout"
              className="w-full bg-[#2C1810] hover:bg-[#2C1810]/90 text-white py-3 rounded-lg font-medium text-center transition-colors block"
            >
              Proceed to Checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
