import React from 'react';
import Link from 'next/link';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { buttonVariants, Typography } from '@/components/ui';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/shared/constants';

interface CartEmptyStateProps {
  isGuest?: boolean;
}

export function CartEmptyState({ isGuest = false }: CartEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4 max-w-md mx-auto">
      <div className="flex size-20 items-center justify-center rounded-2xl bg-muted/80 text-muted-foreground shadow-2xs mb-6">
        <ShoppingBag className="size-10 stroke-[1.5]" />
      </div>

      <Typography.H2 className="text-2xl font-bold tracking-tight mb-2">
        {isGuest ? 'Sign in to view your cart' : 'Your shopping cart is empty'}
      </Typography.H2>

      <Typography.Muted className="text-sm mb-8">
        {isGuest
          ? 'Log in to your account to view saved cart items, synchronize across devices, and checkout smoothly.'
          : "Looks like you haven't added any items to your cart yet. Explore our latest arrivals and top-rated products!"}
      </Typography.Muted>

      {isGuest ? (
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Link
            href={`${ROUTES.AUTH.LOGIN}?redirect=${encodeURIComponent(ROUTES.SHOP.CART)}`}
            className={cn(buttonVariants({ size: 'lg' }), 'flex-1 rounded-xl font-semibold shadow-xs')}
          >
            Sign In
          </Link>
          <Link
            href={ROUTES.HOME}
            className={cn(buttonVariants({ variant: 'outline', size: 'lg' }), 'flex-1 rounded-xl font-semibold')}
          >
            Continue Browsing
          </Link>
        </div>
      ) : (
        <Link
          href={ROUTES.SHOP.CATALOG}
          className={cn(buttonVariants({ size: 'lg' }), 'rounded-xl font-semibold gap-2 shadow-xs px-8')}
        >
          Start Shopping
          <ArrowRight className="size-4" />
        </Link>
      )}
    </div>
  );
}
