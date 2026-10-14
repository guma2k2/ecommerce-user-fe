import type { PaymentMethod } from '@/shared/types';

export type { PaymentMethod };

export type PaymentStatus =
  | 'PENDING'
  | 'SUCCEEDED'
  | 'FAILED'
  | 'CANCELLED'
  | 'PARTIALLY_REFUNDED'
  | 'REFUNDED';

export type LedgerEntryType =
  | 'INITIALIZATION'
  | 'CAPTURE'
  | 'REFUND'
  | 'CHARGEBACK'
  | 'FEE'
  | 'ADJUSTMENT';

export type LedgerBalanceType = 'DEBIT' | 'CREDIT';

export interface CheckoutSessionRequest {
  orderId?: string;
  amount: number;
  currency: string;
  paymentMethod: PaymentMethod;
  returnUrl?: string;
  cancelUrl?: string;
}

export interface CheckoutSessionResponse {
  paymentId: string;
  sessionId: string;
  checkoutUrl: string;
}

export interface PaymentDetail {
  id: string;
  customerId: string;
  orderId: string;
  amount: number;
  refundedAmount: number;
  currency: string;
  status: PaymentStatus;
  method: PaymentMethod;
  gatewaySessionId?: string | null;
  gatewayTransactionId?: string | null;
  failureReason?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaymentLedgerEntry {
  id: string;
  paymentId: string;
  orderId: string;
  entryType: LedgerEntryType;
  balanceType: LedgerBalanceType;
  amount: number;
  currency: string;
  gatewayProvider: PaymentMethod;
  gatewayTransactionId?: string | null;
  idempotencyKey?: string | null;
  metadata?: string | null;
  createdAt: string;
}

export interface RefundPaymentRequest {
  amount: number;
  reason?: string;
}

export interface RefundPaymentResponse {
  successful: boolean;
  gatewayRefundId: string;
  refundedAmount: number;
  failureReason?: string | null;
}

export type PaymentErrorCode =
  | 'payment_not_found'
  | 'payment_method_not_supported'
  | 'refund_amount_exceeds_payment'
  | 'concurrent_payment_request'
  | 'idempotency_key_required'
  | 'payment_already_processed'
  | 'stripe_checkout_failed'
  | 'payment_gateway_error'
  | 'bad_request'
  | 'unauthenticated'
  | 'unauthorized'
  | string;
