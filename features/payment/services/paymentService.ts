import { httpRequest } from '@/shared/services';
import type { ApiResponse } from '@/shared/types';
import type {
  CheckoutSessionRequest,
  CheckoutSessionResponse,
  PaymentDetail,
  PaymentLedgerEntry,
  RefundPaymentRequest,
  RefundPaymentResponse,
} from '../types';

export const paymentService = {
  /**
   * Initiates a payment checkout session for an order
   * Endpoint: POST /api/v1/payments/checkout-session
   */
  createCheckoutSession: async (
    payload: CheckoutSessionRequest,
    idempotencyKey?: string
  ): Promise<CheckoutSessionResponse> => {
    const response = await httpRequest.post<ApiResponse<CheckoutSessionResponse>>(
      '/payments/checkout-session',
      payload,
      idempotencyKey
        ? {
            headers: {
              'Idempotency-Key': idempotencyKey,
            },
          }
        : undefined
    );
    return response.data.data;
  },

  /**
   * Retrieves payment details by payment ID
   * Endpoint: GET /api/v1/payments/{paymentId}
   */
  getPaymentDetail: async (paymentId: string): Promise<PaymentDetail> => {
    const response = await httpRequest.get<ApiResponse<PaymentDetail>>(
      `/payments/${encodeURIComponent(paymentId)}`
    );
    return response.data.data;
  },

  /**
   * Retrieves the list of payments belonging to the authenticated customer
   * Endpoint: GET /api/v1/payments
   */
  getPayments: async (): Promise<PaymentDetail[]> => {
    const response = await httpRequest.get<ApiResponse<PaymentDetail[]>>('/payments');
    return response.data.data;
  },

  /**
   * Retrieves audit ledger transaction entries for a payment
   * Endpoint: GET /api/v1/payments/{paymentId}/ledger
   */
  getPaymentLedger: async (paymentId: string): Promise<PaymentLedgerEntry[]> => {
    const response = await httpRequest.get<ApiResponse<PaymentLedgerEntry[]>>(
      `/payments/${encodeURIComponent(paymentId)}/ledger`
    );
    return response.data.data;
  },

  /**
   * Requests a full or partial refund for a completed payment
   * Endpoint: POST /api/v1/payments/{paymentId}/refund
   */
  requestRefund: async (
    paymentId: string,
    payload: RefundPaymentRequest,
    idempotencyKey?: string
  ): Promise<RefundPaymentResponse> => {
    const response = await httpRequest.post<ApiResponse<RefundPaymentResponse>>(
      `/payments/${encodeURIComponent(paymentId)}/refund`,
      payload,
      idempotencyKey
        ? {
            headers: {
              'Idempotency-Key': idempotencyKey,
            },
          }
        : undefined
    );
    return response.data.data;
  },
};
