'use client';

import { useQuery } from '@tanstack/react-query';
import { productDetailQueryOptions } from './productQueries';

export function useProductDetail(slug: string) {
  return useQuery({
    ...productDetailQueryOptions(slug),
    enabled: Boolean(slug && slug.trim()),
  });
}

