'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/shared/constants';
import { searchService } from '../services';
import type { ProductSearchParams, ProductSearchResult } from '../types';

export function useProductSearch(params: ProductSearchParams) {
  const query = useQuery<ProductSearchResult, Error>({
    queryKey: queryKeys.search.results(params as Record<string, unknown>),
    queryFn: () => searchService.searchProducts(params),
    placeholderData: keepPreviousData,
    staleTime: 30 * 1000, // 30 seconds
  });

  return {
    ...query,
    products: query.data?.products?.content ?? [],
    pagination: query.data?.products
      ? {
          pageNumber: query.data.products.pageNumber,
          pageSize: query.data.products.pageSize,
          totalPages: query.data.products.totalPages,
          totalElements: query.data.products.totalElements,
        }
      : null,
    facets: query.data?.facets ?? null,
  };
}
