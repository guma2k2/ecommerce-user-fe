'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { buttonVariants, Typography } from '@/components/ui';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/shared/constants';

interface CartEmptyStateProps {
  isGuest?: boolean;
}

export function CartEmptyState({ isGuest = false }: CartEmptyStateProps) {
  const { t } = useTranslation('cart');

  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4 max-w-md mx-auto">
      <div className="flex size-20 items-center justify-center rounded-2xl bg-muted/80 text-muted-foreground shadow-2xs mb-6">
        <ShoppingBag className="size-10 stroke-[1.5]" />
      </div>

      <Typography.H2 className="text-2xl font-bold tracking-tight mb-2">
        {isGuest ? t('empty.guestTitle') : t('empty.title')}
      </Typography.H2>

      <Typography.Muted className="text-sm mb-8">
        {isGuest ? t('empty.guestDescription') : t('empty.description')}
      </Typography.Muted>

      {isGuest ? (
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Link
            href={`${ROUTES.AUTH.LOGIN}?redirect=${encodeURIComponent(ROUTES.SHOP.CART)}`}
            className={cn(buttonVariants({ size: 'lg' }), 'flex-1 rounded-xl font-semibold shadow-xs')}
          >
            {t('empty.signIn')}
          </Link>
          <Link
            href={ROUTES.HOME}
            className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'flex-1 rounded-xl font-semibold')}
          >
            {t('empty.continueBrowsing')}
          </Link>
        </div>
      ) : (
        <Link
          href={ROUTES.SHOP.CATALOG}
          className={cn(buttonVariants({ size: 'lg' }), 'rounded-xl font-semibold gap-2 shadow-xs px-8')}
        >
          {t('empty.action')}
          <ArrowRight className="size-4" />
        </Link>
      )}
    </div>
  );
}
