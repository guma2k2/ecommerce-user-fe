'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/shared/constants';
import { cartService } from '../services';
import { calculateCartTotals } from '../utils';
import type { Cart, UpdateCartItemParams } from '../types';

export function useUpdateCartQuantity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ cartId, quantity }: UpdateCartItemParams) =>
      cartService.updateQuantity(cartId, { quantity }),

    onMutate: async ({ cartId, quantity }: UpdateCartItemParams) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.cart.root });
      const previousCart = queryClient.getQueryData<Cart>(queryKeys.cart.root);

      if (previousCart) {
        const nextItems = previousCart.items.map((item) => {
          if (item.cartId === cartId) {
            return {
              ...item,
              quantity,
              subtotal: item.variant.price * quantity,
            };
          }
          return item;
        });

        const { totalQuantity, totalPrice } = calculateCartTotals(nextItems);

        queryClient.setQueryData<Cart>(queryKeys.cart.root, {
          items: nextItems,
          totalQuantity,
          totalPrice,
        });
      }

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
