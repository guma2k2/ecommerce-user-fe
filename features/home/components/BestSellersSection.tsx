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
    <section className={`space-y-4 ${className}`}>
      {/* Header Bar */}
      <div className="flex items-end justify-between border-b border-border/50 pb-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <div className="flex size-6.5 items-center justify-center rounded-md bg-orange-500/10 text-orange-500">
              <Flame className="size-3.5 fill-orange-500" />
            </div>
            <Typography.H3 className="font-bold">
              Best Sellers
            </Typography.H3>
          </div>
          <Typography.Muted className="text-xs">
            Top trending products chosen by thousands of happy customers this week.
          </Typography.Muted>
        </div>

        <Link href={ROUTES.SHOP.SEARCH}>
          <Button variant="ghost" size="sm" className="font-semibold hover:text-primary h-8 px-2.5 text-xs">
            <span>View All</span>
            <ArrowRight className="size-3.5" />
          </Button>
        </Link>
      </div>

      {/* Grid or Skeleton State */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5 sm:gap-3">
          {Array.from({ length: limit }).map((_, idx) => (
            <SearchProductCardSkeleton key={idx} />
          ))}
        </div>
      ) : isError || !products || products.length === 0 ? (
        <div className="py-10 text-center text-xs text-muted-foreground border border-dashed rounded-xl bg-muted/10">
          No best-selling products found at this moment.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5 sm:gap-3">
          {products.map((item) => (
            <SearchProductCard key={item.id} product={item} />
          ))}
        </div>
      )}
    </section>
  );
}
