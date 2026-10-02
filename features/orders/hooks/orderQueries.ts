import { queryOptions } from '@tanstack/react-query';
import { queryKeys } from '@/shared/constants';
import { orderService, paymentService } from '../services';
import type { OrderFilterParams } from '../types';

export const ordersListQueryOptions = (params?: OrderFilterParams) =>
  queryOptions({
    queryKey: queryKeys.orders.list(params as Record<string, unknown> | undefined),
    queryFn: () => orderService.getOrders(params),
    staleTime: 60 * 1000,
  });

export const orderDetailQueryOptions = (orderId: string) =>
  queryOptions({
    queryKey: queryKeys.orders.detail(orderId),
    queryFn: () => orderService.getOrderDetail(orderId),
    staleTime: 30 * 1000,
    enabled: Boolean(orderId),
  });

export const paymentDetailQueryOptions = (paymentId: number | string) =>
  queryOptions({
    queryKey: queryKeys.payments.detail(paymentId),
    queryFn: () => paymentService.getPaymentDetail(paymentId),
    staleTime: 30 * 1000,
    enabled: Boolean(paymentId),
  });
