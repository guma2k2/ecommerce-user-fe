export type PaymentMethod = 'COD' | 'STRIPE';

export interface ShippingAddress {
  receiverName: string;
  receiverPhone: string;
  shippingAddress: string;
  city: string;
  district: string;
  postalCode: string;
}

export interface CreateOrderItem {
  productVariantId: number;
  quantity: number;
}

export interface CreateOrderRequest {
  fromCart: boolean;
  paymentMethod: PaymentMethod;
  note?: string;
  shippingAddress: ShippingAddress;
  items?: CreateOrderItem[];
}

export interface OrderCreateResponse {
  orderId: string;
  orderCode: string;
  totalAmount: number;
  status: string;
  paymentMethod: PaymentMethod;
  checkoutUrl?: string | null;
}

export interface CheckoutCartItem {
  variantId: number;
  productName: string;
  productSlug?: string;
  sku?: string;
  thumbnailUrl: string | null;
  price: number;
  quantity: number;
  subtotal: number;
}
