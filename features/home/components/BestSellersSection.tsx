'use client';

import React from 'react';
import Link from 'next/link';
import { Flame, ArrowRight } from 'lucide-react';
import { ROUTES } from '@/shared/constants';
import { Button, Typography } from '@/components/ui';
import {
  SearchProductCard,
  SearchProductCardSkeleton,
  useBestSellers,
} from '@/features/search';

interface BestSellersSectionProps {
  limit?: number;
  className?: string;
}

export function BestSellersSection({ limit = 8, className = '' }: BestSellersSectionProps) {
  const { data: products, isLoading, isError } = useBestSellers(limit);

  return (
    <section className={`space-y-6 ${className}`}>
      {/* Header Bar */}
      <div className="flex items-end justify-between border-b border-border/60 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="flex size-7 items-center justify-center rounded-lg bg-orange-500/10 text-orange-500">
              <Flame className="size-4 fill-orange-500" />
            </div>
            <Typography.H2 className="text-xl sm:text-2xl font-extrabold">
              Best Sellers
            </Typography.H2>
          </div>
          <Typography.Muted className="text-xs sm:text-sm">
            Top trending products chosen by thousands of happy customers this week.
          </Typography.Muted>
        </div>

        <Link href={ROUTES.SHOP.SEARCH}>
          <Button variant="ghost" size="sm" className="gap-1.5 text-xs font-semibold hover:text-primary">
            <span>View All</span>
            <ArrowRight className="size-3.5" />
          </Button>
        </Link>
      </div>

      {/* Grid or Skeleton State */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
          {Array.from({ length: limit }).map((_, idx) => (
            <SearchProductCardSkeleton key={idx} />
          ))}
        </div>
      ) : isError || !products || products.length === 0 ? (
        <div className="py-12 text-center text-sm text-muted-foreground border border-dashed rounded-2xl bg-muted/10">
          No best-selling products found at this moment.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
          {products.map((item) => (
            <SearchProductCard key={item.id} product={item} />
          ))}
        </div>
      )}
    </section>
  );
}
