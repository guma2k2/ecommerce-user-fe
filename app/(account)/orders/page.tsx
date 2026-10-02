import type { Metadata } from 'next';
import { OrdersClient } from './OrdersClient';

export const metadata: Metadata = {
  title: 'My Orders | Storefront',
  description: 'View order history, track shipments, and manage deliveries.',
};

export default function OrdersPage() {
  return <OrdersClient />;
}
