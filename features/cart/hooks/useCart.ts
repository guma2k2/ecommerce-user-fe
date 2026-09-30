'use client';

import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/shared/stores';
import { cartQueryOptions } from './cartQueries';

export function useCart() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const query = useQuery({
    ...cartQueryOptions(),
    enabled: isAuthenticated,
  });

  return {
    ...query,
    cart: query.data,
    items: query.data?.items ?? [],
    totalQuantity: query.data?.totalQuantity ?? 0,
    totalPrice: query.data?.totalPrice ?? 0,
    isEmpty: !query.data?.items || query.data.items.length === 0,
    isAuthenticated,
  };
}
