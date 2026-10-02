import { httpRequest } from '@/shared/services';
import type { ApiResponse } from '@/shared/types';
import type {
  CheckoutSessionRequest,
  CheckoutSessionResponse,
  PaymentDetail,
} from '../types';

export const paymentService = {
  /**
   * Creates a stand-alone Stripe checkout session for an order
   * Endpoint: POST /api/v1/payments/checkout-session
   */
  createCheckoutSession: async (
    payload: CheckoutSessionRequest
  ): Promise<CheckoutSessionResponse> => {
    const response = await httpRequest.post<ApiResponse<CheckoutSessionResponse>>(
      '/payments/checkout-session',
      payload
    );
    return response.data.data;
  },

  /**
   * Retrieves payment record details
   * Endpoint: GET /api/v1/payments/{paymentId}
   */
  getPaymentDetail: async (paymentId: number | string): Promise<PaymentDetail> => {
    const response = await httpRequest.get<ApiResponse<PaymentDetail>>(
      `/payments/${encodeURIComponent(String(paymentId))}`
    );
    return response.data.data;
  },
};
