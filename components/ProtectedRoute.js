"use client";

import { useUser } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * Protects all /dashboard routes for admins only
 */
export default function ProtectedRoute({ children, allowedRoles = ["admin"] }) {
  const { isSignedIn, user } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isSignedIn === undefined) return; // wait for Clerk

    // Not signed in
    if (!isSignedIn) {
      router.replace("/unauthorized");
      return;
    }

    // Role check
    const role = user?.publicMetadata?.role;
    if (!allowedRoles.includes(role)) {
      router.replace("/unauthorized");
      return;
    }

    // Block all non-admin /dashboard routes if needed
    if (!pathname.startsWith("/dashboard")) {
      router.replace("/unauthorized");
      return;
    }
    

    setLoading(false);
  }, [isSignedIn, user, router, pathname, allowedRoles]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Checking permissions...</p>
      </div>
    );

  return <>{children}</>;
}
