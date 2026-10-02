import type { ShippingAddress, PaymentMethod } from '@/features/checkout/types';

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'SHIPPING'
  | 'DELIVERED'
  | 'CANCELLED';

export type PaymentStatus =
  | 'PENDING'
  | 'SUCCEEDED'
  | 'FAILED'
  | 'CANCELLED'
  | 'REFUNDED';

export interface OrderItemDetail {
  id: number;
  productVariantId: number;
  productName: string;
  sku: string;
  thumbnailUrl: string | null;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface OrderSummary {
  id: string;
  orderCode: string;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  totalAmount: number;
  totalItems: number;
  createdAt: string;
}

export interface OrderDetail {
  id: string;
  orderCode: string;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  totalAmount: number;
  shippingFee: number;
  shippingAddress: ShippingAddress;
  note?: string | null;
  createdAt: string;
  items: OrderItemDetail[];
}

export interface OrderFilterParams {
  pageNumber?: number;
  pageSize?: number;
  status?: OrderStatus | 'ALL';
}

export interface CheckoutSessionRequest {
  orderId: string;
  amount: number;
  currency: string;
}

export interface CheckoutSessionResponse {
  paymentId: number;
  sessionId: string;
  checkoutUrl: string;
}

export interface PaymentDetail {
  id: number;
  customerId: string;
  orderId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  method: PaymentMethod;
  stripeSessionId?: string | null;
  stripePaymentIntentId?: string | null;
  failureReason?: string | null;
  createdAt: string;
}
