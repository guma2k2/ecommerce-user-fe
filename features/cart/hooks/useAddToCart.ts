'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/shared/constants';
import { cartService } from '../services';
import type { AddToCartRequest, Cart } from '../types';

export function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AddToCartRequest) => cartService.addToCart(payload),
    onSuccess: (updatedCart: Cart) => {
      queryClient.setQueryData(queryKeys.cart.root, updatedCart);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.root });
    },
  });
}
