'use client';

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/shared/constants';
import { productService } from '../services';

export function useProductDetail(slug: string) {
  return useQuery({
    queryKey: queryKeys.products.detail(slug),
    queryFn: () => productService.getProductBySlug(slug),
    enabled: Boolean(slug && slug.trim()),
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });
}
