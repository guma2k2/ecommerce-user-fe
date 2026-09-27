'use client';

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/shared/constants';
import { searchService } from '../services';

export function useBestSellers(limit = 10) {
  return useQuery({
    queryKey: queryKeys.products.bestSellers(limit),
    queryFn: () => searchService.getBestSellers(limit),
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });
}
