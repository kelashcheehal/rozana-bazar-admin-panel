"use client";

import { useUser } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

/**
 * Protects routes for specific roles
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components to render if authorized
 * @param {string[]} props.allowedRoles - Array of roles allowed to access the route
 * @param {string[]} [props.protectedPaths] - Optional array of paths to protect (defaults to ['/dashboard'])
 * @param {string} [props.redirectPath] - Optional redirect path for unauthorized access (defaults to '/unauthorized')
 */
export default function ProtectedRoute({
  children,
  allowedRoles = ["admin"],
  protectedPaths = ["/dashboard"],
  redirectPath = "/unauthorized",
}) {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  // Memoize user role to avoid recomputation
  const userRole = useMemo(() => user?.publicMetadata?.role, [user]);

  // Memoize whether the current path should be protected
  const shouldProtectPath = useMemo(
    () => protectedPaths.some((path) => pathname.startsWith(path)),
    [protectedPaths, pathname]
  );

  // Memoize authorization check to prevent unnecessary recalculations
  const isAuthorized = useMemo(() => {
    if (!isLoaded || !isSignedIn) return false;
    if (!allowedRoles.includes(userRole)) return false;
    if (shouldProtectPath && !allowedRoles.includes(userRole)) return false;
    return true;
  }, [isLoaded, isSignedIn, userRole, allowedRoles, shouldProtectPath]);

  useEffect(() => {
    if (!isLoaded) return;

    if (!isAuthorized && pathname !== redirectPath) {
      router.replace(redirectPath);
    } else {
      setLoading(false);
    }
  }, [isLoaded, isAuthorized, pathname, redirectPath, router]);

  // Show loading state while Clerk loads or checking authorization
  if (loading || !isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-4"></div>
          <p className="text-gray-500">Checking permissions...</p>
        </div>
      </div>
    );
  }

  // Only render children if authorized and not on redirect path
  if (!isAuthorized || pathname === redirectPath) {
    return null;
  }

  return <>{children}</>;
}
