import type { Metadata } from 'next';
import { CheckoutClient } from './CheckoutClient';

export const metadata: Metadata = {
  title: 'Secure Checkout | Storefront',
  description: 'Enter your shipping address and select payment method to complete your order.',
};

export default function CheckoutPage() {
  return <CheckoutClient />;
}
