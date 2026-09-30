'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/shared/constants';
import { cartService } from '../services';
import type { Cart } from '../types';

export function useClearCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => cartService.clearCart(),

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: queryKeys.cart.root });
      const previousCart = queryClient.getQueryData<Cart>(queryKeys.cart.root);

      queryClient.setQueryData<Cart>(queryKeys.cart.root, {
        items: [],
        totalQuantity: 0,
        totalPrice: 0,
      });

      return { previousCart };
    },

    onError: (_err, _variables, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(queryKeys.cart.root, context.previousCart);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.root });
    },
  });
}
