"use client";

import { useUser } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    // Clerk is still loading
    if (!isLoaded) {
      return;
    }

    const checkAuthorization = () => {
      // Not signed in
      if (!isSignedIn) {
        return false;
      }

      // Role check
      const userRole = user?.publicMetadata?.role;
      if (!allowedRoles.includes(userRole)) {
        return false;
      }

      // Check if current path requires protection
      const shouldProtectPath = protectedPaths.some((path) =>
        pathname.startsWith(path)
      );

      // If accessing protected path, only allow authorized roles
      if (shouldProtectPath && !allowedRoles.includes(userRole)) {
        return false;
      }

      return true;
    };

    const authorized = checkAuthorization();
    setIsAuthorized(authorized);

    if (!authorized && isLoaded) {
      // Prevent redirect loop
      if (pathname !== redirectPath) {
        router.replace(redirectPath);
      }
    } else {
      setLoading(false);
    }
  }, [
    isLoaded,
    isSignedIn,
    user,
    router,
    pathname,
    allowedRoles,
    protectedPaths,
    redirectPath,
  ]);

  // Show loading state while checking
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-4"></div>
          <p className="text-gray-500">Checking permissions...</p>
        </div>
      </div>
    );
  }

  // Only render children if authorized and not redirecting
  if (!isAuthorized || pathname === redirectPath) {
    return null;
  }

  return <>{children}</>;
}
