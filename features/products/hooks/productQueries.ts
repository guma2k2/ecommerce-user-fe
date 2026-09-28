import { queryOptions } from '@tanstack/react-query';
import { queryKeys } from '@/shared/constants';
import { productService } from '../services';

export const productDetailQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: queryKeys.products.detail(slug),
    queryFn: () => productService.getProductBySlug(slug),
    staleTime: 5 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });
