"use client";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { SignedIn, SignedOut, SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { AlertTriangle, Bell, Moon, Search, ShoppingBag, Sun, User } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";


export default function Header() {
  const { user, isLoaded, isSignedIn } = useUser();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;
  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between gap-4">
        {/* Search */}
        <div
          onClick={() => document.dispatchEvent(new CustomEvent("open-command-menu"))}
          className="hidden md:flex items-center gap-3 max-w-md w-full bg-gray-100 rounded-full px-4 py-2 cursor-pointer hover:bg-gray-200 transition-all border border-transparent hover:border-gray-300"
        >
          <Search className="w-4 h-4 text-gray-500" />
          <span className="flex-1 text-sm text-gray-500">Search...</span>
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-white px-1.5 font-mono text-[10px] font-medium text-gray-500 opacity-100">
            <span className="text-xs">Ctrl K</span>
          </kbd>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4 ml-auto">
          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
          >
            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Notifications */}
          <Popover>
            <PopoverTrigger asChild>
              <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
              <div className="p-4 border-b border-gray-100">
                <h4 className="font-semibold text-[#2C1810]">Notifications</h4>
                <p className="text-xs text-gray-500">You have 3 unread messages</p>
              </div>
              <div className="max-h-[300px] overflow-y-auto">
                <div className="p-4 hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-50">
                  <div className="flex gap-3">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                      <ShoppingBag className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">New Order #1234</p>
                      <p className="text-xs text-gray-500">Just now</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-50">
                  <div className="flex gap-3">
                    <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">New Customer Registered</p>
                      <p className="text-xs text-gray-500">5 mins ago</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                  <div className="flex gap-3">
                    <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-800">Low Stock Alert: T-Shirt</p>
                      <p className="text-xs text-gray-500">1 hour ago</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-3 border-t border-gray-100 text-center">
                <button className="text-sm text-[#D4A574] hover:underline">Mark all as read</button>
              </div>
            </PopoverContent>
          </Popover>

          <div className="h-8 w-[1px] bg-gray-200 mx-1 hidden sm:block" />
          <div className="flex items-center gap-3 pl-2">
            {/* User info & badge if signed in */}
            <SignedIn>
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold text-[#2C1810]">
                    {user?.firstName || "Admin"} {user?.lastName || ""}
                  </p>
                  <p className="text-xs text-gray-500">
                    {user?.publicMetadata?.role || "Administrator"}
                  </p>
                </div>

                <div className="h-8 w-8 rounded-full bg-[#2C1810] text-[#D4A574] flex items-center justify-center border-2 border-[#D4A574] shadow-sm cursor-pointer hover:scale-105 transition-transform">
                  <UserButton />
                </div>
              </div>
            </SignedIn>

            {/* Sign-in button if not signed in */}
            <SignedOut>
              <SignInButton>
                <button className="px-3 py-1 rounded-lg bg-[#2C1810] text-[#D4A574] hover:bg-[#3a2114] transition-colors font-medium">
                  Login
                </button>
              </SignInButton>
            </SignedOut>
          </div>
        </div>
      </div>
    </header>
  );
}
