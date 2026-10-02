'use client';

import { useQuery } from '@tanstack/react-query';
import { orderDetailQueryOptions } from './orderQueries';

export function useOrderDetail(orderId: string) {
  return useQuery(orderDetailQueryOptions(orderId));
}
