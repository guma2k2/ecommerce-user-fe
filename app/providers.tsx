'use client';

import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useAuthStore } from '@/shared/stores';
import { authService, customerProfileService } from '@/features/auth';

function AuthInitializer({ children }: { children: React.ReactNode }) {
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const setUserProfile = useAuthStore((state) => state.setUserProfile);
  const setInitializing = useAuthStore((state) => state.setInitializing);

  useEffect(() => {
    let isMounted = true;

    async function initialize() {
      try {
        const token = await authService.refreshToken();
        if (token && isMounted) {
          setAccessToken(token);
          try {
            const profile = await customerProfileService.getMyProfile();
            if (isMounted) {
              setUserProfile(profile);
            }
          } catch (profileErr) {
            console.warn('Failed to load profile on auth initialization:', profileErr);
          }
        }
      } catch {
        // Expected for guest users without active refresh_token cookie
      } finally {
        if (isMounted) {
          setInitializing(false);
        }
      }
    }

    initialize();

    return () => {
      isMounted = false;
    };
  }, [setAccessToken, setUserProfile, setInitializing]);

  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AuthInitializer>{children}</AuthInitializer>
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}
