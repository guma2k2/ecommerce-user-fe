'use client';

import React from 'react';
import { SearchProductCard } from './SearchProductCard';
import { SearchProductCardSkeleton } from './SearchProductCardSkeleton';
import { SearchEmptyState } from './SearchEmptyState';
import type { ProductSearchItem } from '../types';

interface SearchProductGridProps {
  products: ProductSearchItem[];
  isLoading: boolean;
  hasActiveFilters: boolean;
  keyword?: string;
  pageSize?: number;
  onResetFilters: () => void;
}

export function SearchProductGrid({
  products,
  isLoading,
  hasActiveFilters,
  keyword,
  pageSize = 12,
  onResetFilters,
}: SearchProductGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-2 sm:gap-2.5 lg:gap-3">
        {Array.from({ length: pageSize }).map((_, index) => (
          <SearchProductCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <SearchEmptyState
        keyword={keyword}
        hasActiveFilters={hasActiveFilters}
        onResetFilters={onResetFilters}
      />
    );
  }

  return (
    <div
      data-slot="search-product-grid"
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-5 gap-2 sm:gap-2.5 lg:gap-3"
    >
      {products.map((product) => (
        <SearchProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
