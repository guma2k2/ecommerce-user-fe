import { queryOptions } from '@tanstack/react-query';
import { queryKeys } from '@/shared/constants';
import { cartService } from '../services';

export const cartQueryOptions = () =>
  queryOptions({
    queryKey: queryKeys.cart.root,
    queryFn: () => cartService.getCart(),
    staleTime: 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
