'use client';

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/shared/constants';
import { categoryService } from '../services';

export function useParentCategories() {
  return useQuery({
    queryKey: queryKeys.categories.parents(),
    queryFn: () => categoryService.getParentCategories(),
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}
