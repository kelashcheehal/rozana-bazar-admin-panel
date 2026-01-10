"use client";

import { useClerk, useUser } from "@clerk/nextjs";
import { ArrowLeft, ShieldAlert } from "lucide-react";

export default function Page() {
  const { openSignIn, signOut } = useClerk();
  const { user, isLoaded } = useUser();

  const handleSignIn = async () => {
    if (!isLoaded) return;
    if (!user) return;
    await signOut();
    openSignIn({ redirectUrl: window.location.href });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-10 max-w-md w-full text-center border border-gray-200">
        <div className="mx-auto flex items-center justify-center w-20 h-20 rounded-full bg-red-100 mb-6">
          <ShieldAlert className="w-10 h-10 text-red-500" />
        </div>
        <h1 className="text-3xl font-bold text-[#2C1810] mb-3">
          {user ? `Hello ${user.firstName}, ` : "Guest"} <br /> Access Denied
        </h1>
        <p className="text-gray-600 text-sm leading-relaxed mb-6">
          You don't have permission to view this page.
        </p>
        <div className="flex flex-col gap-3">
          <button
            className="px-4 py-3 rounded-full bg-gray-100 text-[#2C1810] font-medium hover:bg-gray-200 transition"
            onClick={handleSignIn}
          >
            Sign In with Another Account
          </button>
        </div>
      </div>
    </div>
  );
}
