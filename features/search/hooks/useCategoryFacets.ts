'use client';

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/shared/constants';
import { searchService } from '../services';
import type { SearchFacets } from '../types';

export function useCategoryFacets(categoryId?: number) {
  const query = useQuery<SearchFacets, Error>({
    queryKey: queryKeys.search.facets(categoryId ?? 0),
    queryFn: () => searchService.getCategoryFacets(categoryId!),
    enabled: typeof categoryId === 'number' && categoryId > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes cache for static category facets
  });

  return {
    ...query,
    facets: query.data ?? null,
  };
}
