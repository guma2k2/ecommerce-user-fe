'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import { Button, buttonVariants, Typography } from '@/components/ui';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/shared/constants';
import { useCart } from '../hooks';
import { CartSkeleton } from './CartSkeleton';
import { CartEmptyState } from './CartEmptyState';
import { CartItemList } from './CartItemList';
import { CartSummary } from './CartSummary';

export function CartPageContent() {
  const { t } = useTranslation('cart');
  const { t: tCommon } = useTranslation('common');
  const { cart, items, totalQuantity, totalPrice, isLoading, isError, refetch, isAuthenticated } =
    useCart();

  // If user is not signed in
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <CartEmptyState isGuest />
      </div>
    );
  }

  // Initial loading state
  if (isLoading) {
    return (
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="h-8 w-48 bg-muted/60 animate-pulse rounded-md mb-8" />
        <CartSkeleton />
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="max-w-md mx-auto space-y-4">
          <Typography.H2 className="text-xl font-bold">{t('error.title')}</Typography.H2>
          <Typography.Muted className="text-sm">
            {t('error.description')}
          </Typography.Muted>
          <Button onClick={() => refetch()} variant="outline" className="rounded-xl">
            {t('error.retry')}
          </Button>
        </div>
      </div>
    );
  }

  // Empty cart state
  if (!cart || items.length === 0) {
    return (
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <CartEmptyState />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between pb-6">
        <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
          <Link href={ROUTES.HOME} className="hover:text-foreground transition-colors">
            {tCommon('nav.home')}
          </Link>
          <ChevronRight className="size-3.5" />
          <span className="text-foreground font-medium">{t('title')}</span>
        </div>

        <Link
          href={ROUTES.SHOP.CATALOG}
          className={cn(
            buttonVariants({ variant: 'ghost', size: 'sm' }),
            'text-xs text-muted-foreground hover:text-foreground flex items-center gap-1.5'
          )}
        >
          <ArrowLeft className="size-3.5" />
          {t('summary.continueShopping')}
        </Link>
      </div>

      <Typography.H1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-8">
        {t('title')}
      </Typography.H1>

      {/* Main 2-column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8">
          <CartItemList items={items} totalQuantity={totalQuantity} />
        </div>

        <div className="lg:col-span-4">
          <CartSummary
            totalPrice={totalPrice}
            totalQuantity={totalQuantity}
            items={items}
          />
        </div>
      </div>
    </div>
  );
}
