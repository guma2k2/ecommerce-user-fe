import type { Metadata } from 'next';
import { CheckoutSuccessContainer } from '@/features/checkout';

export const metadata: Metadata = {
  title: 'Order Confirmed | Storefront',
  description: 'Your order has been placed successfully.',
};

interface CheckoutSuccessPageProps {
  searchParams: Promise<{
    order_code?: string;
    order_id?: string;
    session_id?: string;
  }>;
}

export default async function CheckoutSuccessPage({ searchParams }: CheckoutSuccessPageProps) {
  const resolvedParams = await searchParams;

  return (
    <CheckoutSuccessContainer
      orderCode={resolvedParams.order_code}
      orderId={resolvedParams.order_id}
      sessionId={resolvedParams.session_id}
    />
  );
}
