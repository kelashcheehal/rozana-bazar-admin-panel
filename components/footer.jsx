"use client"

import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[#2C1810] text-white py-6 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          {/* Logo & Info */}
          <div className="animate-in fade-in duration-500 hidden md:block">
            <h3 className="text-lg font-bold text-[#D4A574] tracking-widest">WOODEN BAZAR</h3>
            <p className="text-gray-400 text-xs">Premium Furniture</p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-wrap gap-6 text-sm">
            {["About", "Products", "Support", "Legal"].map((item) => (
              <a key={item} href="#" className="text-gray-300 hover:text-[#D4A574] transition-colors">
                {item}
              </a>
            ))}
          </div>

          {/* Social Links */}
          <div className="flex gap-3 animate-in fade-in duration-500 delay-100">
            {[
              { icon: Facebook, label: "Facebook" },
              { icon: Instagram, label: "Instagram" },
              { icon: Twitter, label: "Twitter" },
              { icon: Linkedin, label: "LinkedIn" },
            ].map(({ icon: Icon, label }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="w-8 h-8 rounded bg-[#D4A574]/10 border border-[#D4A574]/30 flex items-center justify-center text-[#D4A574] hover:bg-[#D4A574] hover:text-[#2C1810] transition-all duration-300 hover:scale-110"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>

          {/* Copyright */}
          <div className="text-xs text-gray-400 text-center md:text-right">
            <p>&copy; {currentYear} Wooden Bazar</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
