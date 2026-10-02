import type { Metadata } from 'next';
import { Suspense } from 'react';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient } from '@/shared/utils';
import {
  orderDetailQueryOptions,
  OrderDetailContainer,
  OrderDetailSkeleton,
} from '@/features/orders';

interface OrderDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: OrderDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Order Details | Storefront`,
    description: `Track and review delivery status and ordered items for order ${id}.`,
  };
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = await params;
  const queryClient = getQueryClient();

  // Prefetch order detail on the server using TanStack Query v5 queryClient.query()
  await queryClient.query(orderDetailQueryOptions(id)).catch(() => {});

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense fallback={<OrderDetailSkeleton />}>
        <OrderDetailContainer orderId={id} />
      </Suspense>
    </HydrationBoundary>
  );
}
