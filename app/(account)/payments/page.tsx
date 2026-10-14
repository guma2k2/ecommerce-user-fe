import type { Metadata } from 'next';
import { Suspense } from 'react';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/shared/utils';
import {
  paymentsListQueryOptions,
  PaymentListContainer,
} from '@/features/payment';
import { Skeleton } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Payments & Transactions | Storefront',
  description: 'View your transaction charges, ledger audit records, and payment history.',
};

export default async function PaymentsPage() {
  const queryClient = getQueryClient();

  // Prefetch customer payments list on the server using TanStack Query v5 queryClient.query()
  await queryClient.query(paymentsListQueryOptions()).catch(() => {});

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense
        fallback={
          <div className="max-w-5xl mx-auto space-y-4">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-28 w-full" />
          </div>
        }
      >
        <PaymentListContainer />
      </Suspense>
    </HydrationBoundary>
  );
}
