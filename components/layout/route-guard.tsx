'use client';

import { useAuth } from '@/hooks/useAuth';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const PUBLIC_ROUTES = ['/', '/signIn', '/signUp']; // Define your public routes here
const DEFAULT_AUTHENTICATED_ROUTE = '/platform'; // Where to send logged in users from public routes
const DEFAULT_PUBLIC_ROUTE = '/signIn'; // Sign in page

export function RouteGuard({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (isLoading) return; // Wait for auth to load

    const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

    // If logged in and on a public route (e.g. sign in page), redirect to platform/dashboard
    if (isLoggedIn && isPublicRoute && pathname !== '/') {
      router.replace(DEFAULT_AUTHENTICATED_ROUTE);
      setIsReady(false); // prevent rendering children while redirecting
    }
    // If not logged in and on a protected route, redirect to sign in page
    else if (!isLoggedIn && !isPublicRoute) {
      router.replace(DEFAULT_PUBLIC_ROUTE);
      setIsReady(false); // prevent rendering children while redirecting
    }
    // Otherwise, render children
    else {
      setIsReady(true);
    }
  }, [isLoggedIn, isLoading, pathname, router]);

  // While deciding route protection or redirecting, return null (no UI rendered)
  if (!isReady) return null;

  return <>{children}</>;
}
