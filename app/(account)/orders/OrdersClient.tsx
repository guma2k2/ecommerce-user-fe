'use client';

import React from 'react';
import Link from 'next/link';
import { OrderListContainer } from '@/features/orders';
import { useAuthStore } from '@/shared/stores';
import { ROUTES } from '@/shared/constants';
import { buttonVariants, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { cn } from '@/lib/utils';

export function OrdersClient() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isInitializing = useAuthStore((state) => state.isInitializing);

  if (isInitializing) {
    return null;
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto py-16 text-center">
        <Card>
          <CardHeader>
            <CardTitle>Sign In Required</CardTitle>
            <CardDescription>
              Please sign in to view your orders and track shipments.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              href={`${ROUTES.AUTH.LOGIN}?redirect=${encodeURIComponent(ROUTES.ACCOUNT.ORDERS)}`}
              className={cn(buttonVariants(), 'w-full')}
            >
              Sign In to Continue
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <OrderListContainer />;
}
