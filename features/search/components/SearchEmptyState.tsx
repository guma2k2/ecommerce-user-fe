'use client';

import React from 'react';
import { PackageSearch, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui';

interface SearchEmptyStateProps {
  keyword?: string;
  hasActiveFilters?: boolean;
  onResetFilters: () => void;
}

export function SearchEmptyState({
  keyword,
  hasActiveFilters,
  onResetFilters,
}: SearchEmptyStateProps) {
  return (
    <div
      data-slot="search-empty-state"
      className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border/80 bg-muted/20 px-6 py-16 text-center animate-in fade-in duration-300"
    >
      <div className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary mb-4 shadow-inner">
        <PackageSearch className="size-8" />
      </div>

      <h3 className="text-xl font-bold text-foreground tracking-tight">
        No products found
      </h3>

      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        {keyword ? (
          <>
            We couldn&apos;t find any items matching &ldquo;
            <span className="font-semibold text-foreground">{keyword}</span>
            &rdquo;. Check your spelling or try broader search terms.
          </>
        ) : (
          'There are no products matching your selected filter criteria. Try clearing some filters to explore more products.'
        )}
      </p>

      {hasActiveFilters && (
        <div className="mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={onResetFilters}
            className="gap-2 rounded-xl font-semibold shadow-xs"
          >
            <RotateCcw className="size-4" />
            Reset all filters
          </Button>
        </div>
      )}
    </div>
  );
}
