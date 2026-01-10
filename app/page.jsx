"use client";

import { useClerk, useUser } from "@clerk/nextjs";
import { ArrowRight } from "lucide-react";
import { ArrowLeft, ShieldAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  const router = useRouter();
  const { openSignIn, signOut } = useClerk();
  const { user, isLoaded } = useUser();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded) return; // wait until Clerk loads

    if (!user) {
      // Not logged in → open login modal
      signOut().then(() => openSignIn());
    } else {
      // Logged-in user → check role from Clerk public metadata
      const role = user.publicMetadata?.role;

      if (role === "admin") {
        // Admin → redirect to dashboard
        router.replace("/dashboard");
      } else {
        // Non-admin → stay on Access Denied
        setLoading(false);
      }
    }
  }, [user, isLoaded, router, openSignIn, signOut]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Checking permissions...</p>
      </div>
    );

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
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-full bg-gray-100 text-[#2C1810] font-medium hover:bg-gray-200 transition"
            onClick={() => signOut().then(() => openSignIn())}
          >
            Sign In with Another Account <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
