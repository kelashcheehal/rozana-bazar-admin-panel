"use client";

import { Jost } from "next/font/google";
import Sidebar from "@/components/admin/sidebar";
import Header from "@/components/admin/header";
import "@/app/globals.css";
import ProtectedRoute from "@/components/ProtectedRoute";

const jost = Jost({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function AdminLayout({ children }) {
  return (
    <ProtectedRoute>
      <div className={`${jost.variable} font-sans antialiased min-h-screen`}>
        {/* Main flex container for desktop */}
        <div className="flex h-screen bg-gray-50">
          {/* Desktop sidebar */}
          <div className="hidden lg:flex lg:w-72">
            <Sidebar isDesktop />
          </div>

          {/* Main content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header />
            <main className="flex-1 overflow-y-auto no-scrollbar p-6 bg-gray-50">
              {children}
            </main>
          </div>
        </div>

        {/* Mobile sidebar (outside flex container so it can overlay content) */}
        <div className="lg:hidden">
          <Sidebar />
        </div>
      </div>
    </ProtectedRoute>
  );
}
