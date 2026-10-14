import type { ShippingAddress, PaymentMethod } from '@/shared/types';

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
  | 'PARTIALLY_REFUNDED'
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
