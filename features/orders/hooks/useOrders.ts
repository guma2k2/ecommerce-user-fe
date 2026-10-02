'use client';

import { useQuery } from '@tanstack/react-query';
import { ordersListQueryOptions } from './orderQueries';
import type { OrderFilterParams } from '../types';

export function useOrders(params?: OrderFilterParams) {
  return useQuery(ordersListQueryOptions(params));
}
