export type PaymentMethod = 'COD' | 'STRIPE';

export interface ShippingAddress {
  receiverName: string;
  receiverPhone: string;
  shippingAddress: string;
  city: string;
  district: string;
  postalCode: string;
}
