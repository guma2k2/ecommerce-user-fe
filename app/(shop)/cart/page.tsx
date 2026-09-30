import type { Metadata } from 'next';
import { CartPageContent } from '@/features/cart';

export const metadata: Metadata = {
  title: 'Shopping Cart | Storefront',
  description: 'Review your selected items, modify quantities, and proceed to checkout.',
};

export default function CartPage() {
  return <CartPageContent />;
}
