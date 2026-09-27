'use client';

import React from 'react';
import Link from 'next/link';
import { Flame, ArrowRight } from 'lucide-react';
import { ROUTES } from '@/shared/constants';
import { Button } from '@/components/ui';
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
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground">
              Best Sellers
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Top trending products chosen by thousands of happy customers this week.
          </p>
        </div>

        <Link href={ROUTES.SHOP.SEARCH}>
          <Button variant="ghost" size="sm" className="gap-1.5 font-semibold text-primary">
            <span>View All</span>
            <ArrowRight className="size-4" />
          </Button>
        </Link>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {Array.from({ length: limit }).map((_, idx) => (
            <SearchProductCardSkeleton key={idx} />
          ))}
        </div>
      )}

      {/* Error or Empty state */}
      {!isLoading && (isError || !products || products.length === 0) && (
        <div className="rounded-2xl border border-dashed border-border/80 p-8 text-center bg-card/40">
          <p className="text-sm font-medium text-muted-foreground">
            No best-selling products found at the moment.
          </p>
          <Link href={ROUTES.SHOP.SEARCH} className="inline-block mt-3">
            <Button variant="outline" size="sm">
              Explore All Products
            </Button>
          </Link>
        </div>
      )}

      {/* Product Cards Grid */}
      {!isLoading && products && products.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product) => (
            <SearchProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}
