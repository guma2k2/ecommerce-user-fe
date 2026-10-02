import { httpRequest } from '@/shared/services';
import type { ApiResponse, PageResponse } from '@/shared/types';
import type { OrderDetail, OrderFilterParams, OrderSummary } from '../types';

export const orderService = {
  /**
   * Retrieves a paginated list of orders placed by the authenticated customer
   * Endpoint: GET /api/v1/orders
   */
  getOrders: async (params?: OrderFilterParams): Promise<PageResponse<OrderSummary>> => {
    const queryParams: Record<string, unknown> = {};

    if (params?.pageNumber !== undefined) {
      queryParams.pageNumber = params.pageNumber;
    }
    if (params?.pageSize !== undefined) {
      queryParams.pageSize = params.pageSize;
    }
    if (params?.status && params.status !== 'ALL') {
      queryParams.status = params.status;
    }

    const response = await httpRequest.get<ApiResponse<PageResponse<OrderSummary>>>(
      '/orders',
      { params: queryParams }
    );
    return response.data.data;
  },

  /**
   * Retrieves full details of a specific order
   * Endpoint: GET /api/v1/orders/{orderId}
   */
  getOrderDetail: async (orderId: string): Promise<OrderDetail> => {
    const response = await httpRequest.get<ApiResponse<OrderDetail>>(
      `/orders/${encodeURIComponent(orderId)}`
    );
    return response.data.data;
  },

  /**
   * Cancels a pending order
   * Endpoint: PUT /api/v1/orders/{orderId}/cancel
   */
  cancelOrder: async (orderId: string): Promise<void> => {
    await httpRequest.put<ApiResponse<null>>(
      `/orders/${encodeURIComponent(orderId)}/cancel`
    );
  },
};
