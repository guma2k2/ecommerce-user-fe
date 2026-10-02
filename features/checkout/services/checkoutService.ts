import { httpRequest } from '@/shared/services';
import type { ApiResponse } from '@/shared/types';
import type { CreateOrderRequest, OrderCreateResponse } from '../types';

export const checkoutService = {
  /**
   * Creates an order from active cart or explicit items
   * Endpoint: POST /api/v1/orders
   */
  createOrder: async (payload: CreateOrderRequest): Promise<OrderCreateResponse> => {
    const response = await httpRequest.post<ApiResponse<OrderCreateResponse>>('/orders', payload);
    return response.data.data;
  },
};
