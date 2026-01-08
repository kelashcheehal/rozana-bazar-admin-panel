"use client";
// import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
// import { UserButton, useUser } from "@clerk/nextjs";
import { Bell, Search } from "lucide-react";
export default function Header() {
  // const { user, isLoaded, isSignedIn } = useUser();
  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between gap-4">
        {/* Search */}
        <div className="hidden md:flex items-center max-w-md w-full bg-gray-100 rounded-full px-4 py-2 focus-within:ring-2 focus-within:ring-[#D4A574]/20 transition-all">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search orders, products, or customers..."
            className="flex-1 bg-transparent border-none outline-none px-3 text-sm text-[#2C1810] placeholder:text-gray-400"
          />
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4 ml-auto">
          <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          </button>
          <div className="h-8 w-[1px] bg-gray-200 mx-1 hidden sm:block" />
          <div className="flex items-center gap-3 pl-2">
            {/* User info & badge if signed in */}
            {/* <SignedIn>
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
            </SignedIn> */}

            {/* Sign-in button if not signed in */}
            {/* <SignedOut>
              <SignInButton>
                <button className="px-3 py-1 rounded-md bg-[#2C1810] text-[#D4A574] hover:bg-[#3a2114] transition-colors font-medium">
                  Login
                </button>
              </SignInButton>
            </SignedOut> */}
          </div>
        </div>
      </div>
    </header>
  );
}
