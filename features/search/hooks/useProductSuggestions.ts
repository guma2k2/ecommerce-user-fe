'use client';

import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/shared/constants';
import { useDebounce } from '@/shared/hooks';
import { searchService } from '../services';
import type { ProductSuggestionItem } from '../types';

export function useProductSuggestions(keyword: string, limit = 5, debounceMs = 300) {
  const debouncedKeyword = useDebounce(keyword, debounceMs);
  const trimmed = debouncedKeyword.trim();

  const query = useQuery<ProductSuggestionItem[], Error>({
    queryKey: queryKeys.search.suggestions(trimmed, limit),
    queryFn: () => searchService.getSuggestions(trimmed, limit),
    enabled: trimmed.length >= 1,
    staleTime: 60 * 1000, // Cache suggestions for 1 minute
  });

  return {
    ...query,
    suggestions: query.data ?? [],
    debouncedKeyword: trimmed,
  };
}
