'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { queryKeys, ROUTES } from '@/shared/constants';
import { checkoutService } from '../services';
import type { CreateOrderRequest, OrderCreateResponse } from '../types';

export function useCreateOrder() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: CreateOrderRequest) => checkoutService.createOrder(payload),
    onSuccess: (data: OrderCreateResponse) => {
      // Clear / invalidate cart cache since items are now ordered
      queryClient.invalidateQueries({ queryKey: queryKeys.cart.root });
      // Invalidate orders list cache
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });

      if (data.paymentMethod === 'STRIPE' && data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        router.push(
          `${ROUTES.SHOP.CHECKOUT_SUCCESS}?order_code=${encodeURIComponent(data.orderCode)}&order_id=${encodeURIComponent(data.orderId)}`
        );
      }
    },
  });
}
