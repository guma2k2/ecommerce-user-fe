'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/features/cart';
import { CheckoutContainer } from '@/features/checkout';
import { useAuthStore } from '@/shared/stores/authStore';
import { ROUTES } from '@/shared/constants';

export function CheckoutClient() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isInitializing = useAuthStore((state) => state.isInitializing);
  const { items, totalPrice, isLoading: isCartLoading } = useCart();

  useEffect(() => {
    if (!isInitializing && !isAuthenticated) {
      router.push(`${ROUTES.AUTH.LOGIN}?redirect=${encodeURIComponent(ROUTES.SHOP.CHECKOUT)}`);
    }
  }, [isAuthenticated, isInitializing, router]);

  const formattedItems = (items || []).map((item) => ({
    variantId: item.variant.variantId,
    productName: item.variant.productName,
    productSlug: item.variant.productSlug,
    sku: item.variant.sku,
    thumbnailUrl: item.variant.thumbnailUrl,
    price: item.variant.price,
    quantity: item.quantity,
    subtotal: item.subtotal,
  }));

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <CheckoutContainer
        items={formattedItems}
        totalPrice={totalPrice}
        isLoading={isCartLoading}
      />
    </div>
  );
}
