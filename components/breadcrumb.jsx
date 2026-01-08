"use client"

import Link from "next/link"
import { ChevronRight } from "lucide-react"

export default function Breadcrumb({ items = [] }) {
  return (
    <nav className="flex items-center gap-1 text-sm text-gray-600 mb-6">
      <Link href="/admin/dashboard" className="hover:text-[#D4A574] transition-colors">
        Dashboard
      </Link>
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-1">
          <ChevronRight size={16} className="text-gray-400" />
          {item.href ? (
            <Link href={item.href} className="hover:text-[#D4A574] transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-[#2C1810] font-medium">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  )
}
