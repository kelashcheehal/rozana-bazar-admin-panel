"use client";

import "@/app/globals.css";
import Header from "@/components/admin/header";
import Sidebar from "@/components/admin/sidebar";
import ProtectedRoute from "@/components/ProtectedRoute";
import { Jost } from "next/font/google";
import { useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const jost = Jost({
  subsets: ["latin"],
  variable: "--font-sans",
});
export default function AdminLayout({ children }) {
  const [queryClient] = useState(() => new QueryClient());

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  return (
    <ProtectedRoute>
      <QueryClientProvider client={queryClient}>
        <QueryClientProvider client={queryClient}>
          <div
            className={`${jost.variable} font-sans antialiased min-h-screen`}
          >
            {/* Main flex container for desktop */}
            <div className="flex h-screen bg-[#F5F5F5">
              {/* Desktop sidebar */}
              <div className="hidden lg:flex lg:w-72">
                <Sidebar isDesktop />
              </div>

              {/* Main content */}
              <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <main className="flex-1 overflow-y-auto no-scrollbar p-6 bg-[#ffffff]">
                  {children}
                </main>
              </div>
            </div>

            {/* Mobile sidebar (outside flex container so it can overlay content) */}
            <div className="lg:hidden">
              <Sidebar />
            </div>
          </div>
        </QueryClientProvider>
      </QueryClientProvider>
    </ProtectedRoute>
  );
}
